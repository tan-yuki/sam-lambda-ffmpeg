import { S3 } from "aws-sdk";
import { basename } from "./basename";

const matchPattern = /\.m3u8/;

/**
 * S3のキーからm3u8のファイルのキーを取得し、そのファイル名のみ返す。
 * @param s3Keys
 */
export function findM3U8FileNameFromKeys(
  s3Keys: S3.ObjectKey[]
): string | undefined {
  const m3u8 = s3Keys.find((key) => key.match(matchPattern));

  return m3u8 ? basename(m3u8) : undefined;
}
