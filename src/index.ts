// Run as index.ts
import { Keypair, Connection, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction, TransactionInstruction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import {
    cotMintAddress,
    program,
    findCotMintAuthorityPDA,
    wallet,
    connection
  } from "../scripts/config"
import { initializeKeypair, getWalletAddress, findMintAddress, runPythonScript, TokenHelper, initializeKeypairAndFund } from "./helpers";
import { VisionOutput } from "./types";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";



async function main() {
    // const connection = new Connection(clusterApiUrl('devnet'));
    // const connection = new Connection('http://127.0.0.1:8899');
    // anchor.setProvider(anchor.AnchorProvider.local());

    // const wallet = new anchor.Wallet(await initializeKeypair("./.keys/oracle_dev.json"))
    // anchor.setProvider(new anchor.AnchorProvider(new anchor.web3.Connection("http://127.0.0.1:8899"), wallet, {}))
    
    console.log('Fetching vision outputs...');
    const visionOutputs: VisionOutput[] = JSON.parse(await runPythonScript("./vision-module/vision.py"));

    console.log(`Fetched ${visionOutputs.length} vision outputs. Parsing...`);
    for (const visionOutput of visionOutputs) {
        const mintAddress = new anchor.web3.PublicKey(visionOutput.mintAddress);

        const owner = await getWalletAddress(connection, mintAddress.toBase58());
        console.log(`Id is ${visionOutput.id}.`);
        console.log(`Owner is ${owner}.`);
        console.log(`Forestation percentage is ${Math.round(Number(visionOutput.value) / LAMPORTS_PER_SOL * 10000)/100}%.`);
        
        // Derive oracle PDA
        const [pda] =  anchor.web3.PublicKey.findProgramAddressSync([
            utf8.encode('oracle'),
            mintAddress.toBuffer()
          ],
          program.programId
        );
        
        // Prepare Token Bags
        const myTokenHelper = new TokenHelper(cotMintAddress);
        const stewardTokenBag = await myTokenHelper.getOrCreateTokenBag(
            owner as PublicKey,
            false
        );
        console.log(`Steward token address for COT: ${stewardTokenBag.address}`)
        
        // Submit value to oracle account
        const [cotPDA, cotPDABump] = await findCotMintAuthorityPDA();
        await program.methods.update(cotPDABump ,32006).accounts({
            oracle: pda,
            tokenProgram: TOKEN_PROGRAM_ID,
            nftOwner: owner,
            cotMint: cotMintAddress,
            cotMintAuthority: cotPDA,
            userCotTokenBag: stewardTokenBag.address,
        }).rpc();
    }
}

main().then(() => {
    console.log("Finished successfully");
}).catch((error) => {
    console.error(error);
})

