/**
 * approval controller
 */

import { factories } from "@strapi/strapi";
import firebaseAdmin from "../../../services/firebase";

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
      const id = ctx?.params.id;

      const reimburseUser = await strapi.db
        .query("api::approval.approval")
        .findOne({
          populate: ["reimburses", "*"],
          where: {
            id: id,
          },
        });

      const idReimburse = reimburseUser.reimburses[0].id;

      const reimburseUserDetail = await strapi.db
        .query("api::reimburse.reimburse")
        .findOne({
          populate: ["user"],
          where: {
            id: idReimburse,
          },
        });

      const tokenNotif = reimburseUserDetail.user?.tokenNotification;
      const body = ctx.request.body;

      if (tokenNotif) {
        firebaseAdmin.messaging().sendToDevice(
          tokenNotif,
          {
            data: {
              title: `${
                body?.data?.status === "APPROVE"
                  ? "✅ Reimbursement disetujui"
                  : "❌ Reimbursement ditolak"
              }`,
              message: `${
                body?.data?.status === "APPROVE"
                  ? "Selamat, pengajuan reimburse kamu sudah disetujui"
                  : "Maaf, pengajuan reimburse kamu ditolak"
              }`,
            },
          },
          {
            priority: "high",
            timeToLive: 60 * 60 * 24,
          }
        );
      }

      const response = await super.update(ctx);
      return response;
    },
  })
);
