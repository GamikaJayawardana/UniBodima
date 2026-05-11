"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/actions/postActions";
import { 
  Building2, Users, MapPin, Phone, GraduationCap, 
  Info, Camera, Check, Loader2, Sparkles, 
  Bed, ShieldCheck, Tag, ArrowRight, Zap, X, ChevronDown
} from "lucide-react";
import { SRI_LANKA_DISTRICTS, UNIVERSITIES } from "@/lib/constants";

interface CreatePostFormProps {
  initialData?: any;
  isEditing?: boolean;
  type?: "offer" | "request";
}



export default function CreatePostForm({ initialData, isEditing, type: initialType }: CreatePostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"offer" | "request">(initialType || initialData?.type || "offer");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    budgetMin: initialData?.budgetRange?.min || "",
    budgetMax: initialData?.budgetRange?.max || "",
    district: initialData?.district || "",
    address: initialData?.address || "",
    targetUniversity: initialData?.targetUniversity || "",
    genderPreference: initialData?.genderPreference || "Any",
    roomType: initialData?.roomType || "single",
    contactNumber: initialData?.contactNumber || initialData?.phoneNumber || "",
    occupancy: initialData?.occupancy || 1,
    availableFrom: initialData?.availableFrom ? new Date(initialData.availableFrom).toISOString().split('T')[0] : "",
    amenities: initialData?.amenities || (isEditing ? [
      ...(initialData?.roomFacilities?.hasWiFi ? ["Wi-Fi"] : []),
      ...(initialData?.roomFacilities?.hasAC ? ["AC"] : []),
      ...(initialData?.roomFacilities?.isFurnished ? ["Furnished"] : []),
      ...(initialData?.buildingAmenities?.hasParking ? ["Parking"] : []),
      ...(initialData?.mealPlan?.included ? ["Meals"] : []),
      ...(initialData?.utilitiesIncluded?.internet ? ["Laundry"] : []), // example mapping
    ] : []),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (index < images.length) {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("type", type);
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("district", formData.district);
    submitData.append("address", formData.address);
    submitData.append("targetUniversity", formData.targetUniversity);
    submitData.append("genderPreference", formData.genderPreference);
    submitData.append("roomType", formData.roomType.toLowerCase());
    submitData.append("contactNumber", formData.contactNumber);
    submitData.append("occupancy", formData.occupancy.toString());
    submitData.append("availableFrom", formData.availableFrom);

    if (type === "offer") {
      submitData.append("price", formData.price);
      
      // Mapping amenities to flags as expected by backend
      if (formData.amenities.includes("Wi-Fi")) submitData.append("hasWiFi", "on");
      if (formData.amenities.includes("AC")) submitData.append("hasAC", "on");
      if (formData.amenities.includes("Furnished")) submitData.append("isFurnished", "on");
      if (formData.amenities.includes("Parking")) submitData.append("hasParking", "on");
      if (formData.amenities.includes("Meals")) submitData.append("mealIncluded", "on");
      if (formData.amenities.includes("Attached Bathroom")) submitData.append("hasPrivateBathroom", "on");
      if (formData.amenities.includes("Laundry")) submitData.append("hasLaundry", "on");
      if (formData.amenities.includes("Water Heater")) submitData.append("hasHotWater", "on");
    } else {
      submitData.append("budgetMin", formData.budgetMin);
      submitData.append("budgetMax", formData.budgetMax);
    }

    images.forEach(image => {
      submitData.append("images", image);
    });

    // Handle existing images if editing
    if (isEditing) {
      submitData.append("postId", initialData._id);
      submitData.append("existingImages", JSON.stringify(imagePreviews.filter(img => !img.startsWith('blob:'))));
    }

    const result = isEditing 
      ? await updatePost(submitData)
      : await createPost(submitData);

    if (result.success) {
      router.push("/dashboard");
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  const inputClass = "w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block";
  const sectionTitle = "text-xl font-black text-slate-900 mb-8 flex items-center gap-3";

  return (
    <div className="bg-white rounded-[48px] border border-slate-100 shadow-3xl overflow-hidden">
      
      {/* Dynamic Header */}
      <div className={`p-10 md:p-14 text-white relative overflow-hidden ${type === 'offer' ? 'bg-sky-600' : 'bg-emerald-600'}`}>
         <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12">
            {type === 'offer' ? <Building2 className="w-64 h-64" /> : <Users className="w-64 h-64" />}
         </div>
         <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20">
               <Sparkles className="w-4 h-4" />
               <span>Protocol Step 1: Classification</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter">
               {isEditing ? "Modify Listing" : type === "offer" ? "Post Housing Offer" : "Post Housing Request"}
            </h2>
            <p className="text-white/80 font-medium text-lg max-w-xl">
               {type === "offer" 
                 ? "Listing your property with precise details helps you reach the right students faster." 
                 : "Broadcasting your requirements helps property owners find the perfect fit for you."}
            </p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 md:p-20 space-y-24">
        
        {/* Step 1: Type Selection */}
        {!isEditing && (
          <section>
            <h3 className={sectionTitle}>
              <div className="p-2.5 bg-slate-900 text-white rounded-xl"><Tag className="w-5 h-5" /></div>
              Listing Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                type="button"
                onClick={() => setType("offer")}
                className={`p-10 rounded-[40px] border-2 transition-all text-left flex items-center gap-8 group ${type === "offer" ? 'border-sky-600 bg-sky-50/50 shadow-xl shadow-sky-600/5' : 'border-slate-100 hover:border-sky-200'}`}
              >
                <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center transition-all ${type === "offer" ? 'bg-sky-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50'}`}>
                   <Building2 className="w-10 h-10" />
                </div>
                <div>
                   <p className={`text-2xl font-black ${type === "offer" ? 'text-slate-900' : 'text-slate-400'}`}>Housing Offer</p>
                   <p className="text-slate-500 font-medium text-sm mt-1">I have a room or property to list.</p>
                </div>
              </button>
              
              <button 
                type="button"
                onClick={() => setType("request")}
                className={`p-10 rounded-[40px] border-2 transition-all text-left flex items-center gap-8 group ${type === "request" ? 'border-emerald-600 bg-emerald-50/50 shadow-xl shadow-emerald-600/5' : 'border-slate-100 hover:border-emerald-200'}`}
              >
                <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center transition-all ${type === "request" ? 'bg-emerald-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50'}`}>
                   <Users className="w-10 h-10" />
                </div>
                <div>
                   <p className={`text-2xl font-black ${type === "request" ? 'text-slate-900' : 'text-slate-400'}`}>Housing Request</p>
                   <p className="text-slate-500 font-medium text-sm mt-1">I am looking for a room or roommate.</p>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Media */}
        <section>
          <h3 className={sectionTitle}>
             <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Camera className="w-5 h-5" /></div>
             Visual Assets
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
             {imagePreviews.map((src, i) => (
                <div key={i} className="relative group aspect-square rounded-[32px] overflow-hidden border border-slate-100 shadow-xl">
                   <img src={src} className="w-full h-full object-cover" />
                   <button 
                      type="button" 
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <X className="w-4 h-4" />
                   </button>
                </div>
             ))}
             <label className="aspect-square rounded-[32px] border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-sky-50 hover:border-sky-200 transition-all group">
                <Camera className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Add Media</span>
                <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
             </label>
          </div>
        </section>

        {/* Step 3: Core Information */}
        <section className="space-y-12">
           <h3 className={sectionTitle}>
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl"><Info className="w-5 h-5" /></div>
              Listing Details
           </h3>
           <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-12 space-y-3">
                 <label className={labelClass}>Marketplace Title</label>
                 <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      className={inputClass} 
                      placeholder="e.g., Luxury Single Room near University of Colombo" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required 
                    />
                 </div>
              </div>

              <div className="md:col-span-12 space-y-3">
                 <label className={labelClass}>Detailed Description</label>
                 <textarea 
                    className="w-full px-8 py-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-400 min-h-[150px]"
                    placeholder="Describe the space, environment, and specific house rules..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                 />
              </div>

              <div className="md:col-span-6 space-y-3">
                 <label className={labelClass}>Target University</label>
                 <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      className={inputClass + " appearance-none !pr-10 cursor-pointer"} 
                      value={formData.targetUniversity}
                      onChange={e => setFormData({...formData, targetUniversity: e.target.value})}
                      required
                    >
                       <option value="">Select University</option>
                       {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
              </div>

              <div className="md:col-span-6 space-y-3">
                 <label className={labelClass}>Contact Number</label>
                 <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      className={inputClass} 
                      placeholder="+94 XX XXX XXXX" 
                      value={formData.contactNumber}
                      onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                      required 
                    />
                 </div>
              </div>

              {type === "offer" ? (
                <div className="md:col-span-12 space-y-3">
                   <label className={labelClass}>Monthly Rent (LKR)</label>
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-sky-600">LKR</div>
                      <input 
                        type="number" 
                        className={inputClass} 
                        placeholder="25000" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        required 
                      />
                   </div>
                </div>
              ) : (
                <>
                  <div className="md:col-span-6 space-y-3">
                     <label className={labelClass}>Minimum Budget</label>
                     <input 
                       type="number" 
                       className={inputClass} 
                       placeholder="15000" 
                       value={formData.budgetMin}
                       onChange={e => setFormData({...formData, budgetMin: e.target.value})}
                     />
                  </div>
                  <div className="md:col-span-6 space-y-3">
                     <label className={labelClass}>Maximum Budget</label>
                     <input 
                       type="number" 
                       className={inputClass} 
                       placeholder="35000" 
                       value={formData.budgetMax}
                       onChange={e => setFormData({...formData, budgetMax: e.target.value})}
                     />
                  </div>
                </>
              )}
           </div>
        </section>

        {/* Step 4: Location */}
        <section className="space-y-12">
           <h3 className={sectionTitle}>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><MapPin className="w-5 h-5" /></div>
              Geographic Location
           </h3>
           <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                 <label className={labelClass}>District</label>
                 <div className="relative">
                    <select 
                       className={inputClass + " appearance-none !pl-6 !pr-10 cursor-pointer"} 
                       value={formData.district}
                       onChange={e => setFormData({...formData, district: e.target.value})}
                       required
                    >
                       <option value="">Select District</option>
                       {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
              </div>
              <div className="space-y-3">
                 <label className={labelClass}>Address / Landmarks</label>
                 <input 
                   type="text" 
                   className={inputClass} 
                   placeholder="e.g., Temple Road, near Campus Gate" 
                   value={formData.address}
                   onChange={e => setFormData({...formData, address: e.target.value})}
                   required 
                 />
              </div>
           </div>
        </section>

        {/* Step 5: Preferences & Amenities */}
        <section className="space-y-12">
           <h3 className={sectionTitle}>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Bed className="w-5 h-5" /></div>
              Specific Preferences
           </h3>
           <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                 <label className={labelClass}>Occupancy (Persons)</label>
                 <input 
                   type="number" 
                   className={inputClass} 
                   placeholder="1" 
                   value={formData.occupancy}
                   onChange={e => setFormData({...formData, occupancy: parseInt(e.target.value) || 1})}
                   min="1"
                 />
              </div>

              <div className="space-y-3">
                 <label className={labelClass}>Available From</label>
                 <input 
                   type="date" 
                   className={inputClass} 
                   value={formData.availableFrom}
                   onChange={e => setFormData({...formData, availableFrom: e.target.value})}
                 />
              </div>

              <div className="space-y-3">
                 <label className={labelClass}>Gender Preference</label>
                 <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-[22px] border border-slate-100">
                    {["Any", "Male", "Female"].map(g => (
                       <button 
                          key={g}
                          type="button"
                          onClick={() => setFormData({...formData, genderPreference: g})}
                          className={`py-3 rounded-[18px] font-black text-xs transition-all ${formData.genderPreference === g ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                          {g}
                       </button>
                    ))}
                 </div>
              </div>
              <div className="space-y-3">
                 <label className={labelClass}>Accommodation Type</label>
                 <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-[22px] border border-slate-100">
                    {["single", "shared", "dorm", "apartment"].map(t => (
                       <button 
                          key={t}
                          type="button"
                          onClick={() => setFormData({...formData, roomType: t})}
                          className={`py-3 rounded-[18px] font-black text-xs transition-all ${formData.roomType === t ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                          {t} Room
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           {type === "offer" && (
             <div className="mt-12">
                <label className={labelClass}>Available Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {["Wi-Fi", "AC", "Kitchen", "Attached Bathroom", "Parking", "Furnished", "Laundry", "Water Heater"].map(amenity => (
                      <button 
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-5 rounded-2xl border flex items-center gap-3 font-bold text-sm transition-all ${formData.amenities.includes(amenity) ? 'bg-sky-50 border-sky-600 text-sky-600 shadow-lg shadow-sky-600/5' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                      >
                         <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${formData.amenities.includes(amenity) ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-200'}`}>
                            {formData.amenities.includes(amenity) && <Check className="w-3 h-3" />}
                         </div>
                         {amenity}
                      </button>
                   ))}
                </div>
             </div>
           )}
        </section>

        {/* Submission Actions */}
        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4 text-emerald-600 font-black text-xs uppercase tracking-widest bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
              Verified Listing Protocol Active
           </div>
           
           <div className="flex items-center gap-6 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="px-10 py-5 text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Discard Listing
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 md:flex-none px-16 py-6 bg-slate-900 text-white rounded-[28px] font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                {loading ? "Publishing Listing..." : isEditing ? "Update Listing" : "Deploy Listing"}
              </button>
           </div>
        </div>

      </form>
    </div>
  );
}
