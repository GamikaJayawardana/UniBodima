"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getCurrentUserProfile,
  updateUserProfile,
} from "@/app/actions/userActions";
import { UploadCloud, CheckCircle, X } from "lucide-react";

const SRI_LANKAN_UNIVERSITIES = [
  "University of Colombo",
  "University of Moratuwa",
  "University of Kelaniya",
  "University of Sri Jayewardenepura",
  "University of Peradeniya",
  "Open University of Sri Lanka",
  "SLIIT",
  "NSBM",
  "IIT",
  "Other",
];

const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matara",
  "Galle",
  "Jaffna",
  "Mullaitivu",
  "Vavuniya",
  "Anuradhapura",
  "Polonnaruwa",
  "Kurunegala",
  "Puttalam",
  "Ratnapura",
  "Kegalle",
  "Nuwara Eliya",
  "Badulla",
  "Monaragala",
  "Ampara",
  "Batticaloa",
  "Trincomalee",
];

interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  university?: string;
  yearOfStudy?: string;
  bio?: string;
  district?: string;
  postcode?: string;
  address?: string;
  image?: string;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phoneNumber: "",
    university: "",
    yearOfStudy: "",
    bio: "",
    district: "",
    postcode: "",
    address: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      async function loadUserData() {
        const result = await getCurrentUserProfile();
        if (result.success && result.user) {
          setFormData({
            name: result.user.name || "",
            email: result.user.email || "",
            phoneNumber: result.user.phoneNumber || "",
            university: result.user.university || "",
            yearOfStudy: result.user.yearOfStudy || "",
            bio: result.user.bio || "",
            district: result.user.district || "",
            postcode: result.user.postcode || "",
            address: result.user.address || "",
          });
          if (result.user.image) {
            setImagePreview(result.user.image);
          }
        }
        setLoading(false);
      }
      loadUserData();
    }
  }, [status, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const removeImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Profile Picture */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Profile Picture
              </h2>
              <div className="flex items-center gap-6">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    {selectedImage && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <label className="block relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center pointer-events-none">
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="font-medium text-slate-600">
                        Click to upload image
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-slate-200 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleInputChange}
                    placeholder="0771234567"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Education Information */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Education
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    University
                  </label>
                  <select
                    name="university"
                    value={formData.university || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="">Select University</option>
                    {SRI_LANKAN_UNIVERSITIES.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Year of Study
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Year</option>
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                    <option value="Year 5">Year 5</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Location Information */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Location</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      District
                    </label>
                    <select
                      name="district"
                      value={formData.district || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="">Select District</option>
                      {SRI_LANKAN_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode || ""}
                      onChange={handleInputChange}
                      placeholder="00700"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all bg-blue-600 hover:bg-blue-700 ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
