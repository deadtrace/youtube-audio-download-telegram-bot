import * as dotenv from "dotenv";
dotenv.config();
import { Bot } from "grammy";
import linkHandler from "./handlers/linkHandler";

const { BOT_TOKEN } = process.env;
const bot = new Bot(BOT_TOKEN!);

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
