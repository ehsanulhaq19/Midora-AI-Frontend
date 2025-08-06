<<<<<<< HEAD
# Integration Guide: New ChatGPT-Style UI

## Overview
This guide helps you integrate the new ChatGPT-style UI components into your existing askwisetoday project.

## Component Structure

### New Components Created:
1. **CollapsibleSidebar.jsx** - Replaces your existing Sidebar.jsx
2. **WelcomeScreen.jsx** - New welcome screen with model selection
3. **ChatContainer.jsx** - Updated chat interface
4. **ModelIcon.jsx** - Component for model icons
5. **ChatLayout.jsx** - Updated main layout

## File Placement

```
frontend/src/components/
├── chat/
│   ├── ChatContainer.jsx          # ✅ Updated
│   ├── ChatInput.jsx              # 🔄 Can be removed (functionality moved to ChatContainer)
│   └── ChatMessage.jsx            # 🔄 Can be removed (functionality moved to ChatContainer)
├── sidebar/
│   ├── CollapsibleSidebar.jsx     # ✅ New (replaces Sidebar.jsx)
│   ├── ChatList.jsx               # 🔄 Integrated into CollapsibleSidebar
│   ├── ModelSelector.jsx          # 🔄 Integrated into WelcomeScreen
│   └── Sidebar.jsx                # ❌ Can be removed
└── ui/
    ├── WelcomeScreen.jsx           # ✅ New
    ├── ModelIcon.jsx               # ✅ New
    └── ... (existing UI components)
```

## Integration Steps

### 1. Install Required Dependencies (if not already installed)
```bash
npm install @heroicons/react
```

### 2. Update Your SVG Icons

Replace the placeholder icons in `ModelIcon.jsx` with your actual SVG files:

```jsx
// components/ui/ModelIcon.jsx
import ClaudeIcon from '../../assets/icons/claude.svg';
import ClaudeLightIcon from '../../assets/icons/claude symbol - Ivory.svg';
import OpenAIIcon from '../../assets/icons/openai.svg';
import GeminiIcon from '../../assets/icons/gemini.svg';

export const ModelIconSVG = ({ modelId, className = "w-6 h-6" }) => {
  const iconMap = {
    claude: ClaudeIcon,
    'gpt-4o': OpenAIIcon,
    'gpt-4o-mini': OpenAIIcon,
    gemini: GeminiIcon
  };

  const IconComponent = iconMap[modelId];
  
  if (!IconComponent) {
    return <div className={`${className} bg-gray-200 rounded`} />;
  }

  return <img src={IconComponent} alt={modelId} className={className} />;
};
```

### 3. Update Your App.jsx or Main Router

Replace your existing routing with the new layout:

```jsx
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatLayout from './pages/ChatLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatLayout />} />
        <Route path="/chat/:chatId" element={<ChatLayout />} />
        <Route path="/" element={<ChatLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### 4. Update Your Existing Services

Ensure your existing services work with the new components:

```jsx
// services/modelService.js - Update to match new model IDs
export const getAvailableModels = () => {
  return [
    { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o mini', provider: 'openai' },
    { id: 'gpt-4o', name: 'OpenAI GPT-4o', provider: 'openai' },
    { id: 'gemini', name: 'Google Gemini', provider: 'google' },
    { id: 'claude', name: 'Claude', provider: 'anthropic' }
  ];
};
```

### 5. Update Context Providers

Update your ModelProvider.jsx to work with the new model selection:

```jsx
// context/ModelProvider.jsx
import React, { createContext, useContext, useState } from 'react';

const ModelContext = createContext();

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within ModelProvider');
  }
  return context;
};

export const ModelProvider = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [availableModels] = useState([
    { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o mini' },
    { id: 'gpt-4o', name: 'OpenAI GPT-4o' },
    { id: 'gemini', name: 'Google Gemini' },
    { id: 'claude', name: 'Claude' }
  ]);

  return (
    <ModelContext.Provider value={{
      selectedModel,
      setSelectedModel,
      availableModels
    }}>
      {children}
    </ModelContext.Provider>
  );
};
```

## Key Features Implemented

### ✅ Completed Features:
- **Collapsible sidebar** with toggle functionality
- **Welcome screen** with greeting and quick actions
- **Model selector cards** with descriptions
- **Responsive design** for mobile and desktop
- **Chat interface** with message history
- **Input area** with attachment and send buttons
- **Model switching** during conversations

### 🔄 Features to Customize:
- **SVG icon integration** (replace placeholders with your actual icons)
- **API integration** (connect to your backend endpoints)
- **Authentication flow** (integrate with your auth system)
- **Chat persistence** (connect to your chat storage service)

## Styling Notes

The new design uses:
- **Light theme** (vs your current dark theme)
- **Tailwind CSS** utility classes
- **Clean, minimal design** similar to ChatGPT
- **Responsive breakpoints** for mobile/desktop

## Next Steps

1. **Test the components** in your development environment
2. **Replace SVG placeholders** with your actual icons
3. **Connect to your backend** API endpoints
4. **Test responsiveness** on different screen sizes
5. **Customize colors/styling** to match your brand

## Troubleshooting

If you encounter issues:
1. Ensure all dependencies are installed
2. Check that file paths match your project structure
3. Verify Tailwind CSS is properly configured
4. Test components individually before full integration

The new design maintains all your existing functionality while providing a modern, clean interface similar to ChatGPT's user experience.
=======
# flexai-frontend
This repository contains the frontend interface for FlexAI.ai, built with React, Tailwind CSS, and Vite. It provides users with:

- Unified AI assistant interface (GPT, Claude, Gemini)
- Model selector and side-by-side response comparison
- Token usage display and cost-saving insights
- Chat history persistence and inline code editing
- Responsive layout for web and mobile

Integrates directly with the FlexAI backend for secure communication and subscription gating..

>>>>>>> origin/main
