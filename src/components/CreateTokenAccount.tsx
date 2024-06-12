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

const CreateTokenAccount = () => {

    const [txSignature, setTxSignature] = useState("");
    const [tokenAccount, setTokenAccount] = useState("");
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [errorMsg, setErrorMsg] = useState("");

    const explorerLink = () => {
        return txSignature 
            ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet` 
            : "";
    };

    const createTokenAccount = async (e: any) => {
        e.preventDefault();
        
        if (!connection || !publicKey) {
            return;
        };

        const transaction = new web3.Transaction();
        const owner = new web3.PublicKey(e.target.owner.value);
        const mint = new web3.PublicKey(e.target.mint.value);

        const associatedToken = await getAssociatedTokenAddress(
            mint,
            owner,
            false,
            TOKEN_PROGRAM_ID,
        );

        try {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                  publicKey,
                  associatedToken,
                  owner,
                  mint,
                  TOKEN_PROGRAM_ID,
                  ASSOCIATED_TOKEN_PROGRAM_ID
                )
            );

            // sendTransaction(transaction, connection).then((sig) => {
            //     setTxSignature(sig);
            //     setTokenAccount(associatedToken.toString());

            //     console.log(txSignature, tokenAccount);
            // });
    
            const signature = await sendTransaction(transaction, connection);
            console.log(signature);

            setTxSignature(signature);
            setTokenAccount(associatedToken.toString());
        } catch (error) {
            console.log("Token Account Creation error", error);

            setErrorMsg("An error occured while creating token account");
            setTimeout(() => {
                setErrorMsg("");
            }, 4000)
        }
    }

    return (
        <div>
            {publicKey ? (
                <>
                    <p>{errorMsg && errorMsg}</p>
                    <form onSubmit={createTokenAccount} className="">
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

                        <div className='flex flex-col'>
                            <label htmlFor="owner" className='py-2'>Token Account Owner:</label>
                            <input
                                id="owner"
                                type="text"
                                className="mb-4 p-4 rounded-md border-[1px] focus:border-purple-600 bg-transparent border-gray-300 text-white"
                                placeholder="Enter Token Account Owner PublicKey"
                                required
                            />
                        </div>
                        <div>
                            <button 
                                type="submit" 
                                className="py-4 px-6 bg-purple-600 rounded-md"
                            >
                                Create Token Account
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
                        <p>Token Account Address: {tokenAccount}</p>
                        <p>View your transaction on: </p>
                        <Link href={explorerLink()} className='text-green-400 underline'>Solana Explorer</Link>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default CreateTokenAccount