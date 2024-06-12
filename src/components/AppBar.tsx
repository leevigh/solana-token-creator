"use client"
import React from 'react'
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const AppBar = () => {
  return (
    <div>
        <nav>
            <div className='flex justify-between items-center p-4 max-w-[1440px] mx-auto'>
                <div className='hidden md:flex'>
                    <Image 
                        src={'/solanaLogo.png'} 
                        width={200} 
                        height={30} 
                        alt={"app logo"} 
                    />
                </div>
                <div>
                    <div className='py-4'>
                        <Image src={"/token.png"} className='animate-bounce' width={70} height={20} alt="token app" />
                    </div>
                </div>
                <div>
                    <WalletMultiButton />
                </div>
            </div>
        </nav>
    </div>
  )
}

export default AppBar