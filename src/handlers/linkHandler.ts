import { Context, InputFile } from "grammy";
import ytdl from "ytdl-core";
import { existsSync, mkdirSync, createWriteStream, rmSync } from "fs";
import { join } from "path";
import User from "../models/User";

const linkHandler = async (ctx: Context) => {
  const urlEntity = ctx.message?.entities?.find(
    (entity) => entity.type === "url"
  );
  if (!urlEntity) {
    return ctx.reply(
      "К сожалению, мне не удалось распознать ссылку в твоём сообщении."
    );
  }

  const user = await User.findOne({ username: ctx.from?.username });
  if (!user) {
    return ctx.reply("К сожалению, тебе не доступен данный функционал");
  }

  const { offset, length } = urlEntity;
  const link = ctx.message?.text?.slice(offset, offset + length);

  const isValidUrl = ytdl.validateURL(String(link));
  if (!isValidUrl) {
    ctx.reply("К сожалению, ссылка не корректна. Попробуй ещё раз.");
    return;
  }

  if (!existsSync("data")) mkdirSync("data");

  const basicInfo = await ytdl.getBasicInfo(link!);
  let { title } = basicInfo.videoDetails;
  title = title.replace(/[<>:"|?*\/\\]/g, "_");
  const relativePath = `data/${title}.mp3`;

  const writeStream = createWriteStream(relativePath);

  ytdl(link!, {
    filter: "audioonly",
  }).pipe(writeStream);

  writeStream.on("finish", async () => {
    const filePath = join(process.cwd(), relativePath);
    await ctx.replyWithAudio(new InputFile(filePath));
    rmSync(relativePath);
  });
};

export default linkHandler;
