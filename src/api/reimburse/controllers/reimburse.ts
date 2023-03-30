/**
 * reimburse controller
 */

import { factories } from "@strapi/strapi";
import firebaseAdmin from "../../../services/firebase";

export default factories.createCoreController(
  "api::reimburse.reimburse",
  ({ strapi }) => ({
    async create(ctx) {
      const { data } = ctx?.request?.body;
      const user = ctx.state.user;

      try {
        const result = await super.create(ctx);
        strapi.entityService.update(
          "api::reimburse.reimburse",
          result?.data?.id,
          {
            data: {
              ...JSON.parse(data),
              user: user?.id,
              publishedAt: Date.now(),
            },
          }
        );

        const isAdminApproval = await strapi.db
          .query("plugin::users-permissions.role")
          .findMany({
            populate: ["users"],
            where: {
              type: "admin",
            },
          });

        const dataAdminId = isAdminApproval[0]?.users.map((res) => res.id);

        const randomElement =
          dataAdminId[Math.floor(Math.random() * dataAdminId.length)];

        strapi.db.query("api::approval.approval").create({
          data: {
            reimburses: [result?.data?.id],
            status: "WAITING",
            approver: randomElement,
            publishedAt: Date.now(),
          },
        });

        return result;
      } catch (e) {
        ctx.badRequest("Reimburse Service Error");
      }
    },

    async update(ctx) {
      const { id } = ctx.params;
      const reimburseCheck = await strapi.db
        .query("api::reimburse.reimburse")
        .findOne({
          populate: ["approval"],
          where: {
            id: id,
          },
        });

      const approvalDetail = await strapi.db
        .query("api::approval.approval")
        .findOne({
          populate: ["approver"],
          where: {
            id: reimburseCheck.approval.id,
          },
        });

      const approver = approvalDetail.approver;
      const tokenNotifAdmin = approver?.tokenNotification ?? "";

      if (tokenNotifAdmin) {
        firebaseAdmin.messaging().sendToDevice(
          tokenNotifAdmin,
          {
            data: {
              title: "🔔 1 Notifikasi belum terbaca",
              message: "Hai ada pengajuan reimburse baru",
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

    async findOne(ctx) {
      const { id } = ctx.params;

      const result = await strapi.db.query("api::reimburse.reimburse").findOne({
        populate: ["approval", "user", "attachment"],
        where: {
          id: id,
        },
      });

      return { data: result };
    },

    async find() {
      const result = await strapi.db
        .query("api::reimburse.reimburse")
        .findMany({
          populate: ["approval"],
          orderBy: {
            id: "desc",
          },
        });

      return { data: result };
    },
  })
);
