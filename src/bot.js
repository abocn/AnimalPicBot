require("@dotenvx/dotenvx").config({ path: ".env" });
const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const axios = require("axios");

// Ensures bot token is set, and not default value
if (!process.env.botToken || process.env.botToken === "InsertYourBotTokenHere") {
  console.error("Bot token is not set. Please set the bot token in the .env file.")
  process.exit(1)
}

const bot = new Telegraf(process.env.botToken);
const maxRetries = process.env.maxRetries || 5;
let restartCount = 0;

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatDate() {
  const now = new Date();
  const day = now.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

async function sendAnimal() {
  let apiUrl;
  let imageUrl;

  switch (process.env.animalType) {
    case "cat":
      apiUrl = process.env.catApi;
      break;
    case "dog":
      apiUrl = process.env.dogApi;
      break;
    case "duck":
      apiUrl = process.env.duckApi;
      break;
    case "fox":
      apiUrl = process.env.foxApi;
      break;
    default:
      console.error(`Invalid animal type specified. Please set "animalType" to "cat", "duck", "fox" or "dog" in the .env file.`);
      return;
  };

  const response = await axios.get(apiUrl);
  const channelId = process.env.channelId;
  const ownerId = process.env.ownerId;
  const caption = formatDate();
  const data = response.data;

  switch (process.env.animalType) {
    case "cat":
      imageUrl = data.url;
      break;
    case "dog":
      imageUrl = data.message;
      break;
    case "duck":
      imageUrl = data.url;
      break;
    case "fox":
      imageUrl = data.image;
      break;
    default:
      console.error(`Invalid animal type specified. Please set "animalType" to "cat", "duck", "fox" or "dog" in the .env file.`);
      return;
  };

  imageUrl = imageUrl.replace(/\\\//g, "/");

  bot.telegram.getChat(channelId).then(async (chat) => {
    await bot.telegram.sendPhoto(channelId, imageUrl, {
      caption: caption,
      parse_mode: "Markdown"
    }).then(() => {
      bot.telegram.sendMessage(ownerId, `Photo sent to ${chat.title} (${chat.username}, ${channelId}) successfully.`);
    }).catch((error) => {
      bot.telegram.sendMessage(ownerId, `Failed to send photo to ${chat.title} (${chat.username}, ${channelId}): ${error.message}`);
    });
  });
};

const cronSch = process.env.cronSchedule || "0 0 * * *";
cron.schedule(cronSch, sendAnimal);

const startBot = async () => {
  const botInfo = await bot.telegram.getMe();
  const restartWait = process.env.restartWait || 5000;
  console.log(`${botInfo.first_name} is running...`);
  try {
    await bot.launch();
    restartCount = 0;
  } catch (error) {
    console.error("Failed to start bot:", error.message);
    if (restartCount < Number(maxRetries)) {
      console.log(`Waiting ${restartWait}ms before retrying...`);
      await new Promise(r => setTimeout(r, restartWait));
      restartCount++;
      console.log(`Retrying to start bot... Attempt ${restartCount}`);
      setTimeout(startBot, 5000);
    } else {
      console.error("Maximum retry attempts reached. Exiting.");
      process.exit(1);
    }
  }
};

const handleShutdown = (signal) => {
  console.log(`Received ${signal}. Stopping bot...`);
  bot.stop(signal);
  process.exit(0);
};

process.once("SIGINT", () => handleShutdown("SIGINT"));
process.once("SIGTERM", () => handleShutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
  console.error(error.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

startBot()