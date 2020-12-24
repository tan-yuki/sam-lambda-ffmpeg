export function tmpDirectory(sqsMessageId: string): string {
  return `/tmp/${sqsMessageId}`;
}
