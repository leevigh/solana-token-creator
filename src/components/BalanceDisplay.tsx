"use client"
import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const BalanceDisplay = () => {
    const [balance, setBalance] = useState(0);
    const { publicKey } = useWallet();
    const { connection } = useConnection();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    
    /*
    
    check that there's a connection to the cluster and there's a publickey
    to proceed to get the wallet balance to display. 
    */
    const getAccountInfo = async () => {
       if(!connection || !publicKey) return;

       try {
            setIsLoading(true);
            const info = await connection.getAccountInfo(publicKey);
    
            if(!info) {
                setIsLoading(false);
                return;
            };

            setBalance(info.lamports);
            setIsLoading(false);
       } catch (error) {
            setIsLoading(false);
            setErrorMsg("An error occured");
            setTimeout(() => {
                setErrorMsg('')
            }, 4000);
       }
    };

    useEffect(() => {
        getAccountInfo();
    }, [connection, publicKey]);

  return (
    <div className='flex justify-center py-6'>
        <p className='text-2xl text-white font-semibold'>
            {errorMsg && errorMsg}
            {isLoading ? 
                'Loading...' 
            : 
                <div className='flex justify-center w-full'>
                    {publicKey ? 
                        <div className='flex flex-col justify-center items-center md:flex-row'>
                            SOL Balance: <span className='text-green-400 text-3xl'>{balance/LAMPORTS_PER_SOL}</span>
                        </div>
                        : 
                        ''
                    }
                </div>
            }
        </p>
    </div>
  )
}

export default BalanceDisplay