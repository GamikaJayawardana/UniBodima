"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, MapPin, Building2, Wallet, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface DropdownProps {
  label: string;
  options: string[];
  icon: any;
  value: string;
  onChange: (value: string) => void;
}

const CustomDropdown = ({ label, options, icon: Icon, value, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-grow lg:flex-grow-0 lg:w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="space-y-1.5 px-4 cursor-pointer group"
      >
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block group-hover:text-sky-600 transition-colors">
          {label}
        </label>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon className="w-4 h-4 text-sky-500 shrink-0" />
            <span className="font-bold text-slate-900 text-sm truncate">{value || "Select"}</span>
          </div>
          <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+1.5rem)] left-0 w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 py-4 z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-1">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-6 py-3 text-sm font-bold cursor-pointer transition-all flex items-center gap-3 ${
                  value === option ? 'text-sky-600 bg-sky-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${value === option ? 'bg-sky-500 scale-100' : 'bg-transparent scale-0'}`}></div>
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Any Type");
  const [budget, setBudget] = useState("Any Budget");
  const [gender, setGender] = useState("Any");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append("university", location);
    if (type !== "Any Type") params.append("type", type.toLowerCase().includes("boarding") ? "boarding" : type.toLowerCase());
    if (gender !== "Any") params.append("gender", gender);
    
    router.push(`/offers?${params.toString()}`);
  };

  return (
    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[95%] lg:w-[92%] bg-white rounded-[32px] shadow-2xl p-4 md:p-6 lg:p-4 border border-slate-100 animate-in slide-in-from-bottom-8 duration-1000 delay-300 z-50">
      <div className="flex flex-col lg:flex-row items-center">
        
        {/* Location Input */}
        <div className="w-full lg:w-[28%] space-y-1.5 px-6 group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block group-hover:text-sky-600 transition-colors">University / Area</label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kelaniya, Colombo" 
              className="w-full bg-transparent border-none outline-none font-bold text-slate-900 placeholder:text-slate-300 text-sm" 
            />
          </div>
        </div>

        <div className="hidden lg:block w-px h-10 bg-slate-100"></div>

        {/* Custom Dropdowns */}
        <div className="w-full lg:w-[17%]">
          <CustomDropdown 
            label="Property Type" 
            icon={Building2}
            value={type}
            onChange={setType}
            options={["Any Type", "Boarding Place", "Hostel / Dorm", "Apartment"]}
          />
        </div>

        <div className="hidden lg:block w-px h-10 bg-slate-100"></div>

        <div className="w-full lg:w-[17%]">
          <CustomDropdown 
            label="Budget Cap" 
            icon={Wallet}
            value={budget}
            onChange={setBudget}
            options={["Any Budget", "Under 15k", "15k - 30k", "30k - 50k", "50k+"]}
          />
        </div>

        <div className="hidden lg:block w-px h-10 bg-slate-100"></div>

        <div className="w-full lg:w-[15%]">
          <CustomDropdown 
            label="Gender" 
            icon={Users}
            value={gender}
            onChange={setGender}
            options={["Any", "Male Only", "Female Only"]}
          />
        </div>

        {/* Search Button */}
        <div className="w-full lg:w-[23%] lg:pl-4 mt-4 lg:mt-0">
          <button 
            onClick={handleSearch}
            className="w-full bg-slate-900 text-white rounded-[24px] py-5 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:translate-y-1 group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Search Hub</span>
          </button>
        </div>

      </div>
    </div>
  );
}
