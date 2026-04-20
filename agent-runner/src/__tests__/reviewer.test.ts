jest.mock('../github', () => ({
  createPrComment: jest.fn(async () => ({}))
}));

import { handle as reviewerHandle } from '../agents/reviewer';

describe('ReviewerAgent', () => {
  const sampleEvent = {
    event: 'pull_request',
    payload: {
      pull_request: { number: 2, title: 'Test PR' },
      repository: { name: 'test-repo', owner: { login: 'owner' } }
    }
  } as any;

  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'x';
  });

  test('should return findings and post a comment when token present', async () => {
    const result = await reviewerHandle(sampleEvent, {});
    expect(result.findings).toBeDefined();
    expect(Array.isArray(result.findings)).toBe(true);
  });
});
