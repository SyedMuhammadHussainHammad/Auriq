"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Globe, FileText, Share2 } from "lucide-react";
import { adminSettingsService } from "../services/adminSettingsService";

export default function SeoCMS() {
  const [activeTab, setActiveTab] = useState<'global' | 'homepage' | 'social'>('global');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await adminSettingsService.getSettingsByGroup('SEO');
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
      await adminSettingsService.updateSettings(settings, 'SEO');
      alert("SEO Settings saved successfully!");
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
        <h2 className="text-xs uppercase tracking-widest text-foreground/50 font-bold mb-4 px-4">SEO Configuration</h2>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('global')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'global' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <Globe className="w-4 h-4" /> Global Settings
          </button>
          <button 
            onClick={() => setActiveTab('homepage')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'homepage' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <FileText className="w-4 h-4" /> Homepage SEO
          </button>
          <button 
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'social' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <Share2 className="w-4 h-4" /> Social Sharing (OG)
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto pb-24">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">SEO Management</h1>
              <p className="text-sm text-foreground/60 mt-1">Optimize your store for search engines and social media.</p>
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

          {/* Tab Content: Global Settings */}
          {activeTab === 'global' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Global SEO Defaults</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Site Name Suffix</label>
                    <input 
                      type="text" 
                      placeholder="e.g. | Auriq Fragrances"
                      value={settings.SEO_SITE_NAME_SUFFIX || ''}
                      onChange={(e) => handleSettingChange('SEO_SITE_NAME_SUFFIX', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                    <p className="text-xs text-foreground/40 mt-1">Appended to the end of all page titles.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Global Meta Keywords</label>
                    <textarea 
                      placeholder="luxury perfumes, auriq fragrances, best oud, long lasting perfumes"
                      value={settings.SEO_GLOBAL_KEYWORDS || ''}
                      onChange={(e) => handleSettingChange('SEO_GLOBAL_KEYWORDS', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" 
                    />
                    <p className="text-xs text-foreground/40 mt-1">Comma separated keywords.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Homepage SEO */}
          {activeTab === 'homepage' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Homepage Metadata</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Homepage Title</label>
                    <input 
                      type="text" 
                      value={settings.SEO_HOMEPAGE_TITLE || ''}
                      onChange={(e) => handleSettingChange('SEO_HOMEPAGE_TITLE', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Homepage Meta Description</label>
                    <textarea 
                      value={settings.SEO_HOMEPAGE_DESC || ''}
                      onChange={(e) => handleSettingChange('SEO_HOMEPAGE_DESC', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Social */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Open Graph & Social Sharing</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Default Open Graph Image URL</label>
                    <input 
                      type="text" 
                      value={settings.SEO_OG_IMAGE || ''}
                      onChange={(e) => handleSettingChange('SEO_OG_IMAGE', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                    <p className="text-xs text-foreground/40 mt-1">This image appears when your site is shared on WhatsApp, Facebook, or Twitter.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Twitter Handle</label>
                    <input 
                      type="text" 
                      placeholder="@auriqfragrances"
                      value={settings.SEO_TWITTER_HANDLE || ''}
                      onChange={(e) => handleSettingChange('SEO_TWITTER_HANDLE', e.target.value)}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
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
