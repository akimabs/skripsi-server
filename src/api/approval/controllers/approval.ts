/**
 * approval controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::approval.approval",
  ({ strapi }) => ({
    async find(ctx) {
      const user = ctx.state.user;
      const { status, type } = ctx.request.query;

      const typeFilter = type && {
        reimburses: {
          type: {
            $eq: type,
          },
        },
      };

      const filter = {
        status: {
          $eq: status,
        },
        approver: {
          id: {
            $eq: user.id,
          },
        },
      };

      const data = await strapi.db.query("api::approval.approval").findMany({
        populate: ["reimburses", "*"],
        where: {
          ...filter,
          ...typeFilter,
        },
      });

      return { data };
    },

    async update(ctx) {
      const response = await super.update(ctx);
      return response;
    },
  })
);
