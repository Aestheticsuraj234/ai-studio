/**
 * video controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::video.video', ({ strapi }) => ({
  async create(ctx) {
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized('You must be signed in to create videos.');
    }

    const data = ctx.request.body?.data ?? {};

    const entity = await strapi.db.query('api::video.video').create({
      data: {
        prompt: data.prompt,
        videoUrl: data.videoUrl,
        users_permissions_user: userId,
      },
    });

    const sanitized = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitized);
  },

  async find(ctx) {
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized('You must be signed in to view videos.');
    }

    const entities = await strapi.db.query('api::video.video').findMany({
      where: {
        users_permissions_user: {
          id: userId,
        },
      },
      orderBy: { createdAt: 'desc' },
      limit: 24,
    });

    const sanitized = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitized);
  },
}));
