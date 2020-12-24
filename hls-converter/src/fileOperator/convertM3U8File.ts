import { exec } from "child_process";

export function convertM3U8File(
  localM38uFilePath: string,
  outputFilePath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(
      `ffmpeg -i ${localM38uFilePath} -vcodec copy -acodec copy -absf aac_adtstoasc ${outputFilePath}`,
      (e) => {
        if (e) {
          reject(`Convert error: ${e}`);
          return;
        }

        resolve();
      }
    );
  });
}
