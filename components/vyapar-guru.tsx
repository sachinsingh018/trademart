// // COMMENTED OUT - Vyapar Guru AI Advisor Component
// /*
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { 
//     MessageCircle, 
//     Send, 
//     Bot, 
//     Lightbulb, 
//     BookOpen, 
//     TrendingUp,
//     Globe,
//     FileText,
//     Calculator,
//     Shield,
//     Truck,
//     CreditCard,
//     HelpCircle
// } from "lucide-react";

// interface ChatMessage {
//     id: string;
//     type: 'user' | 'guru';
//     message: string;
//     timestamp: Date;
//     suggestions?: string[];
//     resources?: {
//         title: string;
//         url: string;
//         description: string;
//     }[];
// }

// interface VyaparGuruProps {
//     userRole: 'buyer' | 'supplier';
//     onClose?: () => void;
// }

// export default function VyaparGuru({ userRole, onClose }: VyaparGuruProps) {
//     const [messages, setMessages] = useState<ChatMessage[]>([
//         {
//             id: '1',
//             type: 'guru',
//             message: `Namaste! I'm Vyapar Guru, your AI advisor for international trade. I'm here to help you with exporting, importing, RFQ drafting, Incoterms, and growing your business globally. How can I assist you today?`,
//             timestamp: new Date(),
//             suggestions: [
//                 "How do I write a good RFQ?",
//                 "What are Incoterms?",
//                 "How to export from India?",
//                 "What documents do I need?"
//             ]
//         }
//     ]);
//     const [inputMessage, setInputMessage] = useState("");
//     const [isTyping, setIsTyping] = useState(false);
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleSendMessage = async () => {
//         if (!inputMessage.trim()) return;

//         const userMessage: ChatMessage = {
//             id: Date.now().toString(),
//             type: 'user',
//             message: inputMessage,
//             timestamp: new Date()
//         };

//         setMessages(prev => [...prev, userMessage]);
//         setInputMessage("");
//         setIsTyping(true);

//         // Simulate AI response
//         setTimeout(() => {
//             const guruResponse = generateGuruResponse(inputMessage, userRole);
//             setMessages(prev => [...prev, guruResponse]);
//             setIsTyping(false);
//         }, 1500);
//     };

//     const generateGuruResponse = (userMessage: string, role: string): ChatMessage => {
//         const message = userMessage.toLowerCase();
        
//         // RFQ related responses
//         if (message.includes('rfq') || message.includes('request for quotation')) {
//             return {
//                 id: Date.now().toString(),
//                 type: 'guru',
//                 message: `Great question! A good RFQ should include:\n\n1. **Clear Product Description**: Specify exact requirements, materials, dimensions\n2. **Quantity & Timeline**: How many units and when you need them\n3. **Quality Standards**: Mention certifications, testing requirements\n4. **Budget Range**: Give suppliers a price range to work with\n5. **Delivery Terms**: Specify Incoterms (FOB, CIF, etc.)\n6. **Payment Terms**: How you'll pay (LC, TT, etc.)\n\nWould you like me to help you draft a specific RFQ?`,
//                 timestamp: new Date(),
//                 suggestions: [
//                     "Help me draft an RFQ for electronics",
//                     "What are quality standards for textiles?",
//                     "How to specify delivery terms?"
//                 ],
//                 resources: [
//                     {
//                         title: "RFQ Template Guide",
//                         url: "/templates/rfq-template",
//                         description: "Download our comprehensive RFQ template"
//                     },
//                     {
//                         title: "Product Specification Examples",
//                         url: "/guides/product-specs",
//                         description: "See examples of detailed product specifications"
//                     }
//                 ]
//             };
//         }

//         // Incoterms related responses
//         if (message.includes('incoterm') || message.includes('delivery terms')) {
//             return {
//                 id: Date.now().toString(),
//                 type: 'guru',
//                 message: `Incoterms are international trade terms that define responsibilities between buyers and sellers. Here are the most common ones:\n\n**FOB (Free on Board)**: Seller delivers goods to the port, buyer handles shipping\n**CIF (Cost, Insurance, Freight)**: Seller pays for shipping and insurance\n**EXW (Ex Works)**: Buyer picks up from seller's premises\n**DDP (Delivered Duty Paid)**: Seller handles everything including customs\n\nFor Indian exporters, FOB is often preferred as it gives more control over shipping. Which Incoterm are you considering?`,
//                 timestamp: new Date(),
//                 suggestions: [
//                     "Which Incoterm is best for my product?",
//                     "How to calculate CIF price?",
//                     "What are the risks with each Incoterm?"
//                 ],
//                 resources: [
//                     {
//                         title: "Incoterms 2020 Guide",
//                         url: "/guides/incoterms-2020",
//                         description: "Complete guide to Incoterms with examples"
//                     }
//                 ]
//             };
//         }

//         // Export related responses
//         if (message.includes('export') || message.includes('exporting')) {
//             return {
//                 id: Date.now().toString(),
//                 type: 'guru',
//                 message: `Exporting from India involves several steps:\n\n1. **Get IEC Code**: Import Export Code from DGFT\n2. **Register with Export Promotion Council**: Relevant to your industry\n3. **Open Bank Account**: For export transactions\n4. **Get Quality Certifications**: ISO, BIS, etc.\n5. **Find Buyers**: Use platforms like TradeMart, Alibaba\n6. **Prepare Documents**: Commercial Invoice, Packing List, COO\n7. **Ship Goods**: Use freight forwarders\n\nWhat specific aspect of exporting would you like to know more about?`,
//                 timestamp: new Date(),
//                 suggestions: [
//                     "How to get IEC code?",
//                     "What documents do I need?",
//                     "How to find international buyers?"
//                 ],
//                 resources: [
//                     {
//                         title: "Export Documentation Checklist",
//                         url: "/checklists/export-docs",
//                         description: "Complete checklist of export documents"
//                     },
//                     {
//                         title: "IEC Code Application Guide",
//                         url: "/guides/iec-code",
//                         description: "Step-by-step guide to get IEC code"
//                     }
//                 ]
//             };
//         }

//         // Documents related responses
//         if (message.includes('document') || message.includes('paperwork')) {
//             return {
//                 id: Date.now().toString(),
//                 type: 'guru',
//                 message: `Essential export documents include:\n\n**Commercial Documents**:\n- Commercial Invoice\n- Packing List\n- Certificate of Origin\n\n**Shipping Documents**:\n- Bill of Lading (B/L)\n- Airway Bill (for air cargo)\n- Shipping Bill\n\n**Financial Documents**:\n- Letter of Credit\n- Bank Guarantee\n- Insurance Certificate\n\n**Regulatory Documents**:\n- Export License (if required)\n- Phytosanitary Certificate (for agricultural products)\n- Test Certificate (for certain products)\n\nWhich documents are you specifically asking about?`,
//                 timestamp: new Date(),
//                 suggestions: [
//                     "How to prepare Commercial Invoice?",
//                     "What is Certificate of Origin?",
//                     "How to get Export License?"
//                 ]
//             };
//         }

//         // Payment related responses
//         if (message.includes('payment') || message.includes('lc') || message.includes('letter of credit')) {
//             return {
//                 id: Date.now().toString(),
//                 type: 'guru',
//                 message: `Payment methods in international trade:\n\n**Letter of Credit (LC)**: Most secure, bank guarantees payment\n**Telegraphic Transfer (TT)**: Direct bank transfer\n**Documentary Collection**: Bank handles documents\n**Open Account**: Trust-based, payment after delivery\n\nFor new relationships, LC is recommended. For trusted partners, TT is faster and cheaper. What's your payment situation?`,
//                 timestamp: new Date(),
//                 suggestions: [
//                     "How does Letter of Credit work?",
//                     "What are TT payment terms?",
//                     "How to reduce payment risks?"
//                 ]
//             };
//         }

//         // Default response
//         return {
//             id: Date.now().toString(),
//             type: 'guru',
//             message: `I understand you're asking about "${userMessage}". Let me help you with that. Could you provide more specific details about what you'd like to know? I can assist with:\n\n- RFQ drafting and optimization\n- Export/import procedures\n- Incoterms and delivery terms\n- Documentation requirements\n- Payment methods and risks\n- Market research and pricing\n- Quality standards and certifications\n\nWhat specific aspect would you like to explore?`,
//             timestamp: new Date(),
//             suggestions: [
//                 "Help me with RFQ drafting",
//                 "Explain export procedures",
//                 "What are Incoterms?",
//                 "How to handle payments?"
//             ]
//         };
//     };

//     const handleSuggestionClick = (suggestion: string) => {
//         setInputMessage(suggestion);
//     };

//     const quickActions = [
//         {
//             icon: <FileText className="h-4 w-4" />,
//             title: "RFQ Templates",
//             description: "Get industry-specific RFQ templates"
//         },
//         {
//             icon: <Globe className="h-4 w-4" />,
//             title: "Export Guide",
//             description: "Step-by-step export procedures"
//         },
//         {
//             icon: <Calculator className="h-4 w-4" />,
//             title: "Price Calculator",
//             description: "Calculate landed costs and margins"
//         },
//         {
//             icon: <Shield className="h-4 w-4" />,
//             title: "Risk Assessment",
//             description: "Evaluate trade risks and mitigation"
//         }
//     ];

//     return (
//         <Card className="h-[600px] flex flex-col">
//             <CardHeader className="flex-shrink-0">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                             <Bot className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-lg">Vyapar Guru</CardTitle>
//                             <p className="text-sm text-gray-600">Your AI Trade Advisor</p>
//                         </div>
//                     </div>
//                     {onClose && (
//                         <Button variant="ghost" size="sm" onClick={onClose}>
//                             ✕
//                         </Button>
//                     )}
//                 </div>
//             </CardHeader>

//             <CardContent className="flex-1 flex flex-col p-0">
//                 {/* Messages */}
// <div className="flex-1 overflow-y-auto p-4 space-y-4">
//     {messages.map((message) => (
//         <div
//             key={message.id}
//             className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//         >
//             <div
//                 className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
//                         ? 'bg-blue-500 text-white'
//                         : 'bg-gray-100 text-gray-900'
//                     }`}
//             >
//                 <div className="whitespace-pre-wrap">{message.message}</div>

//                 {/* Suggestions */}
//                 {message.suggestions && (
//                     <div className="mt-3 space-y-2">
//                         {message.suggestions.map((suggestion, index) => (
//                             <Button
//                                 key={index}
//                                 variant="outline"
//                                 size="sm"
//                                 className="mr-2 mb-2 text-xs"
//                                 onClick={() => handleSuggestionClick(suggestion)}
//                             >
//                                 {suggestion}
//                             </Button>
//                         ))}
//                     </div>
//                 )}

//                 {/* Resources */}
//                 {message.resources && (
//                     <div className="mt-3 space-y-2">
//                         <p className="text-sm font-medium">Helpful Resources:</p>
//                         {message.resources.map((resource, index) => (
//                             <div key={index} className="text-sm">
//                                 <a
//                                     href={resource.url}
//                                     className="text-blue-600 hover:underline"
//                                 >
//                                     {resource.title}
//                                 </a>
//                                 <p className="text-xs text-gray-500">{resource.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 <div className="text-xs opacity-70 mt-2">
//                     {message.timestamp.toLocaleTimeString()}
//                 </div>
//             </div>
//         </div>
//     ))}

//     {isTyping && (
//         <div className="flex justify-start">
//             <div className="bg-gray-100 rounded-lg p-3">
//                 <div className="flex items-center gap-2">
//                     <div className="flex space-x-1">
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                     </div>
//                     <span className="text-sm text-gray-600">Vyapar Guru is typing...</span>
//                 </div>
//             </div>
//         </div>
//     )}

//     <div ref={messagesEndRef} />
// </div>

// {/* Quick Actions */ }
// <div className="border-t p-4">
//     <div className="grid grid-cols-2 gap-2 mb-4">
//         {quickActions.map((action, index) => (
//             <Button
//                 key={index}
//                 variant="outline"
//                 size="sm"
//                 className="h-auto p-3 flex flex-col items-center gap-2"
//                 onClick={() => handleSuggestionClick(action.title)}
//             >
//                 {action.icon}
//                 <div className="text-center">
//                     <div className="text-xs font-medium">{action.title}</div>
//                     <div className="text-xs text-gray-500">{action.description}</div>
//                 </div>
//             </Button>
//         ))}
//     </div>

//     {/* Input */}
//     <div className="flex gap-2">
//         <Input
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             placeholder="Ask Vyapar Guru anything about trade..."
//             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//             className="flex-1"
//         />
//         <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
//             <Send className="h-4 w-4" />
//         </Button>
//     </div>
// </div>
//             </CardContent >
//         </Card >
//     );
// }
// */

// export default function VyaparGuru() {
//     return (
//         <div className="p-8 text-center">
//             <h2 className="text-xl font-semibold mb-2">Vyapar Guru AI Advisor</h2>
//             <p className="text-gray-600">This component is currently disabled</p>
//         </div>
//     );
// }
