import fs, { ReadStream } from "fs";
import { S3 } from "aws-sdk";
import { PassThrough, Stream } from "stream";

function uploadStream(
  bucket: string,
  key: string
): [Promise<S3.ManagedUpload.SendData>, PassThrough] {
  const pass = new Stream.PassThrough();
  const upload = new S3.ManagedUpload({
    params: {
      Bucket: bucket,
      Key: key,
      Body: pass,
    },
  });

  pass.on("error", (e) => {
    console.error(`Upload file error: ${e}`);
  });

  return [upload.promise(), pass];
}

function readLocalFileStream(localPath: string): ReadStream {
  const readStream = fs.createReadStream(localPath);

  readStream.on("error", (e) => {
    console.error(`Load converted file error: ${e}`);
  });

  return readStream;
}

export function uploadFile(
  bucket: string,
  localPath: string,
  s3Key: string
): Promise<S3.ManagedUpload.SendData> {
  const [promise, writeStream] = uploadStream(bucket, s3Key);

  readLocalFileStream(localPath).pipe(writeStream);

  return promise;
}
