// Run as index.ts
import { Keypair, Connection, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction, TransactionInstruction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { initializeKeypair, getWalletAddress, findMintAddress, runPythonScript } from "./helpers";
import { VisionOutput } from "./types";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

async function main() {
    const connection = new Connection(clusterApiUrl('devnet'));
    // anchor.setProvider(anchor.AnchorProvider.env());
    // const program = anchor.workspace.Soliage as Program<Soliage>;
    
    console.log('Fetching vision outputs...');
    const visionOutputs: VisionOutput[] = JSON.parse(await runPythonScript("./vision-module/vision.py"));

    for (const visionOutput of visionOutputs) {
        const mintAddress = new anchor.web3.PublicKey(visionOutput.mintAddress);

        // const owner = await getWalletAddress(anchor.getProvider().connection, mintAddress.toBase58());
        const owner = await getWalletAddress(connection, mintAddress.toBase58());
        console.log(`Id is ${visionOutput.id}.`);
        console.log(`Owner is ${owner}.`);
        console.log(`Forestation percentage is ${Math.round(Number(visionOutput.value) / LAMPORTS_PER_SOL * 10000)/100}%.`);
        
        const [pda] =  anchor.web3.PublicKey.findProgramAddressSync([
            utf8.encode('oracle'),
            mintAddress.toBuffer()
          ],
          program.programId
        );
        await program.methods.update(visionOutput.value).accounts({
            oracle: pda
          }).rpc();
          const oracleAccount = await program.account.oracleAccount.fetch(pda);
          console.log(oracleAccount);
    }
    
    // await pingProgram(connection, steward);
}

main().then(() => {
    console.log("Finished successfully");
}).catch((error) => {
    console.error(error);
})

