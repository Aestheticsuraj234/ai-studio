/**
 * video lifecycle hooks — attach owner without sending user id from the client.
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
