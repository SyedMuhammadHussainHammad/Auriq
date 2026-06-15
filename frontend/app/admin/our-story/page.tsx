"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { adminStoryService } from "../services/adminStoryService";

export default function OurStoryCMS() {
  const [isSaving, setIsSaving] = useState(false);
  const [story, setStory] = useState<any>({});
  
  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/story');
      const data = await res.json();
      if (data.success) {
        setStory(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStory((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setStory((prev: any) => ({ ...prev, [fieldName]: file }));
    }
  };

  const saveStory = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(story).forEach(key => {
        if (story[key] !== null && story[key] !== undefined) {
          formData.append(key, story[key]);
        }
      });
      await adminStoryService.updateStory(formData);
      alert("Story updated successfully!");
    } catch (err) {
      alert("Failed to update story.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto pb-24">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Our Story CMS</h1>
              <p className="text-sm text-foreground/60 mt-1">Manage the narrative and detailed information for the Our Story page.</p>
            </div>
            <button 
              onClick={saveStory}
              disabled={isSaving}
              className="bg-gold text-background px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-gold/90 transition-all flex items-center gap-2 uppercase disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Publish Changes"}
            </button>
          </div>

          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold">Header Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Subtitle</label>
                  <input name="subtitle" value={story.subtitle || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Title</label>
                  <input name="title" value={story.title || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Paragraph 1</label>
                  <textarea name="paragraph1" value={story.paragraph1 || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Paragraph 2</label>
                  <textarea name="paragraph2" value={story.paragraph2 || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" />
                </div>
              </div>
            </div>

            {/* Extended Content */}
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold">Detailed Information</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Mission Statement</label>
                  <textarea name="mission_statement" value={story.mission_statement || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Vision Statement</label>
                  <textarea name="vision_statement" value={story.vision_statement || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Product Sourcing Details</label>
                  <textarea name="sourcing_details" value={story.sourcing_details || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Manufacturing Process</label>
                  <textarea name="manufacturing_process" value={story.manufacturing_process || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Company Values</label>
                  <textarea name="company_values" value={story.company_values || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Founder Message</label>
                  <textarea name="founder_message" value={story.founder_message || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm h-24" />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold">Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Primary Image (Replace)</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'image1')} className="w-full text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Secondary Image (Replace)</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'image2')} className="w-full text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Video URL</label>
                  <input name="video_url" value={story.video_url || ''} onChange={handleChange} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
