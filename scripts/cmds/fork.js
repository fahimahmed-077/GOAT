const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 AUTHOR LOCK
const LOCKED_AUTHOR = "FARHAN-KHAN";

module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "link"],
    version: "1.3",
    author: LOCKED_AUTHOR,
    countDown: 3,
    role: 0,
    longDescription: "Send fork with styled image",
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    try {

      // 🔒 author protection
      if (module.exports.config.author !== LOCKED_AUTHOR) {
        return message.reply("❌ AUTHOR LOCKED! You cannot modify this file.");
      }

      const text =
`╔━❖🌸 𝗢𝗪𝗡𝗘𝗥 𝗙𝗢𝗥𝗞 🌸❖━╗

😎 এই নাও বস ফারহান এর অফিসিয়াল
💻 𝗚𝗢𝗔𝗧 𝗙𝗢𝗥𝗞 & 𝗚𝗶𝘁𝗛𝘂𝗯 𝗟𝗜𝗡𝗞 🔥

┏━〔 ♻️ 𝗚𝗢𝗔𝗧 𝗙𝗢𝗥𝗞 ♻️ 〕━┓
┃ 🚀 𝗙𝗮𝘀𝘁 & 𝗦𝗺𝗼𝗼𝘁𝗵
┃ ⚡ 𝗦𝘁𝘆𝗹𝗶𝘀𝗵 𝗦𝘆𝘀𝘁𝗲𝗺
┃ 💎 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗘𝗱𝗶𝘁
┗━━━━━━━━━━━━━━━━━━┛

🔗 https://github.com/FARHAN-MIRAI-BOT/GOAT

✦━━━━━━━━━━━━━━━━━━━✦

🎬 𝗡𝗘𝗪 𝗧𝗨𝗧𝗢𝗥𝗜𝗔𝗟 𝗩𝗜𝗗𝗘𝗢 🎬

 🥰 এই ভিডিওটা সবাইকে শেখানোর জন্য করা হয়েছে
 💖 আশা করি সবাই ভিডিওটা শেষ পর্যন্ত দেখবা
 📖 সহজভাবে সব কিছু বুঝানো হয়েছে
 🤝 পাশে থাকলে আরো সুন্দর ভিডিও আসবে ইনশাআল্লাহ
╰━━━━━━━━━━━━━━━━━━━╯

📢 ভিডিওটা দেখে যদি একটু উপকার হয় 😇
তাহলে একটা সুন্দর কমেন্ট করে পাশে থাকবা ❤️

🌐 𝗩𝗜𝗗𝗘𝗢 𝗟𝗜𝗡𝗞 👇
🔗 https://youtube.com/watch?v=vKzIu2iyg8I&feature=shared

✦━━━━━━━━━━━━━━━━━━━✦

🔔 𝗟𝗶𝗸𝗲 • 𝗖𝗼𝗺𝗺𝗲𝗻𝘁 • 𝗦𝘂𝗯𝘀𝗰𝗿𝗶𝗯𝗲 💖

╚══❖ 🌺 𝗧𝗛𝗔𝗡𝗞 𝗬𝗢𝗨 🌺 ❖══╝`;

      const imgUrl = "https://files.catbox.moe/0usiw5.jpg";

      const cacheDir = path.join(__dirname, "cache");
      const filePath = path.join(cacheDir, "fork.jpg");

      // 📁 cache folder ensure
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // 🌐 download image
      const response = await axios.get(imgUrl, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, Buffer.from(response.data));

      // 📤 send message
      await message.reply({
        body: text,
        attachment: fs.createReadStream(filePath)
      });

      // 🧹 cleanup
      fs.unlinkSync(filePath);

    } catch (err) {
      console.error("Fork command error:", err);
      message.reply("❌ Failed to send fork message!");
    }
  }
};
