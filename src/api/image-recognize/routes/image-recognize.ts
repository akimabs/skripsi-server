export default {
  routes: [
    {
      method: "GET",
      path: "/image-recognize/:id",
      handler: "image-recognize.imageRecognize",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
