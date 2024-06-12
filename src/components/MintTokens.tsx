"use client"
import React, { useState } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import {
    createMintToInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAccount,
} from "@solana/spl-token";
import Link from 'next/link';

const MintTokens = () => {

    const [txSignature, setTxSignature] = useState("");
    const [tokenAccount, setTokenAccount] = useState("");
    const [balance, setBalance] = useState("");
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [errorMsg, setErrorMsg] = useState("");

    const explorerLink = () => {
        return txSignature
          ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
          : "";
    };

    const mintToken = async (e:any) => {
        e.preventDefault();
        if (!connection || !publicKey) {
        return;
        }
        const transaction = new web3.Transaction();

        const mintPubKey = new web3.PublicKey(e.target.mint.value);
        const recipientPubKey = new web3.PublicKey(e.target.recipient.value);
        const amount = e.target.amount.value;

        const associatedToken = await getAssociatedTokenAddress(
            mintPubKey,
            recipientPubKey,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        try { 
            transaction.add(
                createMintToInstruction(mintPubKey, associatedToken, publicKey, amount)
            );
    
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
          
            const signature = await sendTransaction(transaction, connection);
        
            await connection.confirmTransaction({ 
                signature, 
                blockhash, 
                lastValidBlockHeight 
            },
            'confirmed');
        
            setTxSignature(signature);
            setTokenAccount(associatedToken.toString());
        
            const account = await getAccount(connection, associatedToken);
            setBalance(account.amount.toString());
        } catch (error) {
            console.log("Mint Token error", error);
            setErrorMsg("An error occured while minting token to address");
            setTimeout(() => {
                setErrorMsg("");
            }, 4000);
        }
    };

  return (
    <div>
        {publicKey ? (
            <form onSubmit={mintToken} className="">
                <div className='flex flex-col'>
                    <label htmlFor="mint">Token Mint:</label>
                    <input
                        id="mint"
                        type="text"
                        className="mb-4 p-4 rounded-md border-[1px] focus:border-purple-600 bg-transparent border-gray-300 text-white"
                        placeholder="Enter Token Mint"
                        required
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="recipient">Recipient:</label>
                    <input
                        id="recipient"
                        type="text"
                        className="mb-4 p-4 rounded-md border-[1px] focus:border-purple-600 bg-transparent border-gray-300 text-white"
                        placeholder="Enter Recipient PublicKey"
                        required
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="amount">Amount Tokens to Mint:</label>
                    <input
                        id="amount"
                        type="text"
                        className="mb-4 p-4 rounded-md border-[1px] focus:border-purple-600 bg-transparent border-gray-300 text-white"
                        placeholder="e.g. 100"
                        required
                    />
                </div>

                <div>
                    <button type="submit" className="py-4 px-6 bg-purple-600 rounded-md">
                        Mint Tokens
                    </button>
                </div>
            </form>
        ) : (
            <span></span>
        )}

        <div>
            {txSignature ? (
                <div className='py-4'>
                    <p>Token Balance: {balance} </p>
                    <p>View your transaction on: </p>
                    <Link href={explorerLink()} className='text-green-400 underline'>Solana Explorer</Link>
                </div>
            ) : null}
        </div>
    </div>
  )
}

export default MintTokens