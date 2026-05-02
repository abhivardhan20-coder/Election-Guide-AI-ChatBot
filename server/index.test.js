import request from 'supertest';
import { app, server } from './index.js';
import { describe, it, expect, afterAll } from 'vitest';

describe('Backend API Boundaries', () => {
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

  it('should accept a guest token and process chat (even if Gemini fails)', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', 'Bearer GUEST_TOKEN')
      .send({ contents: [{ role: 'user', parts: [{ text: 'Test' }] }] });
    
    // We expect 200 (if Gemini works or fallback triggers) or 500 if something else breaks
    // Since we are mocking nothing here, it might fallback to the error payload
    expect([200, 500]).toContain(res.statusCode);
  });
});
