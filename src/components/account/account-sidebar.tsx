"use client";

import React, { useState, useEffect } from 'react'
import { AccountIcon, ProfileIcon, LanguageIcon, BillingIcon, NotificationsIcon, UsageIcon } from '@/icons'
import { useTheme } from '@/hooks/use-theme'
import { t } from '@/i18n'
import { ActionButton } from '@/components/ui/buttons'

export type AccountSection = 'account' | 'profile' | 'language' | 'subscription' | 'notifications' | 'usage'

interface AccountSidebarProps {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
  onClose?: () => void;
}

const getMenuItems = (): Array<{
  id: AccountSection;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
}> => [
  {
    id: "account",
    label: t("account.sidebar.account"),
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
    label: t("account.sidebar.profile"),
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
    label: t("account.sidebar.language"),
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
    label: t("account.sidebar.subscription"),
    icon: (isActive) => <BillingIcon color={isActive ? "var(--tokens-color-text-text-brand)" : "var(--tokens-color-text-text-primary)"} />
  },
  // {
  //   id: "notifications",
  //   label: t("account.sidebar.notifications"),
  //   icon: (isActive) => (
  //     <NotificationsIcon
  //       color={
  //         isActive
  //           ? "var(--tokens-color-text-text-brand)"
  //           : "var(--tokens-color-text-text-primary)"
  //       }
  //     />
  //   ),
  // },
  {
    id: "usage",
    label: t("account.sidebar.analytics"),
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
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const menuItems = getMenuItems();
  
  return (
    <div className={`p-2 lg:p-4 h-auto backdrop-blur-[2.91px] border-[color:var(--tokens-color-border-border-subtle)] ${isMobile ? 'mt-16' : 'mt-6'}`}>
      <div className={`flex flex-col p-2 lg:p-5 ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-default)] rounded-[12px]' : ''}`}>
        <div className="">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <ActionButton
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                variant="ghost"
                fullWidth
                size="sm"
                className={`!justify-center lg:!justify-start gap-2 lg:gap-5 px-2 lg:px-3 py-3 mb-1 rounded-[var(--premitives-corner-radius-corner-radius)] text-left !h-auto ${
                  isDark 
                    ? isActive
                      ? "!bg-[color:var(--tokens-color-surface-surface-card-hover)]"
                      : "hover:!bg-[color:var(--tokens-color-surface-surface-card-hover)]"
                    : isActive
                      ? "!bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                      : "hover:!bg-[color:var(--tokens-color-surface-surface-hover)]"
                }`}
                leftIcon={
                  <div className="flex-shrink-0 w-5 h-5">
                    {item.icon(isActive)}
                  </div>
                }
              >
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
              </ActionButton>
            );
          })}
        </div>
      </div>
    </div>
  );
};
