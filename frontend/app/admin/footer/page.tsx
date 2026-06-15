"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Layers } from "lucide-react";
import { adminSettingsService } from "../services/adminSettingsService";

export default function FooterCMS() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await adminSettingsService.getSettingsByGroup('FOOTER');
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
      await adminSettingsService.updateSettings(settings, 'FOOTER');
      alert("Footer Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for JSON arrays like links
  const handleLinkChange = (sectionKey: string, index: number, field: 'name' | 'url', value: string) => {
    try {
      const currentArr = settings[sectionKey] ? JSON.parse(settings[sectionKey]) : [];
      if (!currentArr[index]) currentArr[index] = { name: '', url: '' };
      currentArr[index][field] = value;
      handleSettingChange(sectionKey, JSON.stringify(currentArr));
    } catch (e) {
      // If broken JSON, reset
      const newArr = [];
      newArr[index] = { name: '', url: '' };
      newArr[index][field] = value;
      handleSettingChange(sectionKey, JSON.stringify(newArr));
    }
  };

  const addLink = (sectionKey: string) => {
    try {
      const currentArr = settings[sectionKey] ? JSON.parse(settings[sectionKey]) : [];
      currentArr.push({ name: '', url: '' });
      handleSettingChange(sectionKey, JSON.stringify(currentArr));
    } catch (e) {
      handleSettingChange(sectionKey, JSON.stringify([{ name: '', url: '' }]));
    }
  };

  const removeLink = (sectionKey: string, index: number) => {
    try {
      const currentArr = settings[sectionKey] ? JSON.parse(settings[sectionKey]) : [];
      currentArr.splice(index, 1);
      handleSettingChange(sectionKey, JSON.stringify(currentArr));
    } catch (e) {
      // ignore
    }
  };

  const renderLinkBuilder = (title: string, sectionKey: string) => {
    let links = [];
    try {
      links = settings[sectionKey] ? JSON.parse(settings[sectionKey]) : [];
    } catch (e) {}

    return (
      <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-bold">{title} Links</h3>
        <div className="space-y-4">
          {links.map((link: any, index: number) => (
            <div key={index} className="flex gap-4 items-center">
              <input 
                type="text" 
                placeholder="Link Name"
                value={link.name}
                onChange={(e) => handleLinkChange(sectionKey, index, 'name', e.target.value)}
                className="flex-1 bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
              />
              <input 
                type="text" 
                placeholder="URL (e.g., /about)"
                value={link.url}
                onChange={(e) => handleLinkChange(sectionKey, index, 'url', e.target.value)}
                className="flex-1 bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
              />
              <button 
                onClick={() => removeLink(sectionKey, index)}
                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            onClick={() => addLink(sectionKey)}
            className="text-gold hover:bg-gold/10 px-4 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest border border-gold/50"
          >
            + Add Link
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-foreground/10 bg-foreground/[0.02] p-4 overflow-y-auto">
        <h2 className="text-xs uppercase tracking-widest text-foreground/50 font-bold mb-4 px-4">Footer CMS</h2>
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all bg-gold/10 text-gold">
            <Layers className="w-4 h-4" /> Layout Editor
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto pb-24">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Footer Configuration</h1>
              <p className="text-sm text-foreground/60 mt-1">Manage footer links, newsletter section, and copyright.</p>
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

          <div className="space-y-6">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold">Newsletter Section</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Newsletter Title</label>
                  <input 
                    type="text" 
                    value={settings.FOOTER_NEWSLETTER_TITLE || ''}
                    onChange={(e) => handleSettingChange('FOOTER_NEWSLETTER_TITLE', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Newsletter Description</label>
                  <textarea 
                    value={settings.FOOTER_NEWSLETTER_DESC || ''}
                    onChange={(e) => handleSettingChange('FOOTER_NEWSLETTER_DESC', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-20" 
                  />
                </div>
              </div>
            </div>

            {renderLinkBuilder('Company', 'FOOTER_COMPANY_LINKS')}
            {renderLinkBuilder('Shop', 'FOOTER_SHOP_LINKS')}
            {renderLinkBuilder('Support', 'FOOTER_SUPPORT_LINKS')}

            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold">Footer Bottom</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Copyright Text</label>
                  <input 
                    type="text" 
                    value={settings.FOOTER_COPYRIGHT || ''}
                    onChange={(e) => handleSettingChange('FOOTER_COPYRIGHT', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
