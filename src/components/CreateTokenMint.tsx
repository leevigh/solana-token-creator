"use client"
import React, { useEffect, useState } from 'react';
import * as web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
    MINT_SIZE, 
    TOKEN_PROGRAM_ID, 
    getMinimumBalanceForRentExemptMint, 
    createInitializeMintInstruction 
} from '@solana/spl-token';
import Link from 'next/link';

const CreateTokenMint = () => {
    const { connection } = useConnection();
    const { publicKey, wallet, sendTransaction } = useWallet();
    const [txSignature, setTxSignature] = useState("");
    const [mint, setMint] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const explorerLink = () => {
        return txSignature 
            ? 
            `https://explorer.solana.com/tx/${txSignature}?cluster=devnet` 
            : 
            "";
    };

    useEffect(() => {
        console.log("WALLET", wallet);
    }, [])

    const createMint = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // make sure of connection & publicKey
        if(!connection || !publicKey) return;

        const accountKeypair = web3.Keypair.generate();
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const transaction = new web3.Transaction();

        try {
            transaction.add(
                web3.SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: accountKeypair.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId: TOKEN_PROGRAM_ID
                }),
                createInitializeMintInstruction(
                    accountKeypair.publicKey,
                    2,
                    publicKey,
                    publicKey,
                    TOKEN_PROGRAM_ID
                )
            )

            const signature = await sendTransaction(transaction, connection, {
                signers: [accountKeypair]
            });

            if(signature) {
                setTxSignature(signature);
                setMint(accountKeypair.publicKey.toString());
            }

        } catch (error) {
            console.log("Tx Error", error);
            setErrorMsg("An error occured while adding transaction");

            setTimeout(() => {
                setErrorMsg("");
            }, 4000);
        }
    }


  return (
    <div>
        {errorMsg && <div>{errorMsg}</div>}

        {publicKey 
            ? 
                <>
                    <div className=''>
                        <form onSubmit={createMint} className="">
                            <button type="submit" className="py-4 px-6 bg-purple-600 rounded-md">
                                Create Token Mint
                            </button>
                        </form>

                        {txSignature ? (
                            <div className='py-4'>
                                <p>Token Mint Address: </p>
                                <p>{mint}</p>
                                <p>View your transaction on </p>
                                <Link href={explorerLink()} className='text-green-400 underline'>Solana Explorer</Link>
                            </div>
                        ) : null}
                    </div>
                </> 
            : 
                <>
                    <div className='flex justify-center items-center text-2xl text-white'>
                        <p>Connect Your Wallet</p>
                    </div>
                </>
        }
    </div>
  )
}

export default CreateTokenMint