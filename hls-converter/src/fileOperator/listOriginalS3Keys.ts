import { S3 } from "aws-sdk";

function getS3ObjectKeys(list: S3.ObjectList): S3.ObjectKey[] {
  return list.reduce((acc, current: S3.Object | undefined) => {
    if (!current || !current.Key) {
      return acc;
    }
    return { ...acc, current };
  }, [] as S3.ObjectKey[]);
}

export async function listOriginalS3Keys(
  s3: S3,
  bucket: string,
  path: string
): Promise<S3.ObjectKey[]> {
  const request = s3.listObjectsV2({
    Bucket: bucket,
    Prefix: path,
    Delimiter: "/",
  });

  const listObjectOutput = await request.promise();

  if (!listObjectOutput.Contents) {
    console.error(
      `Empty Bucket. Bucket: ${bucket}, listObjectOutput: ${listObjectOutput}`
    );
    return [];
  }

  return getS3ObjectKeys(listObjectOutput.Contents);
}
