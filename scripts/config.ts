import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import { Soliage } from "../src/types";
import { Program } from "@project-serum/anchor";
import { initializeKeypair, initializeKeypairAndFund } from "../src/helpers";
const anchor = require("@project-serum/anchor");

const wallet = new anchor.Wallet(initializeKeypair("./.keys/oracle_dev.json"))
anchor.setProvider(new anchor.AnchorProvider(new anchor.web3.Connection("http://127.0.0.1:8899"), wallet, {}))

const program = anchor.workspace.Soliage as Program<Soliage>;
const connection = anchor.getProvider().connection;

const randomPayer = async (lamports = LAMPORTS_PER_SOL) => {
    const wallet = Keypair.generate();
    const signature = await connection.requestAirdrop(wallet.publicKey, lamports);
    await connection.confirmTransaction(signature);
    return wallet;
}

const findCotMintAuthorityPDA = async (): Promise<[PublicKey, number]> => {
    return await getProgramDerivedAddress(cotMintAddress);
}

const getProgramDerivedAddress = async (seed: PublicKey): Promise<[PublicKey, number]> => {
    return await PublicKey.findProgramAddress(
        [seed.toBuffer()],
        program.programId
    );
}

// @ts-ignore
const cotData = JSON.parse(fs.readFileSync(".keys/cot_mint.json"));
const cotMintKeypair = Keypair.fromSecretKey(new Uint8Array(cotData))
const cotMintAddress = cotMintKeypair.publicKey;



export {
    program,
    connection,
    wallet,
    randomPayer,
    cotMintKeypair,
    cotMintAddress,
    findCotMintAuthorityPDA,
}