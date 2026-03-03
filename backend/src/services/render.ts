import { exec } from 'child_process';

export async function renderClip(ffmpegCommand: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(ffmpegCommand, (err, stdout, stderr) => {
      if (err) return reject(err);
      console.log(stdout);
      resolve();
    });
  });
}
