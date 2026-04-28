/* eslint-disable @typescript-eslint/no-var-requires */
import request from 'supertest';

// Prevent the index.ts auto-start from running the HTTP server during tests
process.env.VERCEL = '1';
const { app } = require('../index');

describe('routes', () => {
  test('GET /api-docs responds 200', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
  });
});
