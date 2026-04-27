/**
 * conversation controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::conversation.conversation', ({ strapi }) => ({
  async create(ctx) {
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized('You must be signed in to create conversations.');
    }

    const data = ctx.request.body?.data ?? {};

    const entity = await strapi.db.query('api::conversation.conversation').create({
      data: {
        title: data.title,
        users_permissions_user: userId,
      },
    });

    const sanitized = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitized);
  },

  async find(ctx) {
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized('You must be signed in to view conversations.');
    }

    const entities = await strapi.db.query('api::conversation.conversation').findMany({
      where: {
        users_permissions_user: {
          id: userId,
        },
      },
      orderBy: { updatedAt: 'desc' },
      limit: 50,
    });

    const sanitized = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitized);
  },

  async findOne(ctx) {
    const userId = ctx.state.user?.id;
    const documentId = ctx.params.documentId ?? ctx.params.id;

    if (!userId) {
      return ctx.unauthorized('You must be signed in to view conversations.');
    }

    const entity = await strapi.db.query('api::conversation.conversation').findOne({
      where: {
        documentId,
        users_permissions_user: {
          id: userId,
        },
      },
      populate: {
        messages: true,
      },
    });

    if (!entity) {
      return ctx.notFound('Conversation not found.');
    }

    if (Array.isArray(entity.messages)) {
      entity.messages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    const sanitized = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitized);
  },
}));
