import request from 'supertest';
import { app, server } from './index.js';
import { describe, it, expect, afterAll, vi, beforeEach } from 'vitest';
import admin from 'firebase-admin';

// Mock Firebase Admin
vi.mock('firebase-admin', () => ({
  default: {
    initializeApp: vi.fn(),
    credential: { cert: vi.fn() },
    auth: () => ({
      verifyIdToken: vi.fn().mockResolvedValue({ email: 'user@example.com', uid: 'mock-uid' })
    })
  }
}));

// Mock Gemini AI initialization in the controller if needed, 
// but since we are testing boundaries, we focus on middleware first.

describe('Backend API & Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('should reject requests without authorization headers', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ contents: [{ role: 'user', parts: [{ text: 'Hello' }] }] });
      
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toContain('Unauthorized: Missing token');
  });

  it('should reject invalid payload schemas', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', 'Bearer GUEST_TOKEN')
      .send({ invalid_payload: true });
      
    expect(res.statusCode).toBe(400);
  });

  it('should enforce the guest rate limit after 10 requests', async () => {
    // Note: Rate limiter is shared across test cases if the server isn't restarted,
    // so we simulate the 10 request threshold.
    const requests = Array.from({ length: 11 }, () => 
      request(app)
        .post('/api/chat')
        .set('Authorization', 'Bearer GUEST_TOKEN')
        .send({ contents: [{ role: 'user', parts: [{ text: 'Rate limit test' }] }] })
    );

    const responses = await Promise.all(requests);
    const tooManyRequests = responses.filter(r => r.statusCode === 429);
    
    expect(tooManyRequests.length).toBeGreaterThan(0);
    expect(tooManyRequests[0].body.error).toContain('Guest limit reached');
  }, 20000); // Higher timeout for sequential requests
});
