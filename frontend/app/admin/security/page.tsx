"use client";

import { useState, useEffect } from "react";
import { Shield, Key, Monitor, LogOut, CheckCircle, Loader2, User, Clock } from "lucide-react";
import { adminFetch } from "../lib/adminFetch";
import { useAdminToast } from "../context/AdminToastContext";

export default function SecurityPage() {
  const { success, error: toastError } = useAdminToast();

  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [sessionLoading, setSessionLoading] = useState(false);

  useEffect(() => {
    adminFetch("/profile")
      .then(res => {
        setProfile(res.data.admin);
        setSessions(res.data.sessions || []);
      })
      .catch(() => toastError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toastError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toastError("New password must be at least 8 characters");
      return;
    }
    setPwLoading(true);
    try {
      await adminFetch("/profile/password", {
        method: "PUT",
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toastError(err.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  const handleTerminateSessions = async () => {
    if (!confirm("This will log out all other devices. Continue?")) return;
    setSessionLoading(true);
    try {
      await adminFetch("/profile/sessions", { method: "DELETE" });
      success("Other sessions terminated");
      // Refresh session list
      const res = await adminFetch("/profile");
      setSessions(res.data.sessions || []);
    } catch (err: any) {
      toastError(err.message || "Failed to terminate sessions");
    } finally {
      setSessionLoading(false);
    }
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Security</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">Manage your admin password and active sessions.</p>
      </div>

      {/* Account Info */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <User className="w-4 h-4 text-gold" />
          </div>
          <h2 className="text-base font-bold text-foreground tracking-wide">Account Information</h2>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-foreground/50 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
        ) : profile ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold mb-1">Name</p>
              <p className="text-foreground font-semibold">{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold mb-1">Email</p>
              <p className="text-foreground font-semibold">{profile.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold mb-1">Last Login</p>
              <p className="text-foreground/70 font-medium">{formatDate(profile.last_login)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold mb-1">Account Created</p>
              <p className="text-foreground/70 font-medium">{formatDate(profile.created_at)}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/50">Could not load profile.</p>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Key className="w-4 h-4 text-gold" />
          </div>
          <h2 className="text-base font-bold text-foreground tracking-wide">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium"
              placeholder="Enter current password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium"
              placeholder="Min. 8 characters"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium"
              placeholder="Repeat new password"
            />
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            className="mt-2 bg-gold text-background py-2.5 px-6 rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-foreground transition-colors disabled:opacity-50 flex items-center gap-2 w-fit"
          >
            {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Update Password</>}
          </button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-gold" />
            </div>
            <h2 className="text-base font-bold text-foreground tracking-wide">Active Sessions</h2>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleTerminateSessions}
              disabled={sessionLoading}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {sessionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
              Terminate Other Sessions
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-foreground/50 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-foreground/50">No active sessions found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session, idx) => (
              <div key={session.id} className="flex items-start justify-between p-4 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                <div className="flex items-start gap-3">
                  <Monitor className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {session.browser || session.device_info || "Unknown Device"}
                      {idx === 0 && <span className="ml-2 text-[10px] bg-green-500/10 text-green-500 font-bold px-2 py-0.5 rounded tracking-widest uppercase">Current</span>}
                    </p>
                    <p className="text-xs text-foreground/50 font-medium mt-0.5">{session.ip_address || "Unknown IP"}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-foreground/40">
                      <Clock className="w-3 h-3" />
                      Last active: {formatDate(session.last_active)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
