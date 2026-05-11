"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getCurrentUserProfile,
  updateUserProfile,
  changePassword,
} from "@/app/actions/userActions";
import { UploadCloud, CheckCircle, X, Sparkles, User, Mail, Phone, GraduationCap, MapPin, FileText, Loader2, Info, ChevronLeft, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

const SRI_LANKAN_UNIVERSITIES = [
  "University of Colombo",
  "University of Moratuwa",
  "University of Kelaniya",
  "University of Sri Jayewardenepura",
  "University of Peradeniya",
  "University of Ruhuna",
  "University of Jaffna",
  "Eastern University",
  "South Eastern University",
  "Rajarata University",
  "Sabaragamuwa University",
  "Wayamba University",
  "Uva Wellassa University",
  "Ocean University",
  "SLIIT",
  "NSBM",
  "IIT",
  "Horizon Campus",
  "CINEC",
  "Other"
];

const SRI_LANKAN_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Moneragala", "Ratnapura", "Kegalle"
];

interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  university?: string;
  yearOfStudy?: string;
  bio?: string;
  district?: string;
  address?: string;
  postcode?: string;
}

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phoneNumber: "",
    university: "",
    yearOfStudy: "",
    bio: "",
    district: "",
    address: "",
    postcode: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Password State
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    async function loadUserData() {
      const result = await getCurrentUserProfile();
      if (result.success && result.user) {
        const u = result.user;
        setFormData({
          name: u.name || "",
          email: u.email || "",
          phoneNumber: u.phoneNumber || "",
          university: u.university || "",
          yearOfStudy: u.yearOfStudy || "",
          bio: u.bio || "",
          district: u.district || "",
          address: u.address || "",
          postcode: u.postcode || "",
        });
        if (u.image) setImagePreview(u.image);
      }
      setLoading(false);
    }

    if (status === "authenticated") {
      loadUserData();
    }
  }, [status, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("phoneNumber", formData.phoneNumber || "");
    submitFormData.append("university", formData.university || "");
    submitFormData.append("yearOfStudy", formData.yearOfStudy || "");
    submitFormData.append("bio", formData.bio || "");
    submitFormData.append("district", formData.district || "");
    submitFormData.append("postcode", formData.postcode || "");
    submitFormData.append("address", formData.address || "");

    if (selectedImage) {
      submitFormData.append("profileImage", selectedImage);
    }

    const result = await updateUserProfile(submitFormData);
    setSaving(false);

    if (result.success) {
      router.push("/profile");
    } else {
      alert("Error: " + result.error);
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage({ type: "", text: "" });

    const submitFormData = new FormData();
    submitFormData.append("currentPassword", passwordData.currentPassword);
    submitFormData.append("newPassword", passwordData.newPassword);
    submitFormData.append("confirmPassword", passwordData.confirmPassword);

    const result = await changePassword(submitFormData);
    setPasswordSaving(false);

    if (result.success) {
      setPasswordMessage({ type: "success", text: result.message || "Password changed successfully" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setPasswordMessage({ type: "error", text: result.error || "Failed to change password" });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block";
  const sectionTitle = "text-xl font-black text-slate-900 mb-8 flex items-center gap-3";

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24">
      <Navbar />
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="space-y-6">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-sky-600 font-black text-xs uppercase tracking-widest transition-colors mb-6 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Profile
              </button>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white text-sky-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-sky-500/5 border border-slate-100">
                 <Sparkles className="w-4 h-4" />
                 <span>Identity Management</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                 Edit <span className="text-sky-600">Profile.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-xl">
                 Update your identity details to maintain trust and credibility within the marketplace.
              </p>
           </div>
        </div>

        <div className="bg-white rounded-[48px] border border-slate-100 shadow-3xl p-10 md:p-20">
          <form onSubmit={handleSubmit} className="space-y-20">
            
            {/* Avatar Section */}
            <section>
              <h2 className={sectionTitle}>
                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl"><User className="w-5 h-5" /></div>
                Identity & Visual Brand
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-12">
                {imagePreview ? (
                  <div className="relative group/avatar">
                    <img src={imagePreview} alt="Preview" className="w-48 h-48 rounded-[40px] object-cover border-8 border-slate-50 shadow-2xl group-hover/avatar:scale-105 transition-transform" />
                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-[40px] cursor-pointer">
                       <UploadCloud className="w-10 h-10 text-white" />
                    </label>
                  </div>
                ) : (
                  <label htmlFor="avatar-upload" className="w-48 h-48 rounded-[40px] bg-slate-50 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-sky-50 hover:border-sky-200 transition-all group">
                    <UploadCloud className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Upload Image</span>
                  </label>
                )}
                <div className="flex-1 space-y-4">
                  <p className="text-slate-500 font-medium leading-relaxed italic">
                    "A professional photo significantly increases your trustworthiness and response rate from other members."
                  </p>
                  <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  <label htmlFor="avatar-upload" className="inline-block px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-200 transition-all">Change Avatar</label>
                </div>
              </div>
            </section>

            {/* Core Info Section */}
            <section className="space-y-10 pt-10 border-t border-slate-50">
               <h2 className={sectionTitle}>
                 <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><FileText className="w-5 h-5" /></div>
                 Core Information
               </h2>
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className={labelClass}>Full Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" className={inputClass} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="How you appear to others" required />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={labelClass}>Official Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" className={inputClass} value={formData.email} disabled />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={labelClass}>Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" className={inputClass} value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} placeholder="+94 XX XXX XXXX" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={labelClass}>Affiliated University</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select className={inputClass + " appearance-none"} value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})}>
                        <option value="">Select University</option>
                        {SRI_LANKAN_UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
               </div>
            </section>

            {/* Bio & Details */}
            <section className="space-y-10 pt-10 border-t border-slate-50">
               <h2 className={sectionTitle}>
                 <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Sparkles className="w-5 h-5" /></div>
                 Biography & Identity
               </h2>
               <div className="space-y-3">
                 <label className={labelClass}>Personal Bio / Introduction</label>
                 <textarea 
                   className="w-full px-8 py-6 bg-slate-50 rounded-3xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-400 min-h-[200px]" 
                   value={formData.bio} 
                   onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                   placeholder="Tell the community about yourself, your university life, or your properties..."
                 />
               </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-6 pt-10 border-t border-slate-50">
               <button 
                 type="button" 
                 onClick={() => router.back()}
                 className="px-10 py-5 text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
               >
                 Cancel Changes
               </button>
               <button 
                 type="submit" 
                 disabled={saving}
                 className="px-16 py-6 bg-sky-600 text-white rounded-[28px] font-black text-xl hover:bg-sky-700 transition-all shadow-2xl shadow-sky-600/20 flex items-center gap-4 disabled:opacity-50"
               >
                 {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                 {saving ? 'Synchronizing...' : 'Update Protocol'}
               </button>
            </div>

          </form>
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-3xl p-10 md:p-20 mt-12">
          <form onSubmit={handlePasswordSubmit} className="space-y-10">
            <h2 className={sectionTitle}>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><Shield className="w-5 h-5" /></div>
              Security Settings
            </h2>
            <div className="space-y-4">
              <p className="text-slate-500 font-medium leading-relaxed italic">
                Update your password to keep your account secure. Ensure your new password is at least 6 characters long.
              </p>
              {passwordMessage.text && (
                <div className={`p-4 rounded-2xl font-bold text-sm ${passwordMessage.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  {passwordMessage.text}
                </div>
              )}
            </div>
            
            <div className="grid gap-8">
              <div className="space-y-3">
                <label className={labelClass}>Current Password</label>
                <input 
                  type="password" 
                  className={inputClass} 
                  value={passwordData.currentPassword} 
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                  placeholder="Enter current password" 
                  required 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className={labelClass}>New Password</label>
                  <input 
                    type="password" 
                    className={inputClass} 
                    value={passwordData.newPassword} 
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                    placeholder="Enter new password" 
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <label className={labelClass}>Confirm New Password</label>
                  <input 
                    type="password" 
                    className={inputClass} 
                    value={passwordData.confirmPassword} 
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                    placeholder="Confirm new password" 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-10 border-t border-slate-50">
               <button 
                 type="submit" 
                 disabled={passwordSaving}
                 className="px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 disabled:opacity-50"
               >
                 {passwordSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                 {passwordSaving ? 'Updating...' : 'Change Password'}
               </button>
            </div>
          </form>
        </div>

      </div>

      </div>
    </div>
  );
}
