"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Store, CheckCircle, Clock, Image as ImageIcon, LayoutTemplate, Star, LayoutGrid, Save, Eye, EyeOff, FileText } from "lucide-react";
import Image from "next/image";
import Modal from "../../components/ui/Modal";
import { adminStoryService } from "../services/adminStoryService";
import { storyService } from "../../services/storyService";

export default function AdminStorefront() {
  const [activeTab, setActiveTab] = useState<'carousel' | 'announcement' | 'promo' | 'featured' | 'bestsellers' | 'story'>('carousel');
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCarousel, setShowCarousel] = useState(true);

  // Story State
  const [storyData, setStoryData] = useState({
    subtitle: '',
    title: '',
    paragraph1: '',
    paragraph2: '',
    image1_url: '',
    image2_url: ''
  });
  const [storyImage1, setStoryImage1] = useState<File | null>(null);
  const [storyImage2, setStoryImage2] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("auriq_show_carousel");
    if (saved !== null) {
      setShowCarousel(saved === "true");
    }

    // Fetch existing story
    const fetchStory = async () => {
      try {
        const res = await storyService.getStory();
        if (res.success && res.data) {
          setStoryData({
            subtitle: res.data.subtitle || '',
            title: res.data.title || '',
            paragraph1: res.data.paragraph1 || '',
            paragraph2: res.data.paragraph2 || '',
            image1_url: res.data.image1_url || '',
            image2_url: res.data.image2_url || ''
          });
        }
      } catch (err) {
        console.error("Failed to fetch story", err);
      }
    };
    fetchStory();
  }, []);

  const handlePublish = () => {
    setIsSaving(true);
    localStorage.setItem("auriq_show_carousel", showCarousel.toString());
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const handleStorySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    formData.append('subtitle', storyData.subtitle);
    formData.append('title', storyData.title);
    formData.append('paragraph1', storyData.paragraph1);
    formData.append('paragraph2', storyData.paragraph2);
    if (storyImage1) formData.append('image1', storyImage1);
    if (storyImage2) formData.append('image2', storyImage2);

    try {
      const res = await adminStoryService.updateStory(formData);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(res.message || "Failed to update story.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving story.");
    } finally {
      setIsSaving(false);
    }
  };

  const ads = [
    { 
      id: 1, 
      title: "Summer Sale 2026", 
      type: "Hero Banner", 
      status: "Active", 
      startDate: "Jun 01, 2026",
      endDate: "Jun 30, 2026",
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2940&auto=format&fit=crop" 
    },
    { 
      id: 2, 
      title: "The Midnight Collection", 
      type: "Announcement Bar", 
      status: "Scheduled", 
      startDate: "Jul 01, 2026",
      endDate: "Jul 15, 2026",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop"
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2 flex items-center gap-3">
            <Store className="w-8 h-8 text-gold" />
            Storefront Editor
          </h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">Customize your homepage layout, banners, and featured products.</p>
        </div>
        <button 
          onClick={activeTab === 'story' ? undefined : handlePublish}
          disabled={isSaving || activeTab === 'story'} // Story has its own save button
          className={`px-6 py-3 rounded-lg text-sm font-bold tracking-widest transition-colors uppercase flex items-center justify-center gap-2 shadow-lg 
            ${activeTab === 'story' ? 'bg-foreground/10 text-foreground/50 shadow-none cursor-not-allowed' : 'bg-gold/90 text-background hover:bg-gold shadow-gold/20'}`}
        >
          {isSaving && activeTab !== 'story' ? "Publishing..." : saveSuccess && activeTab !== 'story' ? "Published!" : <><Save className="w-4 h-4" /> Publish Layout</>}
        </button>
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-foreground/10 p-6 bg-foreground/[0.02]">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('carousel')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'carousel' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <ImageIcon className="w-4 h-4" /> Hero Carousel
            </button>
            <button 
              onClick={() => setActiveTab('announcement')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'announcement' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <LayoutTemplate className="w-4 h-4" /> Announcement
            </button>
            <button 
              onClick={() => setActiveTab('promo')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'promo' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <LayoutTemplate className="w-4 h-4" /> Promo Blocks
            </button>
            <button 
              onClick={() => setActiveTab('featured')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'featured' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Featured Collection
            </button>
            <button 
              onClick={() => setActiveTab('bestsellers')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'bestsellers' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <Star className="w-4 h-4" /> Best Sellers
            </button>
            <div className="my-2 border-b border-foreground/10"></div>
            <button 
              onClick={() => setActiveTab('story')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'story' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <FileText className="w-4 h-4" /> Our Story
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-hidden">
          
          {/* CAROUSEL EDITOR */}
          {activeTab === 'carousel' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-serif font-bold text-foreground">Hero Carousel</h2>
                  <button 
                    onClick={() => setShowCarousel(!showCarousel)}
                    className={`text-[10px] px-2 py-1 rounded-md font-sans font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors ${showCarousel ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                  >
                    {showCarousel ? <><Eye className="w-3 h-3"/> Visible on Store</> : <><EyeOff className="w-3 h-3"/> Hidden on Store</>}
                  </button>
                </div>
                <button 
                  onClick={() => setIsSlideModalOpen(true)}
                  className="text-gold text-xs font-bold tracking-widest uppercase hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Slide
                </button>
              </div>
              
              <div className="overflow-x-auto border border-foreground/10 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                      <th className="p-4 font-bold">Slide Media</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Duration</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad) => (
                      <tr key={ad.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm group">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-10 rounded overflow-hidden bg-foreground/5 flex-shrink-0">
                              <Image src={ad.image} alt={ad.title} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-foreground tracking-wide">{ad.title}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5
                            ${ad.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {ad.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {ad.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-foreground/80 font-medium text-xs">{ad.startDate} - {ad.endDate}</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-foreground/50 hover:text-gold transition-colors p-2 bg-foreground/5 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-foreground/50 hover:text-red-500 transition-colors p-2 bg-foreground/5 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENT EDITOR */}
          {activeTab === 'announcement' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground">Announcement Bar</h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold mt-1">Manage the top announcement bar text and links.</p>
                </div>
                <button 
                  className="bg-gold text-background px-4 py-2 rounded-lg text-xs font-bold tracking-widest hover:bg-gold/90 transition-colors uppercase"
                >
                  Save Changes
                </button>
              </div>

              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Announcement Text</label>
                    <input type="text" defaultValue="Free shipping on orders over Rs. 10,000" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Link URL (Optional)</label>
                    <input type="text" defaultValue="/collections/all" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" />
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-foreground/10">
                    <input type="checkbox" defaultChecked className="accent-gold w-4 h-4" id="enable-announcement" />
                    <label htmlFor="enable-announcement" className="text-sm font-bold text-foreground cursor-pointer">Enable Announcement Bar</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROMO BLOCKS EDITOR */}
          {activeTab === 'promo' && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-serif font-bold text-foreground mb-2">Promotional Blocks</h2>
                <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Manage the two side-by-side cards on the homepage.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Block 1 */}
                <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-5 bg-foreground/[0.02]">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-gold">Block 1 (Left)</h3>
                  
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-2">
                    <Image src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop" alt="Preview" fill className="object-cover" />
                    <button className="absolute inset-0 bg-background/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center font-bold tracking-widest text-xs uppercase text-white backdrop-blur-sm">
                      Change Image
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Tagline</label>
                    <input type="text" defaultValue="New Arrival" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Heading</label>
                    <input type="text" defaultValue="The Midnight Collection" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Link URL</label>
                    <input type="text" defaultValue="/collections?sort=new-arrivals" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                </div>

                {/* Block 2 */}
                <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-5 bg-foreground/[0.02]">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-gold">Block 2 (Right)</h3>
                  
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-2">
                    <Image src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop" alt="Preview" fill className="object-cover" />
                    <button className="absolute inset-0 bg-background/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center font-bold tracking-widest text-xs uppercase text-white backdrop-blur-sm">
                      Change Image
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Tagline</label>
                    <input type="text" defaultValue="Limited Edition" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Heading</label>
                    <input type="text" defaultValue="Summer Exclusives" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Link URL</label>
                    <input type="text" defaultValue="/collections?sort=best-sellers" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FEATURED / BEST SELLERS EDITOR */}
          {(activeTab === 'featured' || activeTab === 'bestsellers') && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground">
                    {activeTab === 'featured' ? 'Featured Collection' : 'Best Sellers'}
                  </h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold mt-1">Select up to 8 products to display</p>
                </div>
                <button 
                  onClick={() => setIsProductModalOpen(true)}
                  className="bg-foreground/5 border border-foreground/10 text-foreground px-4 py-2 rounded-lg text-xs font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase"
                >
                  Select Products
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Mock product selection blocks */}
                {[1,2,3,4].map((i) => (
                  <div key={i} className="border border-foreground/10 rounded-xl overflow-hidden group">
                    <div className="relative aspect-square bg-foreground/5">
                      <Image 
                        src={`https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop&sig=${i}`} 
                        alt="Product" 
                        fill 
                        className="object-cover"
                      />
                      <button className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-3 bg-background">
                      <p className="text-xs font-bold text-foreground truncate">Luxury Perfume {i}</p>
                      <p className="text-[10px] text-foreground/50">Rs. 12,500</p>
                    </div>
                  </div>
                ))}
                
                {/* Add new block */}
                <button 
                  onClick={() => setIsProductModalOpen(true)}
                  className="border-2 border-dashed border-foreground/20 rounded-xl aspect-square flex flex-col items-center justify-center gap-2 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all text-foreground/40"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Add Product</span>
                </button>
              </div>
            </div>
          )}

          {/* OUR STORY EDITOR */}
          {activeTab === 'story' && (
            <form onSubmit={handleStorySave} className="flex flex-col gap-8">
              <div className="flex justify-between items-center border-b border-foreground/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-1">Our Story Section</h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Edit the narrative and imagery on the homepage.</p>
                </div>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="bg-gold/90 text-background px-6 py-3 rounded-lg text-sm font-bold tracking-widest hover:bg-gold transition-colors uppercase flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : saveSuccess ? "Saved!" : <><Save className="w-4 h-4" /> Save Story</>}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Text Content */}
                <div className="flex flex-col gap-6 bg-foreground/[0.02] p-6 rounded-xl border border-foreground/10">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-gold">Text Content</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Subtitle / Kicker</label>
                    <input 
                      type="text" 
                      value={storyData.subtitle} 
                      onChange={(e) => setStoryData({...storyData, subtitle: e.target.value})}
                      className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" 
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Main Heading</label>
                    <input 
                      type="text" 
                      value={storyData.title} 
                      onChange={(e) => setStoryData({...storyData, title: e.target.value})}
                      className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Paragraph 1</label>
                    <textarea 
                      value={storyData.paragraph1} 
                      onChange={(e) => setStoryData({...storyData, paragraph1: e.target.value})}
                      className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold w-full min-h-[100px] resize-y" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Paragraph 2</label>
                    <textarea 
                      value={storyData.paragraph2} 
                      onChange={(e) => setStoryData({...storyData, paragraph2: e.target.value})}
                      className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold w-full min-h-[100px] resize-y" 
                      required
                    />
                  </div>
                </div>

                {/* Imagery */}
                <div className="flex flex-col gap-6 bg-foreground/[0.02] p-6 rounded-xl border border-foreground/10">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-gold">Imagery</h3>
                  
                  {/* Image 1 */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold flex justify-between">
                      <span>Primary Image (Left)</span>
                      <span className="text-gold">Required</span>
                    </label>
                    <div className="flex items-center gap-4">
                      {storyData.image1_url && !storyImage1 && (
                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-foreground/20">
                          <Image src={storyData.image1_url} alt="Image 1" fill className="object-cover" />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setStoryImage1(e.target.files[0]);
                          }
                        }}
                        className="text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-foreground/10 file:text-foreground hover:file:bg-foreground/20 transition-all cursor-pointer w-full"
                      />
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-foreground/10 my-2"></div>

                  {/* Image 2 */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold flex justify-between">
                      <span>Secondary Image (Right Overlay)</span>
                      <span className="text-foreground/40">Optional</span>
                    </label>
                    <div className="flex items-center gap-4">
                      {storyData.image2_url && !storyImage2 && (
                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-foreground/20">
                          <Image src={storyData.image2_url} alt="Image 2" fill className="object-cover" />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setStoryImage2(e.target.files[0]);
                          }
                        }}
                        className="text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-foreground/10 file:text-foreground hover:file:bg-foreground/20 transition-all cursor-pointer w-full"
                      />
                    </div>
                    {storyData.image2_url && (
                      <button 
                        type="button" 
                        onClick={() => setStoryData({...storyData, image2_url: ''})}
                        className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1 text-left hover:underline"
                      >
                        Remove Secondary Image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isSlideModalOpen} onClose={() => setIsSlideModalOpen(false)} title="Add New Slide">
        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setIsSlideModalOpen(false); }}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Image URL</label>
            <input type="text" placeholder="https://..." className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Heading</label>
            <input type="text" placeholder="Summer Collection" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Tagline</label>
            <input type="text" placeholder="Limited Edition" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
          </div>
          <button type="submit" className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4">
            Create Slide
          </button>
        </form>
      </Modal>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Select Products" maxWidth="max-w-2xl">
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Search products..." className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none text-foreground mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-foreground/10 rounded-lg hover:border-gold transition-colors cursor-pointer group">
                <input type="checkbox" className="accent-gold w-4 h-4 cursor-pointer" />
                <div className="w-12 h-12 bg-foreground/5 rounded relative overflow-hidden flex-shrink-0">
                  <Image src={`https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=200&sig=${i}`} alt="Product" fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground group-hover:text-gold transition-colors">Luxury Perfume {i}</span>
                  <span className="text-xs text-foreground/50">Rs. 12,500</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setIsProductModalOpen(false)} className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-foreground transition-colors">
            Save Selection
          </button>
        </div>
      </Modal>
    </div>
  );
}
