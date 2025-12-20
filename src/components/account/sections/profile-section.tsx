"use client";

import React, { useState, useEffect, useRef } from "react";
import { PersonFace, ArrowRightSm, DownArrow } from "@/icons";
import { useTheme } from "@/hooks/use-theme";
import { t } from "@/i18n";
import { ActionButton } from "@/components/ui/buttons";
import { userApi } from "@/api/user/api";
import { UserProfileResponse } from "@/api/user/types";
import { fileApi } from "@/api/files/api";
import { appConfig } from "@/config/app";
import { useToast } from "@/hooks/use-toast";

export const ProfileSection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState<UserProfileResponse | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    workFunction: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<number[]>([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfile();
      if (response.error || !response.data) {
        console.error("Failed to fetch user profile:", response.error);
        return;
      }
      
      const user = response.data;
      setUserData(user);
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        password: "",
        confirmPassword: "",
        workFunction: "",
      });
      
      if (user.profile_picture) {
        setProfilePictureUrl(user.profile_picture);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError(null);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showErrorToast('Invalid File Type', 'Please select an image file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setProfilePicturePreview(preview);
      };
      reader.readAsDataURL(file);

      const uploadedFile = await fileApi.uploadFile({ file });
      
      if (uploadedFile.error || !uploadedFile.data) {
        console.error("Failed to upload file:", uploadedFile.error);
        showErrorToast('Upload Failed', uploadedFile.error || "Failed to upload file");
        return;
      }

      const fileUrl = uploadedFile.data.file.file_path || uploadedFile.data.storage_info?.stored_filename;
      if (fileUrl) {
        let fullUrl = fileUrl;
        if (!fileUrl.startsWith('http')) {
          const path = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
          fullUrl = `${appConfig.backendUrl}${path}`;
        }
        setProfilePictureUrl(fullUrl);
        setProfilePicturePreview(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showErrorToast('Upload Failed', "Failed to upload file");
    }
  };

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    
    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(pwd)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(pwd)) {
      errors.push('Password must contain at least one digit');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError(t('auth.passwordsDoNotMatch') || "Passwords do not match");
        return;
      }
      
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        setPasswordError(passwordErrors[0]);
        return;
      }
    }
    
    try {
      setSubmitting(true);
      setPasswordError(null);
      
      const updateData: any = {};
      if (formData.first_name !== userData?.first_name) {
        updateData.first_name = formData.first_name;
      }
      if (formData.last_name !== userData?.last_name) {
        updateData.last_name = formData.last_name;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }
      if (profilePictureUrl && profilePictureUrl !== userData?.profile_picture) {
        updateData.profile_picture = profilePictureUrl;
      }

      if (Object.keys(updateData).length === 0) {
        setSubmitting(false);
        return;
      }

      const response = await userApi.updateProfile(updateData);
      if (response.error || !response.data) {
        console.error("Failed to update profile:", response.error);
        showErrorToast('Update Failed', response.error || "Failed to update profile");
        return;
      }

      setUserData(response.data);
      if (response.data.profile_picture) {
        setProfilePictureUrl(response.data.profile_picture);
      }
      
      setFormData((prev: typeof formData) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      
      showSuccessToast('Profile Updated', 'Your profile has been updated successfully');
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast('Update Failed', "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const displayPicture = profilePicturePreview || profilePictureUrl;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col p-4 sm:p-9">
        <div className="flex items-center justify-center h-64">
          <p className="text-[color:var(--tokens-color-text-text-primary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-9">
      <form onSubmit={handleSubmit}>
        <div className={`flex flex-col mt-9 bg-[color:var(--account-section-card-bg)] gap-6 p-6 sm:p-9 rounded-[16px] ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)]' : 'border'} `}
        >
          <h1 className="text-emphasis !text-[20px] text-[var(--tokens-color-text-text-seconary)]">
            {t('account.profile.title')}
          </h1>

          {/* Profile Picture */}
          <div className="flex items-center justify-center lg:justify-start">
            <div 
              onClick={handleProfilePictureClick}
              className="w-24 h-24 rounded-xl bg-[color:var(--tokens-color-surface-surface-tertiary)] flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              {displayPicture ? (
                <img 
                  src={displayPicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                  <PersonFace className="w-12 h-12" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* All Input Fields in Aligned Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                {t('account.profile.fullName')}
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder={t('account.profile.fullNamePlaceholder')}
                className={`flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] ${
                  isDark ? '' : 'border-[#dbdbdb] bg-transparent text-black'
                }`}
                style={isDark ? {
                  borderColor: 'var(--tokens-color-border-border-inactive)',
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                  color: 'var(--tokens-color-text-text-primary)'
                } : {}}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                {t('account.profile.displayName')}
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder={t('account.profile.displayNamePlaceholder')}
                className={`flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] ${
                  isDark ? '' : 'border-[#dbdbdb] bg-transparent text-black'
                }`}
                style={isDark ? {
                  borderColor: 'var(--tokens-color-border-border-inactive)',
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                  color: 'var(--tokens-color-text-text-primary)'
                } : {}}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                {t('account.profile.password')}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('account.profile.passwordPlaceholder')}
                className={`flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] ${
                  isDark ? '' : 'border-[#dbdbdb] bg-transparent text-black'
                } ${passwordError ? 'border-red-500' : ''}`}
                style={isDark ? {
                  borderColor: passwordError ? '#ef4444' : 'var(--tokens-color-border-border-inactive)',
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                  color: 'var(--tokens-color-text-text-primary)'
                } : {}}
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                {t('account.profile.confirmPassword')}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('account.profile.confirmPasswordPlaceholder')}
                className={`flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] ${
                  isDark ? '' : 'border-[#dbdbdb] bg-transparent text-black'
                } ${passwordError ? 'border-red-500' : ''}`}
                style={isDark ? {
                  borderColor: passwordError ? '#ef4444' : 'var(--tokens-color-border-border-inactive)',
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                  color: 'var(--tokens-color-text-text-primary)'
                } : {}}
              />
            </div>
          </div>

          {/* Password Error Message */}
          {passwordError && (
            <div className="text-red-500 text-sm mt-[-16px]">
              {passwordError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <ActionButton
              type="submit"
              disabled={submitting}
              className="px-6 py-2"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </ActionButton>
          </div>

        </div>
      </form>
    </div>
  );
};
