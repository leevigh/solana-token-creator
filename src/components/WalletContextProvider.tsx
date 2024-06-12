"use client"
import React, { ReactNode } from 'react';
import * as web3 from '@solana/web3.js';
import { 
    ConnectionProvider, 
    WalletProvider 
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider = ({children}:{children: ReactNode}) => {
    const wallets = [new PhantomWalletAdapter()];

    const endpoint = web3.clusterApiUrl("devnet");

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletContextProvider