"use client";

import { useEffect, useState } from "react";
import { adminMessageService } from "../services/adminMessageService";
import { Mail, MailOpen, Trash2, CheckCircle2 } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMessages = () => {
    setIsLoading(true);
    adminMessageService.getMessages()
      .then(setMessages)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await adminMessageService.updateMessageStatus(id, { is_read: true });
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkReplied = async (id: number) => {
    try {
      await adminMessageService.updateMessageStatus(id, { status: 'REPLIED' });
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'REPLIED' } : m));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await adminMessageService.deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Contact Inbox</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">Manage customer inquiries and support messages.</p>
      </div>

      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="bg-background rounded-xl p-8 text-center text-foreground/50 text-sm font-medium border border-foreground/10">
            No messages found.
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`bg-background rounded-xl p-6 border transition-all ${!message.is_read ? 'border-gold shadow-md' : 'border-foreground/10 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!message.is_read ? 'bg-gold/20 text-gold' : 'bg-foreground/5 text-foreground/50'}`}>
                    {!message.is_read ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{message.name}</h3>
                    <p className="text-xs text-foreground/60">{message.email} {message.phone ? `• ${message.phone}` : ''}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    {message.status === 'REPLIED' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Replied
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              
              <div className="pl-14">
                {message.subject && <h4 className="text-sm font-bold text-foreground mb-2">Subject: {message.subject}</h4>}
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap mb-4">
                  {message.message}
                </p>
                
                <div className="flex gap-3 pt-4 border-t border-foreground/10">
                  {!message.is_read && (
                    <button 
                      onClick={() => handleMarkRead(message.id)}
                      className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold/80 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  {message.status !== 'REPLIED' && (
                    <button 
                      onClick={() => handleMarkReplied(message.id)}
                      className="text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors"
                    >
                      Mark as Replied
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(message.id)}
                    className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors ml-auto flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
