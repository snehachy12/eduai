// app/messages/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, Plus, Users, X, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { cn } from "@/lib/utils";

// --- Types (Move these to your @/types file) ---
export type Role = "teacher" | "parent" | "student" | "admin";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarColor: string;
}

export interface Room {
  id: string;
  name: string;
  isGroup: boolean;
  members: User[];
  unread: number;
  lastMessage?: string;
  lastTime?: string;
}

export interface Message {
  id: string;
  roomId: string;
  sender: User;
  content: string;
  timestamp: string;
}

// --- Mock Data (Replace with your API calls) ---
const CURRENT_USER: User = { id: "u1", name: "Mrs. Kumar", role: "teacher", avatarColor: "#4F46E5" };
const AVAILABLE_USERS: User[] = [
  { id: "u2", name: "John Doe", role: "parent", avatarColor: "#10B981" },
  { id: "u3", name: "Jane Smith", role: "parent", avatarColor: "#F59E0B" },
  { id: "u4", name: "Mr. Adams", role: "teacher", avatarColor: "#3B82F6" },
];

export default function MessagesPage() {
  // State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  
  // Modal State
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // --- API Integrations (Simulated) ---

  // 1. Fetch Rooms on load
  useEffect(() => {
    const fetchRooms = async () => {
      // TODO: Replace with fetch('/api/rooms')
      const initialRoom: Room = {
        id: "r1",
        name: "John Doe",
        isGroup: false,
        members: [CURRENT_USER, AVAILABLE_USERS[0]],
        unread: 0,
        lastMessage: "Thank you for the update.",
        lastTime: "10:30 AM"
      };
      setRooms([initialRoom]);
      setActiveRoom(initialRoom);
    };
    fetchRooms();
  }, []);

  // 2. Fetch Messages when a room is selected
  useEffect(() => {
    if (!activeRoom) return;
    const fetchMessages = async () => {
      // TODO: Replace with fetch(`/api/rooms/${activeRoom.id}/messages`)
      setMessages([]); // Load messages for this room
    };
    fetchMessages();
  }, [activeRoom?.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message
  const sendMessage = async () => {
    if (!input.trim() || !activeRoom) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      roomId: activeRoom.id,
      sender: CURRENT_USER,
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Optimistic UI update
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // TODO: await fetch('/api/messages', { method: 'POST', body: JSON.stringify(newMsg) })
  };

  // 4. Create Group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || selectedMembers.length === 0) return;

    const groupMembers = [
      CURRENT_USER,
      ...AVAILABLE_USERS.filter(u => selectedMembers.includes(u.id))
    ];

    const newRoom: Room = {
      id: `r_${Date.now()}`,
      name: newGroupName,
      isGroup: true,
      members: groupMembers,
      unread: 0,
    };

    // TODO: await fetch('/api/rooms', { method: 'POST', body: JSON.stringify(newRoom) })
    
    setRooms(prev => [newRoom, ...prev]);
    setActiveRoom(newRoom);
    setIsCreatingGroup(false);
    setNewGroupName("");
    setSelectedMembers([]);
  };

  const totalUnread = rooms.reduce((sum, r) => sum + r.unread, 0);

  return (
    <DashboardLayout title="Messages">
      <div className="h-[calc(100vh-140px)] min-h-[500px] flex gap-5 relative">
        
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 card-base flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Messages</h2>
                {totalUnread > 0 && <span className="badge-danger text-[10px]">{totalUnread}</span>}
              </div>
              <button 
                onClick={() => setIsCreatingGroup(true)}
                className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                title="Create Group"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <input className="input-base text-sm py-2" placeholder="Search chats..." />
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {rooms.map(room => {
              const displayAvatar = room.isGroup ? <Users className="w-5 h-5" /> : room.name.charAt(0);
              const avatarColor = room.isGroup ? "#6366f1" : room.members.find(m => m.id !== CURRENT_USER.id)?.avatarColor;

              return (
                <motion.button
                  key={room.id}
                  onClick={() => setActiveRoom(room)}
                  whileHover={{ x: 2 }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left mb-1",
                    activeRoom?.id === room.id ? "bg-primary-light dark:bg-indigo-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: avatarColor }}>
                    {displayAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{room.name}</span>
                      {room.lastTime && <span className="text-[10px] text-gray-400">{room.lastTime}</span>}
                    </div>
                    {room.lastMessage && <div className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage}</div>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        {activeRoom ? (
          <div className="flex-1 card-base flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: activeRoom.isGroup ? "#6366f1" : activeRoom.members.find(m => m.id !== CURRENT_USER.id)?.avatarColor }}>
                   {activeRoom.isGroup ? <Users className="w-5 h-5" /> : activeRoom.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{activeRoom.name}</div>
                  <div className="text-xs text-gray-500">
                    {activeRoom.isGroup ? `${activeRoom.members.length} members` : activeRoom.members.find(m => m.id !== CURRENT_USER.id)?.role}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {[Phone, Video, MoreVertical].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => {
                const isMe = msg.sender.id === CURRENT_USER.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
                  >
                    {!isMe && activeRoom.isGroup && (
                      <div className="flex items-center gap-1.5 mb-1 ml-1">
                        <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">{msg.sender.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 capitalize">{msg.sender.role}</span>
                      </div>
                    )}
                    <div className={cn("px-4 py-2.5 text-sm rounded-2xl max-w-[75%]", isMe ? "bg-primary text-white rounded-tr-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm")}>
                      {msg.content}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{msg.timestamp}</div>
                  </motion.div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-2xl px-3 py-2 border border-gray-200 dark:border-gray-800">
                <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Paperclip className="w-4 h-4" /></button>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all", input.trim() ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-400")}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 card-base flex items-center justify-center flex-col text-gray-400 gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center"><Send className="w-6 h-6 opacity-50" /></div>
            <p>Select a conversation to start messaging</p>
          </div>
        )}

        {/* Create Group Modal */}
        <AnimatePresence>
          {isCreatingGroup && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-2xl"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800"
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="font-semibold">Create Role-Based Group</h3>
                  <button onClick={() => setIsCreatingGroup(false)} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Group Name</label>
                    <input 
                      value={newGroupName} 
                      onChange={e => setNewGroupName(e.target.value)} 
                      placeholder="e.g. PTA Committee, Science 101" 
                      className="input-base w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Select Members</label>
                    <div className="max-h-48 overflow-y-auto border border-gray-100 dark:border-gray-800 rounded-xl p-2 space-y-1">
                      {AVAILABLE_USERS.map(user => {
                        const isSelected = selectedMembers.includes(user.id);
                        return (
                          <div 
                            key={user.id}
                            onClick={() => {
                              setSelectedMembers(prev => 
                                isSelected ? prev.filter(id => id !== user.id) : [...prev, user.id]
                              )
                            }}
                            className={cn(
                              "flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors",
                              isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: user.avatarColor }}>
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{user.name}</div>
                                <div className="text-[10px] text-gray-500 flex items-center gap-1 capitalize">
                                  {user.role === 'teacher' && <Shield className="w-3 h-3 text-indigo-500" />}
                                  {user.role}
                                </div>
                              </div>
                            </div>
                            <div className={cn("w-4 h-4 rounded border flex items-center justify-center", isSelected ? "bg-primary border-primary text-white" : "border-gray-300")}>
                              {isSelected && <span className="text-[10px]">✓</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-2">
                  <button onClick={() => setIsCreatingGroup(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                  <button 
                    onClick={handleCreateGroup} 
                    disabled={!newGroupName.trim() || selectedMembers.length === 0}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                  >
                    Create Group
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}