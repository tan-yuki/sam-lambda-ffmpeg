import { tmpDirectory } from "./tmpDirectory";

export function tmpOriginalMoviePath(
  sqsMessageId: string,
  s3Key: string
): string {
  const fileName = s3Key.split("/").pop();

  return `${tmpDirectory(sqsMessageId)}/${fileName}`;
}
