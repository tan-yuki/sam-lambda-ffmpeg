export function basename(path: string): string | undefined {
  return path.split("/").pop();
}