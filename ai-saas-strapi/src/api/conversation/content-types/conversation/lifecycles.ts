/**
 * conversation lifecycle hooks
 *
 * Automatically attaches the authenticated user to a new conversation as its
 * owner. This runs at the database layer, so it works around Strapi's default
 * input validation that rejects writes to `plugin::users-permissions.user`
 * relations from the public Content API.
 */
export default {
  async beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const ctx = strapi.requestContext.get();
    const userId = ctx?.state?.user?.id;

    if (userId && !event.params.data.users_permissions_user) {
      event.params.data.users_permissions_user = userId;
    }
  },
};
