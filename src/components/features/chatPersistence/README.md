# 🚀 Chat Persistence Feature Setup Guide

## Step 1: Create Frontend Folder Structure
cd frontend/src
mkdir -p components/features/chatPersistence/{components,hooks,services}

## Step 2: Add the Files
# Copy each artifact to its respective location:

# Main feature files:
# - ChatPersistenceFeature.jsx → components/features/chatPersistence/
# - index.js → components/features/chatPersistence/

# Components:
# - ChatHistoryPanel.jsx → components/features/chatPersistence/components/

# Hooks:
# - useChatPersistence.js → components/features/chatPersistence/hooks/

# Services:
# - chatStorageService.js → components/features/chatPersistence/services/

## Step 3: Update Existing Files
# Replace your existing ChatLayout.jsx with the enhanced version
# Update your useChat hook (optional but recommended)

## Step 4: Update Your Backend API URL
# In chatStorageService.js, make sure the API_BASE URL matches your backend:
# const API_BASE = 'http://localhost:8000/api/v1/chat-persistence';

## Step 5: Test the Integration

# 1. Start your backend:
cd backend
uvicorn main:app --reload

# 2. Start your frontend:
cd frontend
npm run dev

# 3. Open http://localhost:5173 (or your frontend port)

## Step 6: Test the Features

# ✅ Create a new chat session
# ✅ Send some messages
# ✅ Check if messages auto-save
# ✅ Load chat history in sidebar
# ✅ Switch between conversations
# ✅ Delete old conversations
# ✅ Edit conversation titles

## Step 7: Debugging

# Check browser console for:
# - "✅ New chat session created: [session-id]"
# - "💾 Message auto-saved"
# - "📖 Loading session: [title]"

# Check backend logs for:
# - Database connection success
# - API endpoint calls
# - Message save confirmations

## Troubleshooting

# If authentication issues:
# - Ensure your authHelpers.getToken() returns valid JWT
# - Check CORS settings in backend
# - Verify user authentication flow

# If database issues:
# - Check MySQL container is running: docker ps | grep mysql
# - Verify tables exist: USE askwise_chat_app; SHOW TABLES;
# - Check backend logs for SQL errors

# If frontend issues:
# - Check React console for component errors
# - Verify all imports are correct
# - Ensure folder structure matches exactly

echo "🎉 Chat Persistence Feature Setup Complete!"
echo "Your users can now save and load chat conversations!"