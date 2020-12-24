import { tmpDirectory } from "./tmpDirectory";

export function tmpConvertedMoviePath(sqsMessageId: string): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  const fileName = `${yyyy}-${mm}-${dd}-${hh}${mi}${ss}.mov`;
  return `${tmpDirectory(sqsMessageId)}/converted/${fileName}`;
}
