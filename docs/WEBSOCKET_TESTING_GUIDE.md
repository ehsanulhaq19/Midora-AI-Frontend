# WebSocket Integration Testing Guide

## Overview

This guide provides instructions for testing the WebSocket integration in the Midora AI frontend application. The WebSocket system enables real-time message delivery to users via the `/ws/user/<encoded_user_uuid>` endpoint.

## Frontend Hook: useWebSocketConversation

The `useWebSocketConversation` hook located in `src/hooks/use-websocket-conversation.ts` manages all WebSocket functionality.

### Features

- Automatic connection on app load when user is authenticated
- Automatic reconnection with exponential backoff (max 5 attempts)
- Periodic ping/pong keep-alive messages (every 30 seconds)
- Real-time message updates dispatched to Redux store
- Proper cleanup on component unmount

## Testing Setup

### Prerequisites

- Backend running on `http://localhost:8000` (or configured URL)
- Authenticated user with valid JWT token
- User encoded UUID available in local storage

### Environment Configuration

Ensure these environment variables are set in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Manual Testing Steps

### 1. Test Basic Connection

**Steps:**
1. Log in to the application
2. Open browser DevTools (F12)
3. Go to Network tab
4. Filter by "WS" (WebSocket)
5. Observe WebSocket connection to `/ws/user/<encoded_user_uuid>`

**Expected Result:**
- WebSocket connection status is "101 Switching Protocols"
- Connection URL includes valid JWT token
- Connection remains open

### 2. Test Message Reception

**Steps:**
1. Connect to WebSocket (see step 1)
2. In another terminal, send a message via API:
   ```bash
   curl -X POST http://localhost:8000/api/v1/generate-stream \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"query": "Hello AI"}'
   ```
3. Observe WebSocket message in DevTools

**Expected Result:**
- WebSocket receives `message_generate` event
- Message appears in conversation UI
- Redux store is updated with new message

### 3. Test Reconnection

**Steps:**
1. Connect to WebSocket
2. Manually throttle network (DevTools > Network tab > Slow 3G)
3. Disconnect network in DevTools
4. Wait for automatic reconnection attempts
5. Restore network connection

**Expected Result:**
- WebSocket disconnects gracefully
- Automatic reconnection attempts begin
- Connection re-establishes when network is available
- Messages sent during disconnect are queued and delivered

### 4. Test Ping/Pong Keep-Alive

**Steps:**
1. Connect to WebSocket
2. Observe console for ping messages (every 30 seconds)
3. In DevTools Network tab, filter WebSocket messages
4. Look for ping/pong frames

**Expected Result:**
- Ping frames appear every 30 seconds
- Pong responses received from server
- Connection remains healthy

### 5. Test Multiple Connections

**Steps:**
1. Open application in two browser tabs
2. Log in same user in both tabs
3. Send message from one tab
4. Observe message appears in both tabs

**Expected Result:**
- Both tabs receive the message
- No duplicate messages
- Both WebSocket connections active

## Automated Testing

### Unit Tests

Located in `tests/unit/` (to be created):

```typescript
// Example test structure
describe('useWebSocketConversation', () => {
  it('should connect to WebSocket when user is authenticated', () => {
    // Test implementation
  })

  it('should reconnect on disconnect', () => {
    // Test implementation
  })

  it('should dispatch message to Redux on receive', () => {
    // Test implementation
  })
})
```

### Integration Tests

Located in `tests/integration/` (to be created):

```typescript
describe('WebSocket Message Delivery', () => {
  it('should receive message from backend', async () => {
    // Connect to WebSocket
    // Send message via API
    // Assert message received in Redux
  })

  it('should handle concurrent messages', async () => {
    // Send multiple messages
    // Assert all received correctly
    // Assert no duplicates
  })
})
```

## Browser DevTools Debugging

### 1. WebSocket Tab

1. Open DevTools
2. Go to Network tab
3. Filter by "WS"
4. Click on WebSocket connection
5. Go to "Messages" tab

**View sent/received frames:**
- Green frames = messages sent to server
- White frames = messages received from server

### 2. Console Logging

The hook includes console logs for debugging:

```javascript
// Connection logs
console.log('Connecting to WebSocket:', wsUrl)
console.log('WebSocket connected successfully')

// Message logs
console.log('Received WebSocket message:', data.type)
console.log('Adding message to current conversation:', data.message.uuid)

// Error logs
console.error('WebSocket error:', event)
console.error('Error parsing WebSocket message:', error)
```

Filter console by "WebSocket" to see all related logs.

### 3. Redux DevTools

1. Install Redux DevTools browser extension
2. Open DevTools
3. Go to Redux tab
4. Filter actions by "addMessage"
5. Observe message structure and timing

## Testing Checklist

- [ ] Connection establishes on app load
- [ ] Authentication token is sent in URL
- [ ] Messages received for current conversation
- [ ] Messages marked as unread for other conversations
- [ ] Ping/pong working every 30 seconds
- [ ] Reconnection works after disconnect
- [ ] Max reconnection attempts enforced
- [ ] Error toasts shown on connection failure
- [ ] Cleanup on component unmount
- [ ] Multiple connections per user work
- [ ] No duplicate messages received
- [ ] Large messages handled correctly
- [ ] Network throttling doesn't break connection
- [ ] Multiple tabs receive same message

## Common Issues and Solutions

### Issue: WebSocket connection not establishing

**Symptoms:**
- WebSocket connection attempt fails
- Network shows 400/401 error

**Solutions:**
1. Verify JWT token is valid
2. Check user UUID is encoded correctly
3. Ensure backend WebSocket endpoint is running
4. Check CORS/proxy settings

### Issue: Messages not appearing in UI

**Symptoms:**
- WebSocket receives message
- Redux store not updated
- UI doesn't refresh

**Solutions:**
1. Check Redux action is dispatched correctly
2. Verify conversation UUID matches
3. Check message structure matches expected format
4. Ensure Redux slice is properly configured

### Issue: Connection drops frequently

**Symptoms:**
- WebSocket disconnects every few minutes
- Frequent reconnection attempts

**Solutions:**
1. Check browser network tab for errors
2. Verify ping/pong is working
3. Check backend error logs
4. Test on different network conditions

### Issue: Memory leak on reconnection

**Symptoms:**
- Memory usage increases over time
- Performance degrades

**Solutions:**
1. Verify cleanup is called on unmount
2. Check for unreleased event listeners
3. Monitor WebSocket ref for leaks
4. Use React DevTools Profiler

## Performance Testing

### Load Testing

Test with multiple concurrent connections:

```bash
# Using Artillery for load testing
artillery quick --count 100 --num 10 ws://localhost:3000/ws/user/<uuid>
```

### Message Throughput

Test delivery rate:

```javascript
// Send 100 messages and measure delivery time
const startTime = performance.now()
await sendMessages(100)
const deliveryTime = performance.now() - startTime
console.log(`Delivered 100 messages in ${deliveryTime}ms`)
```

### Memory Profiling

1. Open DevTools > Memory tab
2. Take heap snapshot before connecting
3. Connect and exchange messages
4. Take another heap snapshot after 1000 messages
5. Compare snapshots for leaks

## Monitoring

### Key Metrics

- **Connection Success Rate**: % of successful WebSocket connections
- **Message Delivery Latency**: Time from message creation to UI update
- **Reconnection Time**: Average time to reconnect after disconnect
- **Error Rate**: % of failed message deliveries

### Logging

Enable detailed logging in production:

```typescript
// In useWebSocketConversation
const DEBUG = true

const log = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[WebSocket] ${message}`, data)
  }
  // Send to analytics service
  analytics.track('websocket_event', { message, data })
}
```

## Troubleshooting with Backend Logs

Check backend logs for WebSocket events:

```bash
# Watch backend logs
tail -f logs/midora-backend.log | grep -i websocket

# Expected log messages
# "User 123 connected to WebSocket channel"
# "User 123: Sent 5/5 events"
# "User 123 is not connected to WebSocket"
```

## API Response Format Testing

### Expected Message Format

```json
{
  "type": "message_generate",
  "message": {
    "uuid": "encoded-message-uuid",
    "content": "AI generated content",
    "created_at": "2024-01-28T10:00:00Z",
    "sender_id": 2,
    "model_name": "GPT-4"
  },
  "response_message": {
    "conversation_uuid": "encoded-conversation-uuid",
    "conversation_original_uuid": "original-uuid"
  }
}
```

### Test with curl and wscat

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c "ws://localhost:3000/ws/user/encoded-uuid?token=jwt-token"

# Send test ping
{"type": "ping", "timestamp": "2024-01-28T10:00:00Z"}

# Expected response
{"type": "pong", "timestamp": "2024-01-28T10:00:00Z"}
```

## CI/CD Testing

### Automated Tests in Pipeline

```yaml
# Example GitHub Actions workflow
- name: Run WebSocket Tests
  run: npm run test:websocket

- name: Test Backend WebSocket Endpoint
  run: npm run test:backend:websocket

- name: Integration Tests
  run: npm run test:integration
```

## Documentation References

- [WebSocket Message Delivery System](../../midora.ai-backend/docs/WEBSOCKET_MESSAGE_DELIVERY_SYSTEM.md)
- [Frontend Coding Guidelines](./FRONTEND_CODING_GUIDELINES1.txt)
- [useWebSocketConversation Hook](./src/hooks/use-websocket-conversation.ts)

## Support

For issues or questions:

1. Check logs in browser console
2. Check backend logs
3. Review this troubleshooting guide
4. Create issue with logs and reproduction steps

## Version History

- **v1.0** (2024-01-28): Initial testing guide for WebSocket implementation

