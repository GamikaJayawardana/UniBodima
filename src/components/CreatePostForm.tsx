"use client";

import { useState, useEffect } from "react";
import { createPost, updatePost } from "@/app/actions/postActions";
import { useRouter, useSearchParams } from "next/navigation";
import { UploadCloud, CheckCircle, X, Save } from "lucide-react";

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

interface CreatePostFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function CreatePostForm({ initialData, isEditing = false }: CreatePostFormProps) {
  const searchParams = useSearchParams();
  const initialType = isEditing 
    ? initialData?.type 
    : (searchParams.get("type") as "offer" | "request") || "offer";
  
  const [type, setType] = useState<"offer" | "request">(initialType);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>(
    isEditing && initialData?.images ? initialData.images : []
  );
  const router = useRouter();

  useEffect(() => {
    // Update type when query parameter changes
    if (initialType) {
      setType(initialType);
    }
  }, [searchParams]);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newFiles = [...uploadedImages, ...files].slice(0, 5); // Max 5 images
    setUploadedImages(newFiles);

    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  }

  function removeImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("type", type);
    
    if (isEditing && initialData?._id) {
      formData.append("postId", initialData._id);
    }

    // Append images for offers only
    if (type === "offer") {
      uploadedImages.forEach((file) => {
        formData.append("images", file);
      });
    }

    const result = isEditing 
      ? await updatePost(formData)
      : await createPost(formData);

    setLoading(false);

    if (result.success) {
      if (isEditing) {
        router.push(`/posts/${initialData._id}`);
      } else {
        router.push(type === "offer" ? "/offers" : "/requests");
      }
    } else {
      alert("Error: " + result.error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {isEditing ? "Edit Your" : "Post Your"} {type === "offer" ? "Space" : "Request"}
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Type Selector */}
          <div className="bg-slate-50 p-6 border-b border-gray-100 flex gap-4">
            <button
              onClick={() => !isEditing && setType("offer")}
              disabled={isEditing}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${type === "offer" ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"} ${isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              I have a Space (Offer)
            </button>
            <button
              onClick={() => !isEditing && setType("request")}
              disabled={isEditing}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${type === "request" ? "bg-purple-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"} ${isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              I'm looking for a Space (Request)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    name="title"
                    required
                    defaultValue={initialData?.title}
                    placeholder="E.g. Spacious Room for 2 Students with AC & WiFi"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Target University *
                    </label>
                    <select
                      name="targetUniversity"
                      required
                      defaultValue={initialData?.targetUniversity}
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
                      Room Type
                    </label>
                    <select
                      name="roomType"
                      defaultValue={initialData?.roomType}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Room Type</option>
                      <option value="single">Single Room</option>
                      <option value="shared">Shared Room (2-3 people)</option>
                      <option value="dorm">Dorm (4+ people)</option>
                      <option value="apartment">Apartment</option>
                    </select>
                  </div>
                </div>

                {type === "offer" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location/Address *
                      </label>
                      <input
                        name="address"
                        required={type === "offer"}
                        defaultValue={initialData?.address}
                        placeholder="E.g. 123 Main St, Colombo 07"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        District
                      </label>
                      <select
                        name="district"
                        defaultValue={initialData?.district}
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
                        name="postcode"
                        defaultValue={initialData?.postcode}
                        placeholder="E.g. 00700"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gender Preference *
                    </label>
                    <select
                      name="genderPreference"
                      required
                      defaultValue={initialData?.genderPreference}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Any">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Occupancy (number of people)
                    </label>
                    <input
                      name="occupancy"
                      type="number"
                      min="1"
                      defaultValue={initialData?.occupancy}
                      placeholder="E.g. 2"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {type === "offer" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Price (LKR/month) *
                      </label>
                      <input
                        name="price"
                        type="number"
                        required
                        defaultValue={initialData?.price}
                        placeholder="15000"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Lease Duration
                      </label>
                      <select
                        name="leaseDuration"
                        defaultValue={initialData?.leaseDuration}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="">Select Duration</option>
                        <option value="short">Short-term (1-3 months)</option>
                        <option value="long">Long-term (6+ months)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                )}

                {type === "request" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Min Budget (LKR/month) *
                      </label>
                      <input
                        name="budgetMin"
                        type="number"
                        required
                        defaultValue={initialData?.budgetRange?.min}
                        placeholder="5000"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Budget (LKR/month) *
                      </label>
                      <input
                        name="budgetMax"
                        type="number"
                        required
                        defaultValue={initialData?.budgetRange?.max}
                        placeholder="15000"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Available From
                  </label>
                  <input
                    name="availableFrom"
                    type="date"
                    defaultValue={initialData?.availableFrom ? new Date(initialData.availableFrom).toISOString().split('T')[0] : ""}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Description
              </h2>
              <textarea
                name="description"
                required
                rows={5}
                defaultValue={initialData?.description}
                placeholder="Describe the space in detail or explain your requirements. Include information about surroundings, transport, nearby amenities, etc."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
              ></textarea>
            </section>

            {/* Images (offer only) */}
            {type === "offer" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Images
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Upload Images (Max 5)
                  </label>

                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {imagePreview.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${idx}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8">
                    <input
                      name="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                      <UploadCloud className="w-8 h-8 text-slate-400" />
                      <div className="text-center">
                        <p className="font-medium text-slate-600">
                          Click to upload images
                        </p>
                        <p className="text-sm text-slate-500">
                          or drag and drop
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Room Facilities - Offer only */}
            {type === "offer" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Room Facilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input type="checkbox" name="hasAC" defaultChecked={initialData?.roomFacilities?.hasAC} className="w-5 h-5" />
                    <span className="font-medium text-gray-700">
                      Air Conditioning
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input type="checkbox" name="hasWiFi" defaultChecked={initialData?.roomFacilities?.hasWiFi} className="w-5 h-5" />
                    <span className="font-medium text-gray-700">WiFi</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasHotWater"
                      defaultChecked={initialData?.roomFacilities?.hasHotWater}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">Hot Water</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="isFurnished"
                      defaultChecked={initialData?.roomFacilities?.isFurnished}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">Furnished</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasPrivateBathroom"
                      defaultChecked={initialData?.roomFacilities?.hasPrivateBathroom}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">
                      Private Bathroom
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasWardrobe"
                      defaultChecked={initialData?.roomFacilities?.hasWardrobe}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">Wardrobe</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasDeskStudyArea"
                      defaultChecked={initialData?.roomFacilities?.hasDeskStudyArea}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">
                      Desk & Study Area
                    </span>
                  </label>
                </div>
              </section>
            )}

            {/* Building Amenities - Offer only */}
            {type === "offer" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Building Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasParking"
                      defaultChecked={initialData?.buildingAmenities?.hasParking}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">Parking</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="has24HourSecurity"
                      defaultChecked={initialData?.buildingAmenities?.has24HourSecurity}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">
                      24/7 Security
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasGarden"
                      defaultChecked={initialData?.buildingAmenities?.hasGarden}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">Garden</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input type="checkbox" name="hasGym" defaultChecked={initialData?.buildingAmenities?.hasGym} className="w-5 h-5" />
                    <span className="font-medium text-gray-700">
                      Gym/Fitness Center
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasCommonRoom"
                      defaultChecked={initialData?.buildingAmenities?.hasCommonRoom}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">
                      Common Room
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasLaundry"
                      defaultChecked={initialData?.buildingAmenities?.hasLaundry}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">
                      Laundry Facility
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="hasGenerator"
                      defaultChecked={initialData?.buildingAmenities?.hasGenerator}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">
                      Generator (Power Backup)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input type="checkbox" name="hasCCTV" defaultChecked={initialData?.buildingAmenities?.hasCCTV} className="w-5 h-5" />
                    <span className="font-medium text-gray-700">
                      CCTV Surveillance
                    </span>
                  </label>
                </div>
              </section>
            )}

            {/* Meal Plan - Offer only */}
            {type === "offer" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Meal Plan
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="mealIncluded"
                      defaultChecked={initialData?.mealPlan?.included}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">
                      Meals Included
                    </span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                      <input
                        type="checkbox"
                        name="breakfast"
                        defaultChecked={initialData?.mealPlan?.breakfast}
                        className="w-5 h-5"
                      />
                      <span className="font-medium text-gray-700">
                        Breakfast
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                      <input type="checkbox" name="lunch" defaultChecked={initialData?.mealPlan?.lunch} className="w-5 h-5" />
                      <span className="font-medium text-gray-700">Lunch</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                      <input
                        type="checkbox"
                        name="dinner"
                        defaultChecked={initialData?.mealPlan?.dinner}
                        className="w-5 h-5"
                      />
                      <span className="font-medium text-gray-700">Dinner</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                      <input
                        type="checkbox"
                        name="packingAllowed"
                        defaultChecked={initialData?.mealPlan?.packingAllowed}
                        className="w-5 h-5"
                      />
                      <span className="font-medium text-gray-700">
                        Packing Allowed
                      </span>
                    </label>
                  </div>
                </div>
              </section>
            )}

            {/* Utilities Included - Offer only */}
            {type === "offer" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Utilities Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="electricity"
                      defaultChecked={initialData?.utilitiesIncluded?.electricity}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">
                      Electricity
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input type="checkbox" name="water" defaultChecked={initialData?.utilitiesIncluded?.water} className="w-5 h-5" />
                    <span className="font-medium text-gray-700">Water</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="internet"
                      defaultChecked={initialData?.utilitiesIncluded?.internet}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">Internet</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input type="checkbox" name="gas" defaultChecked={initialData?.utilitiesIncluded?.gas} className="w-5 h-5" />
                    <span className="font-medium text-gray-700">Gas</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <input type="checkbox" name="garbage" defaultChecked={initialData?.utilitiesIncluded?.garbage} className="w-5 h-5" />
                    <span className="font-medium text-gray-700">
                      Garbage Collection
                    </span>
                  </label>
                </div>
              </section>
            )}

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Information
              </h2>
              <input
                name="contactNumber"
                required
                defaultValue={initialData?.contactNumber}
                placeholder="0771234567"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
              />
            </section>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${type === "offer" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  {isEditing ? <Save className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  {isEditing ? "Update" : "Publish"} {type === "offer" ? "Offer" : "Request"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
