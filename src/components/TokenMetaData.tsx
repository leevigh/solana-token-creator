"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { 
    createCreateMetadataAccountV3Instruction, 
    PROGRAM_ID
} from "@metaplex-foundation/mpl-token-metadata";

const TokenMetaData = () => {

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [txSignature, setTxSignature] = useState("");
    const [tokenMintAddress, setTokenMintAddress] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const explorerLink = () => {
        return txSignature 
            ? `https://explorer.solana.com/tx/${tokenMintAddress}?cluster=devnet` 
            : "";
    };

    const createTokenMetadata = async (e:any) => {
        e.preventDefault();

        if(!connection || !publicKey) return;

        const transaction = new web3.Transaction();
        // const owner = new web3.PublicKey(e.target.owner.value);
        const tokenMint = new web3.PublicKey(e.target.mint.value);
        const tokenName = e.target.name.value;
        const symbol = e.target.symbol.value;
        const uri = "https://arweave.net/1234";

        const metadataData = {
            name: tokenName,
            symbol: symbol,
            // Arweave / IPFS / Pinata etc link using metaplex standard for off-chain data
            uri,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        };

        const metadataPDAAndBump = web3.PublicKey.findProgramAddressSync(
            [
              Buffer.from("metadata"),
              PROGRAM_ID.toBuffer(),
              tokenMint.toBuffer(),
            ],
            PROGRAM_ID
        );

        const metadataPDA = metadataPDAAndBump[0];

        const createMetadataAccountInstruction =
            createCreateMetadataAccountV3Instruction(
                {
                    metadata: metadataPDA,
                    mint: tokenMint,
                    mintAuthority: publicKey,
                    payer: publicKey,
                    updateAuthority: publicKey,
                },
                {
                    createMetadataAccountArgsV3: {
                        collectionDetails: null,
                        data: metadataData,
                        isMutable: true,
                    },
                }
            );

        try {
            transaction.add(createMetadataAccountInstruction);
    
            const signature = await sendTransaction(transaction, connection);

            setTxSignature(signature);
            setTokenMintAddress(tokenMintAddress);
        } catch (error) {
            console.log("Token Metadata Creation error", error);

            setErrorMsg("An error occured while creating token metadata");
            setTimeout(() => {
                setErrorMsg("");
            }, 4000);
        }
    };

  return (
    <div>
        {publicKey ? (
                <>
                    <p>{errorMsg && errorMsg}</p>
                    <form onSubmit={createTokenMetadata} className="">
                        <div className='flex flex-col'>
                            <label htmlFor="owner" className='py-2'>Token Mint:</label>
                            <input
                                id="mint"
                                type="text"
                                className="mb-4 p-4 rounded-md border-[1px] focus:border-purple-600 bg-transparent border-gray-300 text-white"
                                placeholder="Enter Token Mint"
                                required
                            />
                        </div>

                        {/* <div className='flex flex-col'>
                            <label htmlFor="owner" className='py-2'>Token Account Owner:</label>
                            <input
                                id="owner"
                                type="text"
                                className="mb-4 p-4 rounded-md border-[1px] focus:border-purple-600 bg-transparent border-gray-300 text-white"
                                placeholder="Enter Token Account Owner PublicKey"
                                required
                            />
                        </div> */}

                        <div className='flex flex-col'>
                            <label htmlFor="owner" className='py-2'>Token Name:</label>
                            <input
                                id="name"
                                type="text"
                                className="mb-4 p-4 rounded-md border-[1px] focus:border-purple-600 bg-transparent border-gray-300 text-white"
                                placeholder="Enter Token Name"
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="owner" className='py-2'>Token Symbol:</label>
                            <input
                                id="symbol"
                                type="text"
                                className="mb-4 p-4 rounded-md border-[1px] focus:border-purple-600 bg-transparent border-gray-300 text-white"
                                placeholder="Enter Token Symbol(ex. SOL)"
                                required
                            />
                        </div>

                        <div>
                            <button 
                                type="submit" 
                                className="py-4 px-6 bg-purple-600 rounded-md"
                            >
                                Add Token Metadata
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <span></span>
            )}

            <div>
                {txSignature ? (
                    <div className='py-4'>
                        <p>View your Mint on: </p>
                        <Link href={explorerLink()} className='text-green-400 underline'>Solana Explorer</Link>
                    </div>
                ) : null}
            </div>
    </div>
  )
}

export default TokenMetaData