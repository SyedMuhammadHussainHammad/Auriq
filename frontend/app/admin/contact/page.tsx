"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Phone, Mail, MapPin, Share2, MessageSquare } from "lucide-react";
import { adminSettingsService } from "../services/adminSettingsService";

export default function ContactCMS() {
  const [activeTab, setActiveTab] = useState<'info' | 'social' | 'form'>('info');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await adminSettingsService.getSettingsByGroup('CONTACT');
      setSettings(data || {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await adminSettingsService.updateSettings(settings, 'CONTACT');
      alert("Contact Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-foreground/10 bg-foreground/[0.02] p-4 overflow-y-auto">
        <h2 className="text-xs uppercase tracking-widest text-foreground/50 font-bold mb-4 px-4">Contact CMS</h2>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'info' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <MapPin className="w-4 h-4" /> Company Info
          </button>
          <button 
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'social' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <Share2 className="w-4 h-4" /> Social Media
          </button>
          <button 
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'form' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <MessageSquare className="w-4 h-4" /> Form Settings
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto pb-24">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Contact & Social</h1>
              <p className="text-sm text-foreground/60 mt-1">Manage contact information and form behaviors.</p>
            </div>
            
            <button 
              onClick={saveSettings}
              disabled={isSaving}
              className="bg-gold text-background px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-gold/90 transition-all flex items-center gap-2 uppercase disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Publish Changes"}
            </button>
          </div>

          {/* Tab Content: Company Info */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Company Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Company Name</label>
                    <input 
                      type="text" 
                      value={settings.CONTACT_COMPANY_NAME || ''}
                      onChange={(e) => handleSettingChange('CONTACT_COMPANY_NAME', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Support Email</label>
                    <input 
                      type="email" 
                      value={settings.CONTACT_EMAIL || ''}
                      onChange={(e) => handleSettingChange('CONTACT_EMAIL', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Phone Number</label>
                    <input 
                      type="text" 
                      value={settings.CONTACT_PHONE || ''}
                      onChange={(e) => handleSettingChange('CONTACT_PHONE', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={settings.CONTACT_WHATSAPP || ''}
                      onChange={(e) => handleSettingChange('CONTACT_WHATSAPP', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Business Address</label>
                    <textarea 
                      value={settings.CONTACT_ADDRESS || ''}
                      onChange={(e) => handleSettingChange('CONTACT_ADDRESS', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Google Maps Embed URL</label>
                    <input 
                      type="text" 
                      value={settings.CONTACT_MAP_URL || ''}
                      onChange={(e) => handleSettingChange('CONTACT_MAP_URL', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Social Media */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Social Media Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Facebook', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter'].map(network => {
                    const key = `SOCIAL_${network.toUpperCase()}`;
                    return (
                      <div className="space-y-2" key={key}>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">{network} URL</label>
                        <input 
                          type="url" 
                          placeholder={`https://${network.toLowerCase()}.com/...`}
                          value={settings[key] || ''}
                          onChange={(e) => handleSettingChange(key, e.target.value)}
                          className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Form Settings */}
          {activeTab === 'form' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Contact Form Settings</h3>
                
                <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
                  <input 
                    type="checkbox" 
                    id="form_enabled" 
                    checked={settings.CONTACT_FORM_ENABLED !== 'false'}
                    onChange={(e) => handleSettingChange('CONTACT_FORM_ENABLED', e.target.checked.toString())}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="form_enabled" className="text-sm font-bold text-foreground cursor-pointer">Enable Contact Form on Website</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Notification Email (Receive messages here)</label>
                    <input 
                      type="email" 
                      value={settings.CONTACT_FORM_NOTIFY_EMAIL || ''}
                      onChange={(e) => handleSettingChange('CONTACT_FORM_NOTIFY_EMAIL', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Auto-Response Email Template</label>
                    <textarea 
                      value={settings.CONTACT_FORM_AUTO_RESPONSE || ''}
                      onChange={(e) => handleSettingChange('CONTACT_FORM_AUTO_RESPONSE', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-32" 
                      placeholder="Thank you for reaching out! We have received your message and will get back to you shortly."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
