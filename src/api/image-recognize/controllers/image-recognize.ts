/**
 * A set of functions called "actions" for `image-recognize`
 */

export default {
  imageRecognize: async (ctx, next) => {
    const { id } = ctx.params;
    try {
      const data = await strapi
        .service("api::image-recognize.image-recognize")
        .imageRecognize(id);

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Image Recognize Error");
    }
  },
};
