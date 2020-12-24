import { Context, SQSEvent, SQSHandler } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import { downloadOriginalFiles } from "./fileOperator/downloadOriginalFiles";
import { tmpConvertedMoviePath } from "./path/tmpConvertedMoviePath";
import { findM3U8FileNameFromKeys } from "./util/findM3U8FileNameFromKeys";
import { tmpDirectory } from "./path/tmpDirectory";
import { convertM3U8File } from "./fileOperator/convertM3U8File";
import { uploadFile } from "./fileOperator/uploadFile";
import { listOriginalS3Keys } from "./fileOperator/listOriginalS3Keys";
import { deleteLocalDirectory } from "./fileOperator/deleteLocalDirectory";

process.env.PATH += ":/var/task/bin";

interface HlsConverterMessageBody {
  bucket: string;
  path: string;
  uploadConvertedPath: string;
}

const s3 = new S3({
  apiVersion: "2006-03-01",
});

export const handler: SQSHandler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  console.log(event, context);

  const promises = event.Records.map(async (record) => {
    const { body: rawBody, messageId } = record;
    console.log(`MessageBody: ${rawBody}`);

    const body: HlsConverterMessageBody = JSON.parse(rawBody);
    const { bucket, path, uploadConvertedPath } = body;

    const localTmpDirecotry = tmpDirectory(messageId);
    const localConvertedMoviePath = tmpConvertedMoviePath(messageId);

    try {
      const s3Keys = await listOriginalS3Keys(s3, bucket, path);

      if (s3Keys.length === 0) {
        console.error(`Not found S3 keys. Path: ${path}`);
        return;
      }

      const m3u8FileName = findM3U8FileNameFromKeys(s3Keys);
      if (!m3u8FileName) {
        console.error(`Not found m3u8 file. Path: ${path}`);
        return;
      }

      await downloadOriginalFiles(s3, bucket, s3Keys, localTmpDirecotry);
      await convertM3U8File(
        `${localTmpDirecotry}/${m3u8FileName}`,
        localConvertedMoviePath
      );
      await uploadFile(bucket, localConvertedMoviePath, uploadConvertedPath);

      await deleteLocalDirectory(localTmpDirecotry);
    } catch (e) {
      console.error(e);
    }
  });

  await Promise.all(promises);
};
