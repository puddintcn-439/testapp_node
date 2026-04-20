import * as developer from './developer';
import * as reviewer from './reviewer';

export const agentHandlers: Record<string, any> = {
  DeveloperAgent: developer,
  ReviewerAgent: reviewer,
};
