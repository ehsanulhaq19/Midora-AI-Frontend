/**
 * WebSocket Event Constants
 * Defines all message types and event constants used in WebSocket communication
 * These should match the backend constants in app/constants/websocket_events.py
 */

// ============================================================================
// Client → Server Message Types
// ============================================================================

/** Ping message for keep-alive */
export const PING = 'ping'

/** Request pending events */
export const GET_PENDING = 'get_pending'

// ============================================================================
// Server → Client Message Types
// ============================================================================

/** Initial connection established message */
export const CONNECTION_ESTABLISHED = 'connection_established'

/** New message generated event */
export const MESSAGE_GENERATE = 'message_generate'

/** Message regenerated event */
export const MESSAGE_REGENERATE = 'message_regenerate'

/** Pong response to ping */
export const PONG = 'pong'

/** Pending events check completed */
export const PENDING_CHECK_COMPLETE = 'pending_check_complete'

/** Error message from server */
export const ERROR = 'error'

// ============================================================================
// Message Type Collections
// ============================================================================

/** Client request message types */
export const CLIENT_MESSAGE_TYPES = {
  [PING]: PING,
  [GET_PENDING]: GET_PENDING,
}

/** Server event message types */
export const SERVER_EVENT_TYPES = {
  [CONNECTION_ESTABLISHED]: CONNECTION_ESTABLISHED,
  [MESSAGE_GENERATE]: MESSAGE_GENERATE,
  [MESSAGE_REGENERATE]: MESSAGE_REGENERATE,
  [PONG]: PONG,
  [PENDING_CHECK_COMPLETE]: PENDING_CHECK_COMPLETE,
  [ERROR]: ERROR,
}

/** All valid message types */
export const ALL_MESSAGE_TYPES = {
  ...CLIENT_MESSAGE_TYPES,
  ...SERVER_EVENT_TYPES,
}

/** Message types that represent actual message delivery */
export const CONTENT_MESSAGE_TYPES = {
  [MESSAGE_GENERATE]: MESSAGE_GENERATE,
  [MESSAGE_REGENERATE]: MESSAGE_REGENERATE,
}

/** Message types that require user action/processing */
export const INTERACTIVE_MESSAGE_TYPES = {
  [MESSAGE_GENERATE]: MESSAGE_GENERATE,
  [MESSAGE_REGENERATE]: MESSAGE_REGENERATE,
  [ERROR]: ERROR,
}

/** Message types that are system/meta messages */
export const SYSTEM_MESSAGE_TYPES = {
  [CONNECTION_ESTABLISHED]: CONNECTION_ESTABLISHED,
  [PONG]: PONG,
  [PENDING_CHECK_COMPLETE]: PENDING_CHECK_COMPLETE,
}

// ============================================================================
// WebSocket Configuration Defaults
// ============================================================================

export const DEFAULT_PING_INTERVAL = 30000 // milliseconds (30 seconds)
export const DEFAULT_MESSAGE_TIMEOUT = 5000 // milliseconds (5 seconds)
export const DEFAULT_RECONNECT_DELAY = 3000 // milliseconds (3 seconds)
export const DEFAULT_MAX_RECONNECT_ATTEMPTS = 5

// ============================================================================
// Message Type Validation
// ============================================================================

/**
 * Validate if a message type is known and valid.
 *
 * @param messageType - Message type string to validate
 * @returns True if valid, False otherwise
 */
export const isValidMessageType = (messageType: string): boolean => {
  return messageType in ALL_MESSAGE_TYPES
}

/**
 * Check if message type is sent by server.
 *
 * @param messageType - Message type string to check
 * @returns True if server message type, False otherwise
 */
export const isServerMessageType = (messageType: string): boolean => {
  return messageType in SERVER_EVENT_TYPES
}

/**
 * Check if message type is sent by client.
 *
 * @param messageType - Message type string to check
 * @returns True if client message type, False otherwise
 */
export const isClientMessageType = (messageType: string): boolean => {
  return messageType in CLIENT_MESSAGE_TYPES
}

/**
 * Check if message type represents actual content delivery.
 *
 * @param messageType - Message type string to check
 * @returns True if content message, False otherwise
 */
export const isContentMessage = (messageType: string): boolean => {
  return messageType in CONTENT_MESSAGE_TYPES
}

/**
 * Check if message type is a system/meta message.
 *
 * @param messageType - Message type string to check
 * @returns True if system message, False otherwise
 */
export const isSystemMessage = (messageType: string): boolean => {
  return messageType in SYSTEM_MESSAGE_TYPES
}

