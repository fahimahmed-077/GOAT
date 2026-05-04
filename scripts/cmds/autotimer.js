const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

module.exports.config = {
  name: "autotimer",
  version: "8.2",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "⏰ Auto Timer (Updated Captions + No Spam)",
  category: "AutoTime",
  countDown: 3,
};

if (!global.__autoTimerStarted) global.__autoTimerStarted = false;
if (!global.__sentMap) global.__sentMap = {};

module.exports.onLoad = async function ({ api }) {

  if (global.__autoTimerStarted) return;
  global.__autoTimerStarted = true;

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // 🔥 UPDATED CAPTIONS (YOUR NEW STYLE)
  const timerData = {
    "12:00 AM": { text: "⌚┆এখন রাত ১২টা বাজে❥︎ দিন শেষ, এখন ঘুমাও 😴🌙", video: "https://files.catbox.moe/y9irm8.mp4" },
    "01:00 AM": { text: "⌚┆রাত ১টা বাজে❥︎ ঘুম না দিলে সকালে কষ্ট 😪", video: "https://files.catbox.moe/gitfya.mp4" },
    "02:00 AM": { text: "⌚┆রাত ২টা বাজে❥︎ এখনো জেগে? ঘুমাও বেক্কল 😾", video: "https://files.catbox.moe/9aavty.mp4" },
    "03:00 AM": { text: "⌚┆রাত ৩টা বাজে❥︎ নিরব শহর, শুধু তুমি জেগে 🫠", video: "https://files.catbox.moe/p78siw.mp4" },
    "04:00 AM": { text: "⌚┆রাত ৪টা বাজে❥︎ ফজরের সময় ঘনিয়ে আসছে 🌄", video: "https://files.catbox.moe/9uvit1.mp4" },
    "05:00 AM": { text: "⌚┆সকাল ৫টা বাজে❥︎ নামাজ পড়ে দিন শুরু করো 🤲", video: "https://files.catbox.moe/34etgc.mp4" },
    "06:00 AM": { text: "⌚┆সকাল ৬টা বাজে❥︎ ঘুম ভাঙানোর সময় 🌞", video: "https://files.catbox.moe/stk4lq.mp4" },
    "07:00 AM": { text: "⌚┆সকাল ৭টা বাজে❥︎ নতুন দিনের শুরু 🍞☕", video: "https://files.catbox.moe/ladp3x.mp4" },
    "08:00 AM": { text: "⌚┆সকাল ৮টা বাজে❥︎ কাজ শুরু করো মন দিয়ে 💼", video: "https://files.catbox.moe/l8vx40.mp4" },
    "09:00 AM": { text: "⌚┆সকাল ৯টা বাজে❥︎ ফোকাস করো নিজের লক্ষ্যে 🧠", video: "https://files.catbox.moe/hgo8gp.mp4" },
    "10:00 AM": { text: "⌚┆সকাল ১০টা বাজে❥︎ এগিয়ে যাও 💪🔥", video: "https://files.catbox.moe/ejx7a6.mp4" },
    "11:00 AM": { text: "⌚┆সকাল ১১টা বাজে❥︎ একটু বাকি, চালিয়ে যাও 😌", video: "https://files.catbox.moe/gogfic.mp4" },
    "12:00 PM": { text: "⌚┆দুপুর ১২টা বাজে❥︎ খাওয়ার সময় 🍛❤️", video: "https://files.catbox.moe/ilmb5j.mp4" },
    "01:00 PM": { text: "⌚┆দুপুর ১টা বাজে❥︎ নামাজ ভুল না 🤲", video: "https://files.catbox.moe/bq7ngm.mp4" },
    "02:00 PM": { text: "⌚┆দুপুর ২টা বাজে❥︎ খাওয়া শেষ? 😋", video: "https://files.catbox.moe/27mwt2.mp4" },
    "03:00 PM": { text: "⌚┆বিকাল ৩টা বাজে❥︎ কাজ চালিয়ে যাও 🧑‍🔧", video: "https://files.catbox.moe/eyqcud.mp4" },
    "04:00 PM": { text: "⌚┆বিকাল ৪টা বাজে❥︎ আসরের নামাজ পড়ো 🌿", video: "https://files.catbox.moe/vlgjrp.mp4" },
    "05:00 PM": { text: "⌚┆বিকাল ৫টা বাজে❥︎ একটু বিশ্রাম নাও 🙂", video: "https://files.catbox.moe/bjjtmk.mp4" },
    "06:00 PM": { text: "⌚┆সন্ধ্যা ৬টা বাজে❥︎ পরিবারকে সময় দাও ❤️", video: "https://files.catbox.moe/22enjn.mp4" },
    "07:00 PM": { text: "⌚┆সন্ধ্যা ৭টা বাজে❥︎ এশার নামাজ 🤲🌙", video: "https://files.catbox.moe/j7fh66.mp4" },
    "08:00 PM": { text: "⌚┆রাত ৮টা বাজে❥︎ দিনের কাজ শেষ 🧖", video: "https://files.catbox.moe/btrwyg.mp4" },
    "09:00 PM": { text: "⌚┆রাত ৯টা বাজে❥︎ ঘুমের প্রস্তুতি 😴", video: "https://files.catbox.moe/qb2mq3.mp4" },
    "10:00 PM": { text: "⌚┆রাত ১০টা বাজে❥︎ ঘুমাতে যাও 🌙", video: "https://files.catbox.moe/l15d8y.mp4" },
    "11:00 PM": { text: "⌚┆রাত ১১টা বাজে❥︎ ভালোবাসা রইলো 🥰", video: "https://files.catbox.moe/rnsdlb.mp4" }
  };

  const getKey = (time, threadID) => {
    const date = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
    return `${date}_${time}_${threadID}`;
  };

  const run = async () => {

    const now = moment().tz("Asia/Dhaka").format("hh:mm A");
    const data = timerData[now];
    if (!data) return;

    const date = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");

    let buffer;
    try {
      const res = await axios.get(data.video, { responseType: "arraybuffer" });
      buffer = Buffer.from(res.data);
    } catch {
      return console.error("❌ Video error");
    }

    const filePath = path.join(cacheDir, `${now.replace(/[: ]/g, "_")}.mp4`);
    fs.writeFileSync(filePath, buffer);

    const msg =
`╔═══ ⏰ AUTO TIMER ═══╗
🕒 TIME: ${now}
${data.text}
📅 DATE: ${date}
╚══════════════════╝`;

    try {
      const threads = await api.getThreadList(1000, null, ["INBOX"]);
      const groups = threads.filter(t => t.isGroup);

      for (const t of groups) {

        const key = getKey(now, t.threadID);
        if (global.__sentMap[key]) continue;

        global.__sentMap[key] = true;

        api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(filePath)
        }, t.threadID);
      }

      console.log("✅ SENT:", now);

    } catch (e) {
      console.error(e);
    }
  };

  setInterval(run, 60000);
};

module.exports.onStart = () => {};
