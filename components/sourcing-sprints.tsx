// // COMMENTED OUT - Sourcing Sprints Component
// /*
// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { 
//     Zap, 
//     Clock, 
//     Users, 
//     Trophy, 
//     Target,
//     TrendingUp,
//     Calendar,
//     MapPin,
//     DollarSign,
//     Package,
//     Star,
//     Award,
//     Share2,
//     Bell,
//     Play,
//     Pause,
//     CheckCircle,
//     AlertTriangle
// } from "lucide-react";

// interface SourcingSprint {
//     id: string;
//     title: string;
//     description: string;
//     category: string;
//     status: 'upcoming' | 'active' | 'completed' | 'cancelled';
//     startDate: string;
//     endDate: string;
//     duration: number; // hours
//     targetRFQs: number;
//     currentRFQs: number;
//     participatingSuppliers: number;
//     participatingBuyers: number;
//     totalBudget: number;
//     currency: string;
//     prizes: {
//         first: string;
//         second: string;
//         third: string;
//     };
//     rules: string[];
//     benefits: string[];
//     requirements: string[];
//     organizer: {
//         name: string;
//         company: string;
//         verified: boolean;
//     };
//     sponsors: string[];
//     tags: string[];
//     registrationDeadline: string;
//     maxParticipants: number;
//     currentParticipants: number;
// }

// interface SourcingSprintsProps {
//     userRole: 'buyer' | 'supplier' | 'admin';
// }

// export default function SourcingSprints({ userRole }: SourcingSprintsProps) {
//     const [sprints, setSprints] = useState<SourcingSprint[]>([]);
//     const [selectedSprint, setSelectedSprint] = useState<SourcingSprint | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed'>('upcoming');
//     const [isRegistered, setIsRegistered] = useState(false);

//     useEffect(() => {
//         fetchSprints();
//     }, []);

//     const fetchSprints = async () => {
//         try {
//             setIsLoading(true);
//             const response = await fetch('/api/sourcing-sprints');
//             const data = await response.json();
//             if (data.success) {
//                 setSprints(data.data);
//             }
//         } catch (error) {
//             console.error('Error fetching sourcing sprints:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const registerForSprint = async (sprintId: string) => {
//         try {
//             const response = await fetch(`/api/sourcing-sprints/${sprintId}/register`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 setIsRegistered(true);
//                 // Refresh sprints to update participant count
//                 fetchSprints();
//             }
//         } catch (error) {
//             console.error('Error registering for sprint:', error);
//         }
//     };

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'upcoming': return 'text-blue-600 bg-blue-100';
//             case 'active': return 'text-green-600 bg-green-100';
//             case 'completed': return 'text-gray-600 bg-gray-100';
//             case 'cancelled': return 'text-red-600 bg-red-100';
//             default: return 'text-gray-600 bg-gray-100';
//         }
//     };

//     const getStatusIcon = (status: string) => {
//         switch (status) {
//             case 'upcoming': return <Calendar className="h-4 w-4" />;
//             case 'active': return <Play className="h-4 w-4" />;
//             case 'completed': return <CheckCircle className="h-4 w-4" />;
//             case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
//             default: return <Clock className="h-4 w-4" />;
//         }
//     };

//     const getTimeRemaining = (endDate: string) => {
//         const now = new Date();
//         const end = new Date(endDate);
//         const diff = end.getTime() - now.getTime();
        
//         if (diff <= 0) return "Ended";
        
//         const hours = Math.floor(diff / (1000 * 60 * 60));
//         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
//         if (hours > 0) return `${hours}h ${minutes}m left`;
//         return `${minutes}m left`;
//     };

//     const getProgressPercentage = (sprint: SourcingSprint) => {
//         if (sprint.status === 'completed') return 100;
//         if (sprint.status === 'upcoming') return 0;
        
//         const now = new Date();
//         const start = new Date(sprint.startDate);
//         const end = new Date(sprint.endDate);
//         const total = end.getTime() - start.getTime();
//         const elapsed = now.getTime() - start.getTime();
        
//         return Math.min(100, Math.max(0, (elapsed / total) * 100));
//     };

//     const filteredSprints = sprints.filter(sprint => {
//         switch (activeTab) {
//             case 'upcoming': return sprint.status === 'upcoming';
//             case 'active': return sprint.status === 'active';
//             case 'completed': return sprint.status === 'completed';
//             default: return true;
//         }
//     });

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="text-center">
//                     <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-600 font-medium">Loading Sourcing Sprints...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Header */}
// <div className="text-center">
//     <h1 className="text-4xl font-bold text-gray-900 mb-4">
//         Sourcing Sprints
//     </h1>
//     <p className="text-xl text-gray-600 mb-2">
//         48-hour intensive sourcing events with prizes and recognition
//     </p>
//     <p className="text-sm text-gray-500">
//         Fast-paced, competitive sourcing with exclusive rewards
//     </p>
// </div>

// {/* Stats */ }
// <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//     <Card>
//         <CardContent className="p-4 text-center">
//             <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
//             <p className="text-2xl font-bold text-yellow-600">
//                 {sprints.filter(s => s.status === 'active').length}
//             </p>
//             <p className="text-sm text-gray-600">Active Sprints</p>
//         </CardContent>
//     </Card>
//     <Card>
//         <CardContent className="p-4 text-center">
//             <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
//             <p className="text-2xl font-bold text-blue-600">
//                 {sprints.reduce((sum, sprint) => sum + sprint.currentParticipants, 0)}
//             </p>
//             <p className="text-sm text-gray-600">Total Participants</p>
//         </CardContent>
//     </Card>
//     <Card>
//         <CardContent className="p-4 text-center">
//             <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
//             <p className="text-2xl font-bold text-green-600">
//                 ₹{sprints.reduce((sum, sprint) => sum + sprint.totalBudget, 0).toLocaleString()}
//             </p>
//             <p className="text-sm text-gray-600">Total Budget</p>
//         </CardContent>
//     </Card>
//     <Card>
//         <CardContent className="p-4 text-center">
//             <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
//             <p className="text-2xl font-bold text-purple-600">
//                 {sprints.filter(s => s.status === 'completed').length}
//             </p>
//             <p className="text-sm text-gray-600">Completed Sprints</p>
//         </CardContent>
//     </Card>
// </div>

// {/* Tabs */ }
// <div className="flex gap-2">
//     <Button
//         variant={activeTab === 'upcoming' ? 'default' : 'outline'}
//         onClick={() => setActiveTab('upcoming')}
//     >
//         <Calendar className="h-4 w-4 mr-2" />
//         Upcoming
//     </Button>
//     <Button
//         variant={activeTab === 'active' ? 'default' : 'outline'}
//         onClick={() => setActiveTab('active')}
//     >
//         <Play className="h-4 w-4 mr-2" />
//         Active
//     </Button>
//     <Button
//         variant={activeTab === 'completed' ? 'default' : 'outline'}
//         onClick={() => setActiveTab('completed')}
//     >
//         <Trophy className="h-4 w-4 mr-2" />
//         Completed
//     </Button>
// </div>

// {/* Sprint List */ }
// <div className="space-y-6">
//     {filteredSprints.map((sprint) => (
//         <Card key={sprint.id} className="hover:shadow-lg transition-shadow">
//             <CardContent className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                     <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                             <h3 className="text-2xl font-bold text-gray-900">{sprint.title}</h3>
//                             <Badge className={getStatusColor(sprint.status)}>
//                                 <div className="flex items-center gap-1">
//                                     {getStatusIcon(sprint.status)}
//                                     {sprint.status}
//                                 </div>
//                             </Badge>
//                             {sprint.organizer.verified && (
//                                 <Badge variant="outline" className="text-green-600 border-green-600">
//                                     Verified Organizer
//                                 </Badge>
//                             )}
//                         </div>
//                         <p className="text-gray-600 mb-3">{sprint.description}</p>

//                         <div className="flex flex-wrap gap-2 mb-4">
//                             {sprint.tags.map((tag, index) => (
//                                 <Badge key={index} variant="secondary" className="text-xs">
//                                     {tag}
//                                 </Badge>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Progress Bar */}
//                 {sprint.status === 'active' && (
//                     <div className="mb-4">
//                         <div className="flex justify-between text-sm mb-2">
//                             <span>Sprint Progress</span>
//                             <span>{getTimeRemaining(sprint.endDate)}</span>
//                         </div>
//                         <Progress value={getProgressPercentage(sprint)} />
//                     </div>
//                 )}

//                 {/* Sprint Details */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
//                     <div>
//                         <p className="text-sm text-gray-600">Duration</p>
//                         <p className="font-semibold">{sprint.duration} hours</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-600">RFQs</p>
//                         <p className="font-semibold">{sprint.currentRFQs}/{sprint.targetRFQs}</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-600">Participants</p>
//                         <p className="font-semibold">{sprint.currentParticipants}/{sprint.maxParticipants}</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-600">Total Budget</p>
//                         <p className="font-semibold text-green-600">₹{sprint.totalBudget.toLocaleString()}</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-600">Organizer</p>
//                         <p className="font-semibold">{sprint.organizer.company}</p>
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-600">Start Date</p>
//                         <p className="font-semibold">{new Date(sprint.startDate).toLocaleDateString()}</p>
//                     </div>
//                 </div>

//                 {/* Prizes */}
//                 <div className="mb-4">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-2">Prizes & Rewards</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="text-center p-4 bg-yellow-50 rounded-lg">
//                             <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
//                             <p className="font-semibold text-yellow-800">1st Place</p>
//                             <p className="text-sm text-yellow-700">{sprint.prizes.first}</p>
//                         </div>
//                         <div className="text-center p-4 bg-gray-50 rounded-lg">
//                             <Award className="h-8 w-8 text-gray-500 mx-auto mb-2" />
//                             <p className="font-semibold text-gray-800">2nd Place</p>
//                             <p className="text-sm text-gray-700">{sprint.prizes.second}</p>
//                         </div>
//                         <div className="text-center p-4 bg-orange-50 rounded-lg">
//                             <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
//                             <p className="font-semibold text-orange-800">3rd Place</p>
//                             <p className="text-sm text-orange-700">{sprint.prizes.third}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Benefits */}
//                 <div className="mb-4">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Benefits</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                         {sprint.benefits.map((benefit, index) => (
//                             <div key={index} className="flex items-start gap-2">
//                                 <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                 <span className="text-sm text-gray-700">{benefit}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-1">
//                             <Users className="h-4 w-4" />
//                             <span>{sprint.participatingSuppliers} suppliers</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                             <Target className="h-4 w-4" />
//                             <span>{sprint.participatingBuyers} buyers</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                             <Calendar className="h-4 w-4" />
//                             <span>Register by {new Date(sprint.registrationDeadline).toLocaleDateString()}</span>
//                         </div>
//                     </div>

//                     <div className="flex gap-2">
//                         <Button size="sm" variant="outline">
//                             <Share2 className="h-4 w-4 mr-1" />
//                             Share
//                         </Button>
//                         <Button size="sm" variant="outline">
//                             <Bell className="h-4 w-4 mr-1" />
//                             Notify Me
//                         </Button>
//                         {sprint.status === 'upcoming' && (
//                             <Button
//                                 size="sm"
//                                 onClick={() => registerForSprint(sprint.id)}
//                                 disabled={isRegistered || sprint.currentParticipants >= sprint.maxParticipants}
//                             >
//                                 {isRegistered ? 'Registered' : 'Register Now'}
//                             </Button>
//                         )}
//                         {sprint.status === 'active' && (
//                             <Button size="sm">
//                                 Join Sprint
//                             </Button>
//                         )}
//                         <Button size="sm" variant="outline" onClick={() => setSelectedSprint(sprint)}>
//                             View Details
//                         </Button>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     ))}
// </div>

// {/* No Results */ }
// {
//     filteredSprints.length === 0 && !isLoading && (
//         <Card>
//             <CardContent className="p-12 text-center">
//                 <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No Sprints Found</h3>
//                 <p className="text-gray-600 mb-4">
//                     {activeTab === 'upcoming' && "No upcoming sourcing sprints scheduled. Check back soon!"}
//                     {activeTab === 'active' && "No active sourcing sprints at the moment."}
//                     {activeTab === 'completed' && "No completed sourcing sprints yet."}
//                 </p>
//                 <Button variant="outline">
//                     <Bell className="h-4 w-4 mr-2" />
//                     Notify Me of New Sprints
//                 </Button>
//             </CardContent>
//         </Card>
//     )
// }

// {/* Sprint Details Modal */ }
// {
//     selectedSprint && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//                 <CardHeader>
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <CardTitle className="text-2xl">{selectedSprint.title}</CardTitle>
//                             <p className="text-gray-600">{selectedSprint.description}</p>
//                         </div>
//                         <Button
//                             variant="outline"
//                             onClick={() => setSelectedSprint(null)}
//                         >
//                             ✕
//                         </Button>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     {/* Rules */}
//                     <div>
//                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Sprint Rules</h3>
//                         <ul className="space-y-2">
//                             {selectedSprint.rules.map((rule, index) => (
//                                 <li key={index} className="flex items-start gap-2">
//                                     <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-gray-700">{rule}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* Requirements */}
//                     <div>
//                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
//                         <ul className="space-y-2">
//                             {selectedSprint.requirements.map((requirement, index) => (
//                                 <li key={index} className="flex items-start gap-2">
//                                     <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-gray-700">{requirement}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* Sponsors */}
//                     {selectedSprint.sponsors.length > 0 && (
//                         <div>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-3">Sponsors</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {selectedSprint.sponsors.map((sponsor, index) => (
//                                     <Badge key={index} variant="outline">
//                                         {sponsor}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="flex gap-4">
//                         {selectedSprint.status === 'upcoming' && (
//                             <Button
//                                 onClick={() => registerForSprint(selectedSprint.id)}
//                                 disabled={isRegistered || selectedSprint.currentParticipants >= selectedSprint.maxParticipants}
//                                 className="flex-1"
//                             >
//                                 {isRegistered ? 'Already Registered' : 'Register for Sprint'}
//                             </Button>
//                         )}
//                         <Button variant="outline">
//                             <Share2 className="h-4 w-4 mr-2" />
//                             Share Sprint
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }
//         </div >
//     );
// }
// */

// export default function SourcingSprints() {
//     return (
//         <div className="p-8 text-center">
//             <h2 className="text-xl font-semibold mb-2">Sourcing Sprints</h2>
//             <p className="text-gray-600">This component is currently disabled</p>
//         </div>
//     );
// }
