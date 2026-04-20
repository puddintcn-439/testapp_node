import audit from './audit';
import { enqueueTask } from './queue';

export const Coordinator = {
  async handle(ctx: { event: string; payload: any; manifests: any[]; handlers: any }) {
    console.log('[Coordinator] event', ctx.event);
    const eventType = ctx.event;
    const payload = ctx.payload;

    // write audit entry
    try {
      audit.logEvent({ event: eventType, repo: payload?.repository?.full_name || payload?.repository?.name, action: payload?.action || null });
    } catch (e) {
      console.warn('Audit log failed', e);
    }

    // Helper to enqueue or fallback to direct execution
    const dispatch = async (handlerName: string, ev: string, pl: any) => {
      try {
        await enqueueTask(handlerName, { handler: handlerName, event: ev, payload: pl });
      } catch (err) {
        console.warn('[Coordinator] enqueue failed, falling back to direct handler', err);
        const handler = ctx.handlers[handlerName];
        if (handler && handler.handle) {
          await handler.handle({ event: ev, payload: pl }, ctx.manifests.find((m: any) => m.name === handlerName));
        }
      }
    };

    if (eventType === 'pull_request') {
      const action = payload.action;
      if (['opened', 'synchronize', 'reopened'].includes(action)) {
        await dispatch('ReviewerAgent', eventType, payload);
      }
    } else if (eventType === 'issue_comment') {
      const comment = payload.comment?.body || '';
      const isImplement = comment.trim().startsWith('/implement');
      if (isImplement) {
        await dispatch('DeveloperAgent', eventType, payload);
      } else if (comment.trim().startsWith('/review')) {
        await dispatch('ReviewerAgent', eventType, payload);
      }
    } else {
      console.log('[Coordinator] no handler for event', eventType);
    }
  }
};
