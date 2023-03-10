import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Account, getMint, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor"
import fs from "fs";
import { connection, randomPayer } from "../scripts/config";

const { exec } = require('node:child_process');

function findMintAddress(id: number): string {
    let mintAddress: string;
    // @ts-ignore
    const parcelData = JSON.parse(fs.readFileSync('./data/tokens.json'));
    if(parcelData.hasOwnProperty(id)){
        mintAddress = parcelData[id]['mintAddress'];
    } else {
        throw new Error(`Could not find mint address for token id ${id}`);
    }
    return mintAddress
}

function initializeKeypair(path: string): Keypair {
    // @ts-ignore
    const keyFile = JSON.parse(fs.readFileSync(path));
    const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(keyFile));
    return keypair;
}

async function initializeKeypairAndFund(path: string): Promise<Keypair> {
    // @ts-ignore
    const parcelData = JSON.parse(fs.readFileSync(path));
    const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(parcelData));
    const signature = await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    return keypair;
}

async function getWalletAddress(connection: Connection, mintAccount: string): Promise<PublicKey | undefined> {
    let pubkey: PublicKey | undefined = undefined;
    const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {
            filters: [
                {
                    dataSize: 165, // number of bytes
                },
                {
                    memcmp: {
                        offset: 0, // number of bytes
                        bytes: mintAccount, // base58 encoded string
                    },
                },
            ],
        }
    );
    accounts.forEach((account, i) => {
        const parsedAccountInfo:any = account.account.data;
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        if (tokenBalance > 0) {
            pubkey = new PublicKey(parsedAccountInfo["parsed"]["info"]['owner']);
        }
    });

    if (pubkey === undefined) {
        throw new Error(`No accounts found for token ${mintAccount}.`);
    }
    return pubkey;
}

async function runPythonScript(path: string): Promise<string> {
    const runPy = new Promise<string>( ( resolve, reject ) => {
        exec(`python3 ${path}`, (error: any, stdout: any, stderr: any) => {
            if (error) {
                reject(`exec error: ${stderr}`);
                return;
            } else {
                resolve( stdout )
            }
        })
    })
    return runPy;
}

class TokenHelper {
    mint: PublicKey;

    constructor(mint: PublicKey) {
        this.mint = mint;
    }

    getMint = async (): Promise<PublicKey> => {
       return (await getMint(connection, this.mint)).address;
    }

    balance = async (tokenBag: PublicKey) => {
        return parseInt((await connection.getTokenAccountBalance(tokenBag)).value.amount);
    }

    getOrCreateTokenBag = async (owner: PublicKey, isPDA: boolean = false): Promise<Account> => {
        // Get or create the account for token of type mint for owner
        return await getOrCreateAssociatedTokenAccount(
            connection,
            await randomPayer(),
            this.mint,
            owner,
            isPDA,
        );
    }
}

export {
    runPythonScript,
    findMintAddress,
    initializeKeypair,
    initializeKeypairAndFund,
    getWalletAddress,
    TokenHelper,
}
