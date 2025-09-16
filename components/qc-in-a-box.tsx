"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    Camera, 
    Video, 
    Upload, 
    CheckCircle, 
    XCircle, 
    AlertTriangle,
    Star,
    FileText,
    Image as ImageIcon,
    Play
} from "lucide-react";

interface QCReport {
    id: string;
    orderId: string;
    status: 'pending' | 'passed' | 'failed' | 'disputed';
    photos: string[];
    videos: string[];
    notes: string;
    score: number;
    createdAt: string;
    updatedAt: string;
}

interface QCInABoxProps {
    orderId: string;
    onQCComplete: (report: QCReport) => void;
}

export default function QCInABox({ orderId, onQCComplete }: QCInABoxProps) {
    const [photos, setPhotos] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [notes, setNotes] = useState("");
    const [score, setScore] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [previewVideos, setPreviewVideos] = useState<string[]>([]);
    
    const photoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        setPhotos(prev => [...prev, ...imageFiles]);
        
        // Create previews
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImages(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const videoFiles = files.filter(file => file.type.startsWith('video/'));
        
        setVideos(prev => [...prev, ...videoFiles]);
        
        // Create previews
        videoFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewVideos(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = (index: number) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
        setPreviewVideos(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async (): Promise<string[]> => {
        const uploadedUrls: string[] = [];
        
        // Upload photos
        for (const photo of photos) {
            const formData = new FormData();
            formData.append('file', photo);
            formData.append('type', 'photo');
            formData.append('orderId', orderId);
            
            const response = await fetch('/api/upload/qc-media', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                const data = await response.json();
                uploadedUrls.push(data.url);
            }
        }
        
        // Upload videos
        for (const video of videos) {
            const formData = new FormData();
            formData.append('file', video);
            formData.append('type', 'video');
            formData.append('orderId', orderId);
            
            const response = await fetch('/api/upload/qc-media', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                const data = await response.json();
                uploadedUrls.push(data.url);
            }
        }
        
        return uploadedUrls;
    };

    const submitQCReport = async () => {
        if (photos.length === 0 && videos.length === 0) {
            alert('Please upload at least one photo or video for QC');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Upload files
            const uploadedUrls = await uploadFiles();
            setUploadProgress(50);

            // Create QC report
            const response = await fetch('/api/qc/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    photos: uploadedUrls.filter(url => url.includes('photo')),
                    videos: uploadedUrls.filter(url => url.includes('video')),
                    notes,
                    score,
                    status: score >= 70 ? 'passed' : 'failed'
                }),
            });

            if (response.ok) {
                const report = await response.json();
                setUploadProgress(100);
                onQCComplete(report.data);
                
                // Reset form
                setPhotos([]);
                setVideos([]);
                setNotes("");
                setScore(0);
                setPreviewImages([]);
                setPreviewVideos([]);
            } else {
                throw new Error('Failed to submit QC report');
            }
        } catch (error) {
            console.error('Error submitting QC report:', error);
            alert('Failed to submit QC report. Please try again.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreIcon = (score: number) => {
        if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        return <XCircle className="h-5 w-5 text-red-500" />;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        QC-in-a-Box
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Upload photos and videos to document product quality
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Photo Upload */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Photos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {previewImages.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`QC Photo ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removePhoto(index)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <div
                                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                onClick={() => photoInputRef.current?.click()}
                            >
                                <div className="text-center">
                                    <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                    <span className="text-xs text-gray-500">Add Photo</span>
                                </div>
                            </div>
                        </div>
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Video Upload */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Videos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {previewVideos.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <video
                                        src={preview}
                                        className="w-full h-32 object-cover rounded-lg border"
                                        controls
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeVideo(index)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <div
                                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                onClick={() => videoInputRef.current?.click()}
                            >
                                <div className="text-center">
                                    <Video className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                    <span className="text-xs text-gray-500">Add Video</span>
                                </div>
                            </div>
                        </div>
                        <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleVideoUpload}
                            className="hidden"
                        />
                    </div>

                    {/* QC Score */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Quality Score</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Score:</span>
                                <div className="flex items-center gap-2">
                                    {getScoreIcon(score)}
                                    <span className={`font-medium ${getScoreColor(score)}`}>
                                        {score}/100
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Progress value={score} className="h-2" />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Poor (0-59)</span>
                                    <span>Fair (60-79)</span>
                                    <span>Good (80-100)</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {[20, 40, 60, 80, 100].map((value) => (
                                    <Button
                                        key={value}
                                        variant={score === value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setScore(value)}
                                    >
                                        {value}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">QC Notes</h3>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Describe any quality issues, defects, or observations..."
                            rows={4}
                        />
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4 text-blue-500" />
                                <span className="text-sm text-gray-600">Uploading QC report...</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        onClick={submitQCReport}
                        disabled={isUploading || (photos.length === 0 && videos.length === 0)}
                        className="w-full"
                    >
                        {isUploading ? (
                            <>
                                <Upload className="h-4 w-4 mr-2 animate-spin" />
                                Submitting QC Report...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Submit QC Report
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* QC Guidelines */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        QC Guidelines
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Photo Requirements</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Take clear, well-lit photos of the product</li>
                                <li>• Include multiple angles (front, back, sides)</li>
                                <li>• Document any defects or quality issues</li>
                                <li>• Show packaging and labeling</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Video Requirements</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Record product functionality demonstrations</li>
                                <li>• Show product assembly or setup process</li>
                                <li>• Document any quality issues in motion</li>
                                <li>• Keep videos under 2 minutes for faster upload</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Scoring Guidelines</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• 80-100: Excellent quality, meets all specifications</li>
                                <li>• 60-79: Good quality, minor issues acceptable</li>
                                <li>• 0-59: Poor quality, significant issues present</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
