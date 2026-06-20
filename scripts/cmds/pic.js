const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pic",
    version: "2.0",
    author: "MR_FARHAN", // 🔒 DO NOT CHANGE
    countDown: 5,
    role: 0,
    shortDescription: "Search images",
    longDescription: "Search images from pinterest",
    category: "search",
    guide: "{pn} keyword-amount"
  },

  onStart: async function ({ api, event, args }) {

    // 🔒 AUTHOR LOCK SYSTEM
    if (module.exports.config.author !== "MR_FARHAN") {
      return api.sendMessage(
        "⚠️ File author modified! Command disabled.",
        event.threadID,
        event.messageID
      );
    }

    try {
      const keySearch = args.join(" ");

      if (!keySearch.includes("-")) {
        return api.sendMessage(
          "Example: pic cat-5",
          event.threadID,
          event.messageID
        );
      }

      const keyword = keySearch.substring(0, keySearch.lastIndexOf("-")).trim();
      const amount = parseInt(keySearch.split("-").pop()) || 5;

      // API load
      const apis = await axios.get(
        "https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json"
      );
      const baseApi = apis.data.api;

      const res = await axios.get(
        `${baseApi}/pinterest?search=${encodeURIComponent(keyword)}`
      );

      const data = res.data.data;
      if (!data || data.length === 0) {
        return api.sendMessage("No images found.", event.threadID, event.messageID);
      }

      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

      let imgData = [];
      let count = Math.min(amount, data.length);

      for (let i = 0; i < count; i++) {
        const imgPath = path.join(cachePath, `${i + 1}.jpg`);
        const img = await axios.get(data[i], { responseType: "arraybuffer" });

        fs.writeFileSync(imgPath, Buffer.from(img.data));
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage(
        {
          body: `🔎 ${count} results for: ${keyword}`,
          attachment: imgData
        },
        event.threadID,
        event.messageID
      );

      // cleanup
      for (let i = 0; i < count; i++) {
        const imgPath = path.join(cachePath, `${i + 1}.jpg`);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }

    } catch (err) {
      console.error(err);
      api.sendMessage("Error fetching images.", event.threadID, event.messageID);
    }
  }
};