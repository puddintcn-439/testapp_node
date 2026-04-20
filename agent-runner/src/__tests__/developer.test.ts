jest.mock('../github', () => ({
  createBranchFromBase: jest.fn(async () => 'agent/developer/mock'),
  createOrUpdateFileOnBranch: jest.fn(async () => ({})),
  createDraftPR: jest.fn(async () => ({ html_url: 'https://example.com/pr/1' })),
  createPrComment: jest.fn(async () => ({}))
}));

import { handle as developerHandle } from '../agents/developer';

describe('DeveloperAgent', () => {
  const sampleEvent = {
    event: 'issue_comment',
    payload: {
      comment: { body: '/implement add endpoint' },
      repository: { name: 'test-repo', owner: { login: 'owner' }, default_branch: 'main' },
      issue: { number: 1 }
    }
  } as any;

  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'x';
  });

  test('should create a draft PR when GITHUB_TOKEN present', async () => {
    const result = await developerHandle(sampleEvent, {});
    expect(result.pr).toBeDefined();
    expect(result.pr?.html_url).toContain('https://');
  });
});
