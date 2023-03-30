/**
 * image-recognize service
 */
import { createWorker } from "tesseract.js";
import path from "path";

export default () => ({
  imageRecognize: async (id) => {
    try {
      // fetching data
      const entry = await strapi.entityService.findOne(
        "api::reimburse.reimburse",
        id,
        {
          populate: "*",
        }
      );

      const worker = createWorker({});

      await worker.load();
      await worker.loadLanguage("ind");
      await worker.initialize("ind");
      const {
        data: { text },
      } = await worker.recognize(
        path.join(
          __dirname,
          `../../../../../public/${entry.attachment[0]?.url}`
        )
      );
      await worker.terminate();

      const findTotalPrice = (text) => {
        const result = {
          isFoundTotalPrice: false,
          totalPrice: 0,
        };
        const tempArray = text.split("\n");
        let matchPrice = "";

        tempArray.map((res) => {
          if (res.toLowerCase().includes("total" || "total harga")) {
            matchPrice = res;
          }
        });

        if (matchPrice) {
          const totalValue = matchPrice
            .toLowerCase()
            .replace(/([,.])\s/g, "")
            .split("total")[1];

          result.isFoundTotalPrice = true;
          result.totalPrice = Number(totalValue?.replace(/[^0-9\.]+/g, ""));
        } else {
          result.isFoundTotalPrice = false;
          result.totalPrice = 0;
        }

        return result;
      };

      return findTotalPrice(text);
    } catch (err) {
      console.log(err, "error");
      return err;
    }
  },
});
