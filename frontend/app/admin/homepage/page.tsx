"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, RefreshCw, LayoutTemplate, MessageSquareQuote, Stars, Image as ImageIcon } from "lucide-react";
import { adminSettingsService } from "../services/adminSettingsService";
import { adminAdService } from "../services/adminAdService";
import { adminTestimonialService } from "../services/adminTestimonialService";

export default function HomepageCMS() {
  const [activeTab, setActiveTab] = useState<'hero' | 'announcements' | 'banners' | 'featured' | 'bestsellers' | 'why_choose' | 'testimonials'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  
  const [ads, setAds] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsData, adsData, testimonialsData] = await Promise.all([
        adminSettingsService.getSettingsByGroup('HOMEPAGE'),
        adminAdService.getAds(),
        adminTestimonialService.getAll().catch(() => [])
      ]);
      setSettings(settingsData);
      setAds(adsData || []);
      setTestimonials(testimonialsData || []);
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
      await adminSettingsService.updateSettings(settings, 'HOMEPAGE');
      alert("Settings saved successfully!");
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
        <h2 className="text-xs uppercase tracking-widest text-foreground/50 font-bold mb-4 px-4">Homepage Sections</h2>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'hero' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <ImageIcon className="w-4 h-4" /> Hero Section
          </button>
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'announcements' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> Announcement Bar
          </button>
          <button 
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'banners' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <ImageIcon className="w-4 h-4" /> Banners
          </button>
          <button 
            onClick={() => setActiveTab('featured')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'featured' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <Stars className="w-4 h-4" /> Featured Collection
          </button>
          <button 
            onClick={() => setActiveTab('bestsellers')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'bestsellers' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <Stars className="w-4 h-4" /> Best Sellers
          </button>
          <button 
            onClick={() => setActiveTab('why_choose')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'why_choose' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> Why Choose Auriq
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'testimonials' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <MessageSquareQuote className="w-4 h-4" /> Testimonials
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto pb-24">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Homepage CMS</h1>
              <p className="text-sm text-foreground/60 mt-1">Manage content across the homepage</p>
            </div>
            
            {/* Global Save for Settings-based tabs */}
            {['hero', 'featured', 'bestsellers', 'why_choose'].includes(activeTab) && (
              <button 
                onClick={saveSettings}
                disabled={isSaving}
                className="bg-gold text-background px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-gold/90 transition-all flex items-center gap-2 uppercase disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Publish Changes"}
              </button>
            )}
          </div>

          {/* Tab Content: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Hero Section</h3>
                
                <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
                  <input 
                    type="checkbox" 
                    id="hero_enabled" 
                    checked={settings.HERO_ENABLED !== 'false'}
                    onChange={(e) => handleSettingChange('HERO_ENABLED', e.target.checked.toString())}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="hero_enabled" className="text-sm font-bold text-foreground cursor-pointer">Enable Hero Section</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Hero Title</label>
                    <input 
                      type="text" 
                      value={settings.HERO_TITLE || ''}
                      onChange={(e) => handleSettingChange('HERO_TITLE', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Hero Subtitle</label>
                    <input 
                      type="text" 
                      value={settings.HERO_SUBTITLE || ''}
                      onChange={(e) => handleSettingChange('HERO_SUBTITLE', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Hero Description</label>
                    <textarea 
                      value={settings.HERO_DESCRIPTION || ''}
                      onChange={(e) => handleSettingChange('HERO_DESCRIPTION', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Hero Background Image URL</label>
                    <input 
                      type="text" 
                      value={settings.HERO_BG_IMAGE || ''}
                      onChange={(e) => handleSettingChange('HERO_BG_IMAGE', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Hero Video URL (Overrides Image)</label>
                    <input 
                      type="text" 
                      value={settings.HERO_VIDEO_URL || ''}
                      onChange={(e) => handleSettingChange('HERO_VIDEO_URL', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Primary CTA Text</label>
                    <input 
                      type="text" 
                      value={settings.HERO_CTA1_TEXT || ''}
                      onChange={(e) => handleSettingChange('HERO_CTA1_TEXT', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Primary CTA Link</label>
                    <input 
                      type="text" 
                      value={settings.HERO_CTA1_LINK || ''}
                      onChange={(e) => handleSettingChange('HERO_CTA1_LINK', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs (Announcements, Banners, Testimonials) */}
          {['announcements', 'banners', 'featured', 'bestsellers', 'why_choose', 'testimonials'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center p-20 border border-dashed border-foreground/20 rounded-xl">
              <AlertCircle className="w-12 h-12 text-foreground/20 mb-4" />
              <h3 className="text-xl font-bold text-foreground/50">Coming Soon</h3>
              <p className="text-sm text-foreground/40 mt-2 text-center max-w-sm">
                The {activeTab} management interface is currently under construction.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
