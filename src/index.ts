import * as dotenv from "dotenv";
dotenv.config();
import { Bot } from "grammy";
import linkHandler from "./handlers/linkHandler";
import mongoose from "mongoose";

const { BOT_TOKEN, DB_USERNAME, DB_PASSWORD, DB_LINK, DB_COLLECTION } =
  process.env;
const bot = new Bot(BOT_TOKEN!);

mongoose
  .connect(
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_LINK}/${DB_COLLECTION}?authSource=admin&w=1`
  )
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((error) => {
    console.log("DB NOT CONNECTED");
    console.log(error);
  });

bot.command("start", (ctx) => {
  ctx.reply(
    "Привет. Присылай ссылку на YouTube-видео, а я тебе сброшу аудиофайл, который ты сможешь слушать фоном."
  );
});

bot.on("::url", linkHandler);

bot.on("message", (ctx) => {
  ctx.reply(
    "От тебя требуется ссылка на YouTube-видео. Больше я ничего не умею :("
  );
});

bot.start();
