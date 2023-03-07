const { exec } = require('node:child_process');

const path = "./vision-module/vision.py";
const arg = 1;
export const runPy = new Promise<string>( ( resolve, reject ) => {
    exec(`python3 ${path} ${arg}`, (error: any, stdout: any, stderr: any) => {
        if (error) {
            reject(`exec error: ${stderr}`);
            return;
        } else {
            resolve( stdout )
        }
    })
})
