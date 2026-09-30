"use client";

import { useEffect, useState } from "react";
import { Send, Inbox, ArrowUpRight, Mail, MailOpen } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";

type Message = {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'inbox' | 'sent'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [form, setForm] = useState({ receiverEmail: '', subject: '', content: '' });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/api/messages/${tab}`);
      setMessages(data || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMessages();
  }, [user, tab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/api/messages', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setIsComposeOpen(false);
      setForm({ receiverEmail: '', subject: '', content: '' });
      setTab('sent');
      fetchMessages();
    } catch {
      alert('Mesaj gönderilemedi.');
    }
  };

  const handleRead = async (msg: Message) => {
    setSelectedMessage(msg);
    if (tab === 'inbox' && !msg.isRead) {
      await fetchApi(`/api/messages/${msg.id}/read`, { method: 'PUT' }).catch(() => {});
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl border border-slate-200 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4 text-slate-900">Yeni Mesaj</h2>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alıcı E-posta</label>
                <input required type="email" value={form.receiverEmail} onChange={e => setForm({ ...form, receiverEmail: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="alici@uni.edu.tr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Konu</label>
                <input required type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Mesaj konusu..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mesaj</label>
                <textarea required rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" placeholder="Mesajınızı yazın..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsComposeOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"><Send className="h-4 w-4" />Gönder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl border border-slate-200 animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{selectedMessage.subject}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {tab === 'inbox' ? `Gönderen: ${selectedMessage.senderEmail}` : `Alıcı: ${selectedMessage.receiverEmail}`}
                  {' — '}
                  {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-slate-600 text-sm">Kapat</button>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap min-h-[100px]">
              {selectedMessage.content}
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mesajlar</h1>
          <p className="text-sm text-slate-500 mt-0.5">Öğrenci ve danışmanlar arası iletişim.</p>
        </div>
        <button
          onClick={() => setIsComposeOpen(true)}
          className="mt-3 sm:mt-0 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Send className="h-4 w-4" />
          Yeni Mesaj
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('inbox')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${tab === 'inbox' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Inbox className="h-4 w-4 inline mr-1.5 -mt-0.5" />Gelen Kutusu
        </button>
        <button onClick={() => setTab('sent')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${tab === 'sent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <ArrowUpRight className="h-4 w-4 inline mr-1.5 -mt-0.5" />Gönderilenler
        </button>
      </div>

      {/* Message List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
            {tab === 'inbox' ? 'Gelen kutunuz boş.' : 'Gönderilmiş mesaj yok.'}
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {messages.map((msg, idx) => (
              <li
                key={msg.id}
                onClick={() => handleRead(msg)}
                className={`px-5 py-4 cursor-pointer hover:bg-slate-50/80 transition-colors animate-slide-up ${!msg.isRead && tab === 'inbox' ? 'bg-primary/[0.02]' : ''}`}
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">
                      {!msg.isRead && tab === 'inbox' ? (
                        <Mail className="h-4 w-4 text-primary" />
                      ) : (
                        <MailOpen className="h-4 w-4 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!msg.isRead && tab === 'inbox' ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {msg.subject}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {tab === 'inbox' ? msg.senderEmail : msg.receiverEmail}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
