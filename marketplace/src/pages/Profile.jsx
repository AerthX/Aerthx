import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../shared-redux/src/slices/profileSlice";
import { FaInfoCircle, FaCheckCircle, FaSpinner, FaCloudUploadAlt, FaSave, FaUser, FaBuilding, FaMapMarkerAlt, FaLink, FaPhone, FaMap } from "react-icons/fa";
import DefaultAvatar from "../Components/Header/DefaultAvatar";
import { setUser } from "../shared-redux/src/slices/authSlice";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MotionDiv = motion.div;

const Profile = () => {
    const dispatch = useDispatch();
  const { data: profileData, loading } = useSelector((state) => state.profile);
    const userType = useSelector((state) => state.auth.userType);

    const [form, setForm] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

  
useEffect(() => {
  if (userType) {
    dispatch(fetchProfile({ userType }));
  }
}, [dispatch, userType]);

    useEffect(() => {
        if (profileData) {
            const data = profileData.org || profileData.user || profileData;
            setForm({
                orgName: data.orgName || "",
                fullName: data.fullName || "",
                orgType: data.orgType || "",
                industry: data.industry || "",
                website: data.website || "",
                email: data.email || "",
                about: data.about || "",
                description: data.description || "",
                city: data.city || "",
                state: data.state || "",
                country: data.country || "",
                phone: data.phone || "",
                designation: data.designation || "",
            });

         if (data.avatarUrl) {
  setPreviewAvatarUrl(data.avatarUrl);
}
        }
    }, [profileData]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const url = URL.createObjectURL(file);
            setPreviewAvatarUrl(url);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      if (!form) {
            toast.error("Profile data not loaded. Please try again.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        try {
            const res = await dispatch(updateProfile({ userType, formData })).unwrap();
            
          const updatedUser = userType === "organization" ? res.org : res.user;

dispatch(setUser(updatedUser));
localStorage.setItem("user", JSON.stringify(updatedUser));

if (updatedUser?.avatarUrl) {
  setPreviewAvatarUrl(updatedUser.avatarUrl);
}
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputDescriptions = {
        orgName: "The legal name of your organization.",
        orgType: "Type of entity like NGO, Private Ltd., etc.",
        industry: "The industry your organization belongs to.",
        website: "Official website URL.",
        phone: "Organization’s contact number.",
        fullName: "Representative or contact person’s full name.",
        city: "City where the organization is located.",
        state: "State of the organization.",
        country: "Country where your organization operates.",
        designation: "Role of the representative (e.g., CEO, Manager).",
         about: "Tell us more about your organization or yourself. (Max 500 characters)",
        description: "Tell us more about your organization or yourself. (Max 500 characters)",
    };

    if (loading || !form) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
                <FaSpinner className="animate-spin text-green-500 text-6xl" />
                <span className="ml-4 text-gray-400 text-lg font-semibold">Loading profile...</span>
            </div>
        );
    }

    const orgFields = [
        { label: "Organization Name", name: "orgName", type: "text", icon: <FaBuilding /> },
        { label: "Organization Type", name: "orgType", type: "text", icon: <FaInfoCircle /> },
        { label: "Industry", name: "industry", type: "text", icon: <FaLink /> },
        { label: "Website", name: "website", type: "url", icon: <FaLink /> },
    ];
    
    const contactFields = [
        { label: "Full Name", name: "fullName", type: "text", icon: <FaUser /> },
        { label: "Designation", name: "designation", type: "text", icon: <FaUser /> },
        { label: "Phone", name: "phone", type: "tel", icon: <FaPhone /> },
    ];

    const locationFields = [
        { label: "City", name: "city", type: "text", icon: <FaMapMarkerAlt /> },
        { label: "State", name: "state", type: "text", icon: <FaMapMarkerAlt /> },
        { label: "Country", name: "country", type: "text", icon: <FaMap /> },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.5, 
                staggerChildren: 0.1
            } 
        }
    };
    
    const inputVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#151515] to-[#0A0A0A] text-white font-sans py-8 sm:py-10 md:py-12 px-4 sm:px-6">
            <MotionDiv
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-6xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-white/5 backdrop-blur-2xl border border-white/10"
            >
                <div className="relative p-6 sm:p-8 md:p-12 text-center bg-gradient-to-br from-[#1A1A1A] to-[#252525] border-b border-white/10 overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-dots opacity-50"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full shadow-xl sm:shadow-2xl border-4 border-[#50C878] transition-transform duration-300 hover:scale-105 group"
                        >
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-700/50">
                                {previewAvatarUrl ? (
                                    <img src={previewAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <DefaultAvatar name={form.orgName?.trim() || form.fullName || ""} size={192} />
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white text-4xl">
                                <FaCloudUploadAlt />
                                <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                            </label>
                        </motion.div>
                        
                        <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            {userType === "organization" ? form.orgName : form.fullName}
                        </h1>
                        <p className="text-sm text-gray-400 mt-2 font-light">
                            {userType === "organization" ? (form.orgType || "Organization") : (form.designation || "User")}
                        </p>
                    </div>
                </div>

              <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 p-5 sm:p-6 md:p-8 flex flex-col items-start justify-center border-b md:border-b-0 md:border-r border-white/10">
                        <MotionDiv variants={sectionVariants} initial="hidden" animate="visible" className="w-full">
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Summary</h3>
                            <MotionDiv variants={inputVariants} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                                <p className="text-sm text-gray-300 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-gray-500" />
                                    <span>{form.city ? `${form.city}, ${form.country}` : 'Location Not Set'}</span>
                                </p>
                                <p className="text-sm text-gray-300 flex items-center gap-2">
                                    <FaPhone className="text-gray-500" />
                                    <span>{form.phone || 'Phone Not Set'}</span>
                                </p>
                                {userType === 'organization' && (
                                    <p className="text-sm text-gray-300 flex items-center gap-2">
                                        <FaLink className="text-gray-500" />
                                        <span><a href={form.website} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">{form.website || 'Website Not Set'}</a></span>
                                    </p>
                                )}
                            </MotionDiv>
                        </MotionDiv>

                        <MotionDiv variants={sectionVariants} initial="hidden" animate="visible" className="mt-8 w-full">
                            <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
                         <MotionDiv
  variants={inputVariants}
  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-green-500/20 bg-gradient-to-br from-white/5 to-green-500/5 shadow-lg"
>
  <label
    htmlFor="description"
    className="block text-sm font-medium text-green-400 mb-2"
  >
    description / Organization
  </label>

  <div className="relative">
    <textarea
      id="description"
      name="description"
      value={form.description}
      onChange={handleChange}
      rows="5"
      maxLength={500}
      placeholder="Tell us about your mission, goals, and what makes you unique..."
      className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-gray-200 text-sm placeholder-gray-500 italic font-light resize-none focus:outline-none focus:ring-2 focus:ring-green-400/40 transition"
    />
    <span className="absolute bottom-2 right-3 text-xs text-gray-500">
      {form.description.length} / 500
    </span>
  </div>
</MotionDiv>


                        </MotionDiv>
                        
                        {userType === "organization" && (
                            <MotionDiv variants={sectionVariants} initial="hidden" animate="visible" className="mt-8 w-full">
                                <h3 className="text-xl font-semibold text-white mb-4">Our Promise</h3>
                               <MotionDiv variants={inputVariants} className="p-6 rounded-2xl border border-green-500/40 bg-green-500/5 space-y-2">
  <ul className="list-none text-sm text-gray-300">
    <li className="flex items-start gap-2">
      <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
      <div><span className="font-semibold text-white">Verified Projects:</span> Only certified carbon credits.</div>
    </li>

    <li className="flex items-start gap-2">
      <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
      <div><span className="font-semibold text-white">Fair Pricing:</span> Transparent pricing with no hidden fees.</div>
    </li>

    <li className="flex items-start gap-2">
      <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
      <div><span className="font-semibold text-white">Sustainability Focus:</span> Every purchase supports real environmental impact.</div>
    </li>

    <li className="flex items-start gap-2">
      <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
      <div><span className="font-semibold text-white">Customer Support:</span> Friendly assistance whenever you need it.</div>
    </li>

    <li className="flex items-start gap-2">
      <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
      <div><span className="font-semibold text-white">Data Security:</span> Your information is securely stored.</div>
    </li>
  </ul>
</MotionDiv>

                            </MotionDiv>
                        )}
                    </div>

                    <div className="md:w-2/3 p-5 sm:p-6 md:p-12">
                        <MotionDiv variants={sectionVariants} initial="hidden" animate="visible">
                            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">
                                Edit Your Profile
                            </h2>
                        </MotionDiv>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {userType === "organization" && (
                                <MotionDiv variants={sectionVariants}>
                                    <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Organization Details</h3>
                                    <MotionDiv variants={inputVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                                        {orgFields.map(({ label, name, type, icon }) => (
                                            <div key={name} className="flex flex-col">
                                                <label htmlFor={name} className="font-medium text-gray-400 mb-2 text-sm flex items-center gap-2">
                                                    {icon} {label}
                                                </label>
                                                <input
                                                    id={name}
                                                    type={type}
                                                    name={name}
                                                    value={form[name]}
                                                    onChange={handleChange}
                                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-inner shadow-black/20"
                                                />
                                            </div>
                                        ))}
                                    </MotionDiv>
                                </MotionDiv>
                            )}

                            <MotionDiv variants={sectionVariants}>
                                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Contact & Personal Details</h3>
                                <MotionDiv variants={inputVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(userType === "organization" ? contactFields : [...contactFields, ...locationFields]).map(({ label, name, type, icon }) => (
                                        <div key={name} className="flex flex-col">
                                            <label htmlFor={name} className="font-medium text-gray-400 mb-2 text-sm flex items-center gap-2">
                                                {icon} {label}
                                            </label>
                                            <input
                                                id={name}
                                                type={type}
                                                name={name}
                                                value={form[name]}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-inner shadow-black/20"
                                            />
                                        </div>
                                    ))}
                                </MotionDiv>
                            </MotionDiv>
                            
                            {userType === "user" && (
                                <MotionDiv variants={sectionVariants}>
                                    <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Location</h3>
                                    <MotionDiv variants={inputVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {locationFields.map(({ label, name, type, icon }) => (
                                            <div key={name} className="flex flex-col">
                                                <label htmlFor={name} className="font-medium text-gray-400 mb-2 text-sm flex items-center gap-2">
                                                    {icon} {label}
                                                </label>
                                                <input
                                                    id={name}
                                                    type={type}
                                                    name={name}
                                                    value={form[name]}
                                                    onChange={handleChange}
                                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-inner shadow-black/20"
                                                />
                                            </div>
                                        ))}
                                    </MotionDiv>
                                </MotionDiv>
                            )}
                            
                          <MotionDiv variants={sectionVariants}>
  <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">About</h3>
  <MotionDiv variants={inputVariants} className="flex flex-col">
    <textarea
      id="about"
      name="about"
      value={form.about}
      onChange={handleChange}
      rows="4"
      maxLength={500}
      placeholder="Write about yourself or your organization..."
      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 resize-none shadow-inner shadow-black/20"
    />
    <span className="mt-1 text-xs text-gray-500 self-end">
      {form.about?.length || 0} / 500
    </span>
  </MotionDiv>
</MotionDiv>

                            <MotionDiv variants={sectionVariants}>
                                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Account Information</h3>
                                <MotionDiv variants={inputVariants}>
                                    <div className="flex flex-col">
                                        <label htmlFor="email" className="font-medium text-gray-400 mb-2 text-sm">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            readOnly
                                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-gray-500 cursor-not-allowed shadow-inner shadow-black/20"
                                        />
                                    </div>
                                </MotionDiv>
                            </MotionDiv>
                            
                            <MotionDiv variants={sectionVariants} className="flex justify-end pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0px 0px 20px rgba(74, 222, 128, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                   className={`flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base text-gray-900 font-bold shadow-lg transition-all duration-200
${isSubmitting ? "bg-green-500/50 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </MotionDiv>
                        </form>
                    </div>
                </div>
            </MotionDiv>
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
        </div>
    );
};

export default Profile;