"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, ShieldCheck, Save, Phone, Laptop, Smartphone, Globe, LogOut, RefreshCw, Upload, Image as ImageIcon } from "lucide-react";
import { adminProfileService } from "../services/adminProfileService";

export default function AdminSettings() {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isLoggingOutDevices, setIsLoggingOutDevices] = useState(false);
  
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    profile_image_url: '',
    last_login: ''
  });
  
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [sessions, setSessions] = useState<any[]>([]);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await adminProfileService.getProfile();
      setProfile({
        first_name: data.admin.first_name || '',
        last_name: data.admin.last_name || '',
        email: data.admin.email || '',
        phone: data.admin.phone || '',
        profile_image_url: data.admin.profile_image_url || '',
        last_login: data.admin.last_login || ''
      });
      setSessions(data.sessions || []);
    } catch (error: any) {
      console.error('Failed to fetch profile', error);
      if (error.message?.toLowerCase().includes('unauthorized') || error.message?.toLowerCase().includes('token')) {
        window.location.href = '/admin/login';
      }
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('first_name', profile.first_name);
      formData.append('last_name', profile.last_name);
      formData.append('email', profile.email);
      if (profile.phone) formData.append('phone', profile.phone);
      if (profileImageFile) formData.append('profile_image', profileImageFile);

      await adminProfileService.updateProfile(formData);
      alert('Profile updated successfully');
      fetchProfile();
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      return alert("Passwords do not match");
    }
    if (passwords.new_password.length < 8) {
      return alert("New password must be at least 8 characters");
    }
    
    setIsSavingPassword(true);
    try {
      await adminProfileService.updatePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password
      });
      alert('Password updated successfully');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to update password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const logoutOtherDevices = async () => {
    if (!window.confirm("Are you sure you want to log out from all other devices?")) return;
    
    setIsLoggingOutDevices(true);
    try {
      // Assuming the first session in the list is the most recent (current)
      const currentSessionId = sessions.length > 0 ? sessions[0].id : undefined;
      await adminProfileService.logoutOtherDevices(currentSessionId);
      alert('Logged out of other devices successfully');
      fetchProfile();
    } catch (error: any) {
      alert(error.message || 'Failed to logout devices');
    } finally {
      setIsLoggingOutDevices(false);
    }
  };

  const getPasswordStrength = () => {
    const pw = passwords.new_password;
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 8) strength += 25;
    if (pw.match(/[A-Z]/)) strength += 25;
    if (pw.match(/[0-9]/)) strength += 25;
    if (pw.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto pb-24">
          
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground">Admin Profile Settings</h1>
            <p className="text-sm text-foreground/60 mt-1">Manage your account information, security, and active sessions.</p>
          </div>

          <div className="space-y-12">
            
            {/* PERSONAL INFORMATION & PROFILE PICTURE */}
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-foreground/10 pb-2">
                <User className="w-5 h-5 text-gold" /> Personal Information
              </h2>
              
              <form onSubmit={saveProfile} className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-8">
                
                {/* Profile Picture */}
                <div className="flex items-center gap-6 pb-6 border-b border-foreground/5">
                  <div className="w-24 h-24 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center overflow-hidden relative group">
                    {previewImage || profile.profile_image_url ? (
                      <img src={previewImage || profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-gold">{profile.first_name?.[0] || 'A'}</span>
                    )}
                    <label className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload className="w-5 h-5 text-gold mb-1" />
                      <span className="text-[10px] uppercase font-bold text-gold tracking-wider">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Profile Picture</h3>
                    <p className="text-xs text-foreground/50 mt-1 max-w-xs">Upload a professional image. Recommended size is 256x256px. Formats: JPG, PNG.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleProfileChange}
                      required
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleProfileChange}
                      required
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold flex items-center gap-1">
                       Email Address
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-foreground/5">
                  <button 
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-gold text-background px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-gold/90 transition-all flex items-center gap-2 uppercase disabled:opacity-50"
                  >
                    {isSavingProfile ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* SECURITY SETTINGS */}
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-foreground/10 pb-2">
                <Lock className="w-5 h-5 text-gold" /> Security Settings
              </h2>
              
              <form onSubmit={savePassword} className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2 max-w-md">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Current Password</label>
                    <input 
                      type="password" 
                      name="current_password"
                      value={passwords.current_password}
                      onChange={handlePasswordChange}
                      required
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">New Password</label>
                    <input 
                      type="password" 
                      name="new_password"
                      value={passwords.new_password}
                      onChange={handlePasswordChange}
                      required
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                    {passwords.new_password && (
                      <div className="h-1 w-full bg-foreground/10 rounded-full mt-2 overflow-hidden flex">
                        <div className={`h-full transition-all ${getPasswordStrength() < 50 ? 'bg-red-500' : getPasswordStrength() < 100 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${getPasswordStrength()}%` }}></div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Confirm New Password</label>
                    <input 
                      type="password" 
                      name="confirm_password"
                      value={passwords.confirm_password}
                      onChange={handlePasswordChange}
                      required
                      className={`w-full bg-transparent border rounded-lg px-4 py-2 outline-none text-sm transition-colors ${
                        passwords.confirm_password && passwords.new_password !== passwords.confirm_password 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-foreground/20 focus:border-gold'
                      }`} 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-foreground/5">
                  <button 
                    type="submit"
                    disabled={isSavingPassword || !passwords.current_password || !passwords.new_password}
                    className="bg-gold text-background px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-gold/90 transition-all flex items-center gap-2 uppercase disabled:opacity-50"
                  >
                    {isSavingPassword ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Update Password
                  </button>
                </div>
              </form>
            </section>

            {/* ACCOUNT ACTIVITY */}
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-foreground/10 pb-2">
                <Globe className="w-5 h-5 text-gold" /> Account Activity
              </h2>
              
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-8">
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Last Login</span>
                  <span className="text-sm font-medium">
                    {profile.last_login ? new Date(profile.last_login).toLocaleString() : 'N/A'}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold border-b border-foreground/10 pb-2">Active Sessions</h3>
                  
                  {sessions.length === 0 ? (
                    <p className="text-xs text-foreground/50">No active sessions tracked.</p>
                  ) : (
                    <div className="space-y-4">
                      {sessions.map((session, index) => {
                        const isCurrent = index === 0; // The query orders by last_active desc, first is likely current.
                        const isMobile = session.device_info?.toLowerCase().includes('mobile');
                        return (
                          <div key={session.id} className={`flex items-start justify-between p-4 rounded-lg border ${isCurrent ? 'bg-gold/5 border-gold/30' : 'bg-transparent border-foreground/10'}`}>
                            <div className="flex items-start gap-4">
                              <div className="mt-1">
                                {isMobile ? <Smartphone className="w-5 h-5 text-foreground/60" /> : <Laptop className="w-5 h-5 text-foreground/60" />}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                  {session.browser || 'Unknown Browser'} on {isMobile ? 'Mobile' : 'Desktop'}
                                  {isCurrent && <span className="text-[10px] uppercase bg-gold text-background px-2 py-0.5 rounded-full font-bold">Current</span>}
                                </h4>
                                <div className="text-xs text-foreground/50 mt-1 space-y-0.5">
                                  <p>IP: {session.ip_address || 'Unknown'}</p>
                                  <p>Last Active: {new Date(session.last_active).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-foreground/5">
                  <button 
                    onClick={logoutOtherDevices}
                    disabled={isLoggingOutDevices || sessions.length <= 1}
                    className="border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all flex items-center gap-2 uppercase disabled:opacity-50"
                  >
                    {isLoggingOutDevices ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                    Logout Other Devices
                  </button>
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
