import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app, server } from '../index.js';

describe('Server API', () => {
  afterAll(() => {
    server.close();
  });

  it('should return 401 if unauthorized', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ contents: [] });
    expect(res.status).toBe(401);
  });

  it('should return 404 for unknown api routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
