// Run as index.ts
import web3 = require('@solana/web3.js')
import Dotenv from 'dotenv'  
const { exec } = require('node:child_process');

Dotenv.config()

const ORACLE_ADDRESS = 'CQ9sBC6dELeBFPtRLS3YM9Zw6K91xDG1drnxzcYG9uYS'
const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

function initializeKeypair(): web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    return web3.Keypair.fromSecretKey(secretKey)
}

async function pingProgram(connection: web3.Connection, payer: web3.Keypair) {
    const transaction = new web3.Transaction()

    const programId = new web3.PublicKey(PROGRAM_ADDRESS)
    const programDataPubkey = new web3.PublicKey(PROGRAM_DATA_ADDRESS)

    const instruction = new web3.TransactionInstruction({
        keys: [
            {
                pubkey: programDataPubkey,
                isSigner: false,
                isWritable: true,
            }
        ],
        programId
    })

    transaction.add(instruction)

    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    )
    console.log(signature)
}

const path = "./vision-module/vision.py";
const arg = 1;

const runPy = new Promise<string>( ( resolve, reject ) => {
    exec(`python3 ${path} ${arg}`, (error: any, stdout: any, stderr: any) => {
        if (error) {
            reject(`exec error: ${stderr}`);
            return;
        } else {
            resolve( stdout )
        }
    })
})

async function main() {
    const payer = initializeKeypair()
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const output = await runPy
    console.log(`Value is ${output}`)
    await pingProgram(connection, payer)
}

main().then(() => {
    console.log("Finished successfully")
}).catch((error) => {
    console.error(error)
})

