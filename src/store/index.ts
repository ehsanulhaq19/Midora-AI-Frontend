import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import conversationReducer from './slices/conversationSlice'
import aiModelsReducer from './slices/aiModelsSlice'
import toastReducer from './slices/toastSlice'
import projectsReducer from './slices/projectsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    aiModels: aiModelsReducer,
    toast: toastReducer,
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      thunk: true, // Explicitly enable thunk middleware
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
