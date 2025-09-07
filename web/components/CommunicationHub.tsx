"use client"

import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Video, 
  Phone, 
  Users, 
  Send,
  Paperclip,
  Mic,
  MicOff,
  VideoOff,
  Search,
  Settings,
  AlertTriangle,
  Shield,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'location' | 'alert';
  priority?: 'normal' | 'high' | 'urgent';
}

interface Contact {
  id: string;
  name: string;
  role: 'officer' | 'tourist' | 'admin' | 'emergency';
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
  location?: string;
  lastSeen?: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Officer Martinez',
    role: 'officer',
    status: 'online',
    location: 'Times Square Patrol',
    avatar: ''
  },
  {
    id: '2',
    name: 'Sarah Chen (Tourist)',
    role: 'tourist',
    status: 'online',
    location: 'Central Park'
  },
  {
    id: '3',
    name: 'Dispatch Center',
    role: 'admin',
    status: 'online',
    location: 'Command Center'
  },
  {
    id: '4',
    name: 'Emergency Services',
    role: 'emergency',
    status: 'online',
    location: 'Emergency Response'
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'Officer Martinez',
    content: 'Tourist assistance request completed at Times Square. All clear.',
    timestamp: '14:23',
    type: 'text'
  },
  {
    id: '2',
    sender: 'Dispatch Center',
    content: 'New SOS alert received from Central Park. Please respond.',
    timestamp: '14:25',
    type: 'alert',
    priority: 'urgent'
  },
  {
    id: '3',
    sender: 'Sarah Chen',
    content: 'Thank you for the quick assistance! Very helpful.',
    timestamp: '14:26',
    type: 'text'
  }
];

const activeVideoCalls = [
  {
    id: '1',
    name: 'Emergency Response Team',
    participants: 4,
    duration: '05:32',
    type: 'emergency'
  },
  {
    id: '2',
    name: 'Patrol Group Alpha',
    participants: 3,
    duration: '12:45',
    type: 'patrol'
  }
];

export function CommunicationHub() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(mockContacts[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'officer': return Shield;
      case 'tourist': return Users;
      case 'admin': return Settings;
      case 'emergency': return AlertTriangle;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'officer': return 'text-blue-400';
      case 'tourist': return 'text-green-400';
      case 'admin': return 'text-purple-400';
      case 'emergency': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Here you would send the message
      setNewMessage('');
    }
  };

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 h-full">
      <Tabs defaultValue="chat" className="h-full flex flex-col">
        <TabsList className="glass mb-6">
          <TabsTrigger value="chat">Chat & Messaging</TabsTrigger>
          <TabsTrigger value="calls">Video Calls</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Channel</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Contacts Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Users className="w-5 h-5 text-foreground" />
                  <span>Active Contacts</span>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass border-border/50"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="space-y-2 p-4">
                    {filteredContacts.map((contact, index) => {
                      const RoleIcon = getRoleIcon(contact.role);
                      return (
                        <motion.div
                          key={contact.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary/30 ${
                            selectedContact?.id === contact.id ? 'bg-primary/20 border border-primary/50' : ''
                          }`}
                          onClick={() => setSelectedContact(contact)}
                        >
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback className="bg-primary/20">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(contact.status)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1">
                              <p className="font-medium truncate">{contact.name}</p>
                              <RoleIcon className={`w-3 h-3 ${getRoleColor(contact.role)}`} />
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{contact.location}</p>
                            <p className="text-xs text-muted-foreground capitalize">{contact.status}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="glass h-full flex flex-col">
              {selectedContact && (
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedContact.avatar} />
                        <AvatarFallback className="bg-primary/20">
                          {selectedContact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{selectedContact.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedContact.status)}`} />
                          <span className="capitalize">{selectedContact.status}</span>
                          {selectedContact.location && (
                            <>
                              <span>•</span>
                              <MapPin className="w-3 h-3" />
                              <span>{selectedContact.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" className="hover-glow">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="hover-glow"
                        onClick={() => setIsVideoCallActive(true)}
                      >
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              )}

              {/* Messages Area */}
              <CardContent className="flex-1 p-4">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {mockMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'You' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/20 text-xs">
                            {message.sender.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`max-w-xs lg:max-w-md ${message.sender === 'You' ? 'text-right' : ''}`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-xs text-muted-foreground">{message.sender}</p>
                            <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                            {message.priority === 'urgent' && (
                              <Badge variant="destructive" className="text-xs neon-glow">
                                URGENT
                              </Badge>
                            )}
                          </div>
                          <div className={`p-3 rounded-lg ${
                            message.sender === 'You' 
                              ? 'bg-primary text-primary-foreground' 
                              : message.type === 'alert' 
                                ? 'bg-destructive/20 border border-destructive/50' 
                                : 'bg-secondary'
                          }`}>
                            {message.type === 'alert' && (
                              <div className="flex items-center space-x-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                                <span className="text-sm font-medium text-destructive">ALERT</span>
                              </div>
                            )}
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="hover-glow">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 glass border-border/50"
                  />
                  <Button onClick={sendMessage} className="hover-glow">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calls" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Active Video Calls */}
            <div className="lg:col-span-2">
              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-foreground" />
                    <span>Video Conference</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isVideoCallActive ? (
                    <div className="relative h-96 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-primary/30 overflow-hidden">
                      {/* Simulated Video Call Interface */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                            <Video className="w-16 h-16 text-foreground" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground">Officer Martinez</h3>
                          <p className="text-muted-foreground">Emergency Response Call</p>
                          <div className="flex items-center justify-center space-x-2 mt-4">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">Connected - 08:32</span>
                          </div>
                        </div>
                      </div>

                      {/* Call Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        <Button
                          variant={isMuted ? "destructive" : "outline"}
                          size="icon"
                          onClick={() => setIsMuted(!isMuted)}
                          className="hover-glow"
                        >
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant={isVideoOff ? "destructive" : "outline"}
                          size="icon"
                          onClick={() => setIsVideoOff(!isVideoOff)}
                          className="hover-glow"
                        >
                          {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setIsVideoCallActive(false)}
                          className="hover-glow"
                        >
                          <Phone className="w-4 h-4 rotate-135" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center text-center">
                      <div>
                        <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No Active Video Call</h3>
                        <p className="text-muted-foreground mb-4">Start a video call with any contact</p>
                        <Button onClick={() => setIsVideoCallActive(true)} className="hover-glow">
                          <Video className="w-4 h-4 mr-2" />
                          Start Call
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Active Calls List */}
            <div>
              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Active Calls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeVideoCalls.map((call, index) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{call.name}</h4>
                        <Badge variant={call.type === 'emergency' ? 'destructive' : 'default'}>
                          {call.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{call.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{call.duration}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-3 hover-glow">
                        Join Call
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="flex-1">
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Emergency Communication Channel</span>
                <Badge variant="destructive" className="neon-glow animate-pulse">
                  PRIORITY CHANNEL
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="w-24 h-24 mx-auto mb-6 text-red-400" />
                <h3 className="text-2xl font-bold mb-4 text-foreground">Emergency Communications</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  This channel is reserved for emergency communications between officers, 
                  dispatch, and emergency services. All messages are logged and monitored.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="destructive" className="hover-glow">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Call
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Priority Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}