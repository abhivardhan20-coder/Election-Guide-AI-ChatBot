import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app, server } from '../index.js';

describe('Server API End-to-End', () => {
  afterAll(() => {
    server.close();
  });

  it('rejects requests with no Authorization header', async () => {
    const res = await request(app).post('/api/chat').send({ contents: [] });
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Missing token");
  });

  it('rejects malformed contents schema', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', 'Bearer GUEST_TOKEN')
      .send({ contents: "not an array" });
    expect(res.status).toBe(400); // Zod validation fails
  });

  it('enforces stricter guest rate limiting', async () => {
    // The test environment might not reset rate limits between tests, 
    // but we can verify the limit header.
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', 'Bearer GUEST_TOKEN')
      .send({ contents: [{ role: 'user', parts: [{ text: 'Hi' }] }] });
    
    // Check for ratelimit-limit (standard headers set to true in index.js)
    expect(res.headers).toHaveProperty('ratelimit-limit');
    // For guests, the limit is 10
    expect(res.headers['ratelimit-limit']).toBe('10');
  });

  it('rejects oversized history depth', async () => {
    const oversizedHistory = Array(60).fill({ role: 'user', parts: [{ text: 'test' }] });
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', 'Bearer GUEST_TOKEN')
      .send({ contents: oversizedHistory });
    expect(res.status).toBe(400); // Zod max(50)
  });
});
