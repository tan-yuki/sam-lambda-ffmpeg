import rimraf from "rimraf";

export function deleteLocalDirectory(dirPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    rimraf(dirPath, {}, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}