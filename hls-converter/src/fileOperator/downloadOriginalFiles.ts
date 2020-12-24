import { S3 } from "aws-sdk";
import fs from "fs";
import { basename } from "../util/basename";

/**
 * 指定された各S3のオブジェクトを指定したパスへ保存する
 *
 * @param s3 S3インスタンス。
 * @param bucket S3のバケット名。
 * @param s3Keys ダウンロードする各S3オブジェクトのKey。
 * @param localPath ローカルの保存先のパス。
 */
export function downloadOriginalFiles(
  s3: S3,
  bucket: string,
  s3Keys: S3.ObjectKey[],
  localDirectory: string
): Promise<void[]> {
  const promises = s3Keys.map((key) => {
    const tmpFile = fs.createWriteStream(`${localDirectory}/${basename(key)}`);
    const stream = s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .createReadStream()
      .pipe(tmpFile);

    return new Promise<void>((resolve, reject) => {
      stream.on("error", (e) => {
        reject(`Download error: ${e}`);
      });
      stream.on("close", () => {
        resolve();
      });
    });
  });

  return Promise.all(promises);
}
