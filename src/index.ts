// Run as index.ts
import { Keypair, Connection, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction, TransactionInstruction } from "@solana/web3.js";
import Dotenv from 'dotenv';
import { initializeKeypair, getWalletAddress } from "./config";
import { runPy } from "./runPy";

Dotenv.config()

const ORACLE_ADDRESS = 'JCrKhCHMnwwgGByjDntnADS7zmo22petbVYwumn8s2xf'
const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

async function pingProgram(connection: Connection, payer: Keypair) {
    const transaction = new Transaction()

    const programId = new PublicKey(PROGRAM_ADDRESS)
    const programDataPubkey = new PublicKey(PROGRAM_DATA_ADDRESS)

    const instruction = new TransactionInstruction({
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

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    )
    console.log(signature)
}

async function main() {
    const steward = initializeKeypair(".keys/steward_dev.json")
    const connection = new Connection(clusterApiUrl('devnet'))
    const output = await runPy
    const owner = getWalletAddress(connection, mintAddress);
    console.log(`Value is ${output}`)
    await pingProgram(connection, steward)
}

main().then(() => {
    console.log("Finished successfully")
}).catch((error) => {
    console.error(error)
})

