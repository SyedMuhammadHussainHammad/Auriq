"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Clock, Image as ImageIcon, LayoutTemplate, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Modal from "../../components/ui/Modal";
import { adminAdService } from "../services/adminAdService";
import { useAdminToast } from "../context/AdminToastContext";

export default function AdsManagementPage() {
  const { success, error } = useAdminToast();
  const [ads, setAds] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [position, setPosition] = useState("HERO");
  const [image, setImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setIsLoading(true);
      const data = await adminAdService.getAds();
      setAds(data || []);
    } catch (err) {
      error("Failed to load ads.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      error("Desktop image is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("position", position);
      if (linkUrl) formData.append("link_url", linkUrl);
      if (buttonText) formData.append("button_text", buttonText);
      formData.append("image", image);
      if (mobileImage) formData.append("mobile_image", mobileImage);

      const res = await adminAdService.createAd(formData);
      if (res.success) {
        success("Ad created successfully!");
        setIsModalOpen(false);
        resetForm();
        fetchAds();
      } else {
        error(res.message || "Failed to create ad.");
      }
    } catch (err) {
      error("An error occurred while creating ad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setLinkUrl("");
    setButtonText("");
    setPosition("HERO");
    setImage(null);
    setMobileImage(null);
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await adminAdService.updateAdStatus(id, !currentStatus);
      success(`Ad ${!currentStatus ? "activated" : "deactivated"} successfully.`);
      fetchAds();
    } catch (err) {
      error("Failed to update ad status.");
    }
  };

  const handleDeleteClick = (id: number) => {
    setAdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (adToDelete === null) return;
    setIsSubmitting(true);
    try {
      await adminAdService.deleteAd(adToDelete);
      success("Ad deleted successfully.");
      setIsDeleteModalOpen(false);
      setAdToDelete(null);
      fetchAds();
    } catch (err) {
      error("Failed to delete ad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-foreground/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2 flex items-center gap-3">
            <LayoutTemplate className="w-8 h-8 text-gold" />
            Ads & Banners
          </h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">
            Manage promotional banners for the Hero section and Announcement bar.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gold/90 text-background px-6 py-3 rounded-lg text-sm font-bold tracking-widest hover:bg-gold transition-colors uppercase flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                <th className="p-4 font-bold">Banner Preview</th>
                <th className="p-4 font-bold">Position</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50 text-sm font-bold tracking-widest uppercase">
                    Loading banners...
                  </td>
                </tr>
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50 text-sm font-bold tracking-widest uppercase">
                    No banners found. Add one to get started.
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-12 rounded overflow-hidden bg-foreground/5 flex-shrink-0 border border-foreground/10">
                          {ad.image_url ? (
                            <Image src={ad.image_url} alt={ad.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-foreground/30"><ImageIcon className="w-4 h-4" /></div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-foreground tracking-wide block">{ad.title}</span>
                          {ad.link_url && <span className="text-xs text-foreground/50">{ad.link_url}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 bg-foreground/5 px-2 py-1 rounded">
                        {ad.position}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleStatus(ad.id, ad.is_active)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors
                        ${ad.is_active ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                      >
                        {ad.is_active ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {ad.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDeleteClick(ad.id)}
                          className="text-foreground/50 hover:text-red-500 transition-colors p-2 bg-foreground/5 rounded-lg hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload New Banner" maxWidth="max-w-xl">
        <form className="flex flex-col gap-5" onSubmit={handleCreateAd}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Internal Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Sale 2026" 
              className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Display Position</label>
              <select 
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2.5 text-sm focus:border-gold outline-none text-foreground"
              >
                <option value="HERO" className="bg-background text-foreground">Hero Section</option>
                <option value="ANNOUNCEMENT_BAR" className="bg-background text-foreground">Announcement Bar</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold flex justify-between">
                <span>Link URL</span>
                <span className="text-foreground/40 text-[8px]">Optional</span>
              </label>
              <input 
                type="text" 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/collections/sale" 
                className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold flex justify-between">
              <span>Button Text</span>
              <span className="text-foreground/40 text-[8px]">Optional</span>
            </label>
            <input 
              type="text" 
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Shop Now" 
              className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" 
            />
          </div>

          <div className="border-t border-foreground/10 my-1"></div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold flex justify-between">
              <span>Desktop Image</span>
              <span className="text-gold text-[8px]">Required</span>
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
              }}
              className="text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-foreground/10 file:text-foreground hover:file:bg-foreground/20 transition-all cursor-pointer w-full"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold flex justify-between">
              <span>Mobile Image</span>
              <span className="text-foreground/40 text-[8px]">Optional</span>
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setMobileImage(e.target.files[0]);
              }}
              className="text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-foreground/10 file:text-foreground hover:file:bg-foreground/20 transition-all cursor-pointer w-full"
            />
            <p className="text-[10px] text-foreground/40 font-medium">If not provided, the desktop image will be scaled down for mobile devices.</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Uploading Banner..." : "Create Banner"}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => !isSubmitting && setIsDeleteModalOpen(false)} title="" maxWidth="max-w-md">
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Delete Banner?</h3>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-sm mx-auto">
              This action cannot be undone. The banner will be permanently removed from your storefront immediately.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 w-full mt-4">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors text-foreground/70 bg-foreground/5 hover:bg-foreground/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
