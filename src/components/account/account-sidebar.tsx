"use client";

import React from 'react'
import { AccountIcon, ProfileIcon, LanguageIcon, BillingIcon, NotificationsIcon, UsageIcon } from '@/icons'
import { useTheme } from '@/hooks/use-theme'

export type AccountSection = 'account' | 'profile' | 'language' | 'subscription' | 'notifications' | 'usage'

interface AccountSidebarProps {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
  onClose?: () => void;
}

const menuItems: Array<{
  id: AccountSection;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
}> = [
  {
    id: "account",
    label: "Account",
    icon: (isActive) => (
      <AccountIcon
        color={
          isActive
            ? "var(--tokens-color-text-text-brand)"
            : "var(--tokens-color-text-text-primary)"
        }
      />
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (isActive) => (
      <ProfileIcon
        color={
          isActive
            ? "var(--tokens-color-text-text-brand)"
            : "var(--tokens-color-text-text-primary)"
        }
      />
    ),
  },
  {
    id: "language",
    label: "Language",
    icon: (isActive) => (
      <LanguageIcon
        color={
          isActive
            ? "var(--tokens-color-text-text-brand)"
            : "var(--tokens-color-text-text-primary)"
        }
      />
    ),
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: (isActive) => <BillingIcon color={isActive ? "var(--tokens-color-text-text-brand)" : "#000000"} />
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: (isActive) => (
      <NotificationsIcon
        color={
          isActive
            ? "var(--tokens-color-text-text-brand)"
            : "var(--tokens-color-text-text-primary)"
        }
      />
    ),
  },
  {
    id: "usage",
    label: "Usage",
    icon: (isActive) => (
      <UsageIcon
        color={
          isActive
            ? "var(--tokens-color-text-text-brand)"
            : "var(--tokens-color-text-text-primary)"
        }
      />
    ),
  },
];

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeSection,
  onSectionChange,
  onClose,
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  return (
    <div className="p-2 lg:p-4 h-auto backdrop-blur-[2.91px] border-[color:var(--tokens-color-border-border-subtle)] mt-6">
      <div className={`flex flex-col p-2 lg:p-5 ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-default)] rounded-[12px]' : ''}`}>
        <div className="">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center justify-center lg:justify-start gap-2 lg:gap-5 px-2 lg:px-3 py-3 mb-1 rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors text-left w-full ${
                  isDark 
                    ? isActive
                      ? " "
                      : "hover:bg-[color:var(--tokens-color-surface-surface-card-hover)]"
                    : "hover:bg-[color:var(--tokens-color-surface-surface-hover)]"
                }`}
                style={isDark && isActive ? {
                  backgroundColor: 'var(--tokens-color-surface-surface-card-hover)'
                } : !isDark && isActive ? {
                  backgroundColor: 'var(--tokens-color-surface-surface-tertiary)'
                } : {}}
                title={item.label}
              >
                <div className="flex-shrink-0 w-5 h-5">
                  {item.icon(isActive)}
                </div>
                <span
                  className="hidden lg:inline font-h02-heading02 font-[number:var(--text-font-weight)] text-[16px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
                  style={{
                    color: isActive
                      ? "var(--tokens-color-text-text-brand)"
                      : "var(--tokens-color-text-text-primary)",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
