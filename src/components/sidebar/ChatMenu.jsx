// src/components/sidebar/ChatMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  EllipsisHorizontalIcon,
  ShareIcon,
  PencilIcon,
  FolderPlusIcon,
  ArchiveBoxIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const ChatMenu = ({
  chat,
  onShare,
  onRename,
  onAddToProject,
  onArchive,
  onDelete,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title || '');
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowRenameInput(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (action === 'rename') {
      setShowRenameInput(true);
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    switch (action) {
      case 'share':
        onShare?.(chat);
        break;
      case 'addToProject':
        onAddToProject?.(chat);
        break;
      case 'archive':
        onArchive?.(chat);
        break;
      case 'delete':
        onDelete?.(chat);
        break;
    }
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (newTitle.trim() && newTitle !== chat.title) {
      onRename?.(chat, newTitle.trim());
    }
    setShowRenameInput(false);
  };

  const handleRenameCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNewTitle(chat.title || '');
    setShowRenameInput(false);
  };

  const menuItems = [
    {
      icon: ShareIcon,
      label: 'Share',
      action: 'share',
      className: 'text-gray-700 hover:text-gray-900'
    },
    {
      icon: PencilIcon,
      label: 'Rename',
      action: 'rename',
      className: 'text-gray-700 hover:text-gray-900'
    },
    {
      icon: FolderPlusIcon,
      label: 'Add to project',
      action: 'addToProject',
      className: 'text-gray-700 hover:text-gray-900'
    },
    {
      icon: ArchiveBoxIcon,
      label: 'Archive',
      action: 'archive',
      className: 'text-gray-700 hover:text-gray-900'
    },
    {
      icon: TrashIcon,
      label: 'Delete',
      action: 'delete',
      className: 'text-red-600 hover:text-red-700'
    }
  ];

  if (showRenameInput) {
    return (
      <div className={`flex items-center w-full ${className}`}>
        <form onSubmit={handleRenameSubmit} className="flex-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRenameCancel}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleRenameCancel(e);
              }
            }}
            className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
            maxLength={100}
          />
        </form>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleMenuClick}
        className="p-1 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Chat options"
      >
        <EllipsisHorizontalIcon className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[160px]"
        >
          {menuItems.map((item) => (
            <button
              key={item.action}
              onClick={(e) => handleMenuItemClick(item.action, e)}
              className={`
                w-full flex items-center px-3 py-2 text-sm transition-colors text-left
                hover:bg-gray-50 ${item.className}
              `}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMenu;