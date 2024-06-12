import AppBar from "@/components/AppBar";
import BalanceDisplay from "@/components/BalanceDisplay";
import CreateTokenAccount from "@/components/CreateTokenAccount";
import CreateTokenMint from "@/components/CreateTokenMint";
import MintTokens from "@/components/MintTokens";
import TokenMetaData from "@/components/TokenMetaData";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <AppBar />

      <div className="flex justify-center">
        <BalanceDisplay />
      </div>

      <section className="max-w-[1440px] mx-auto p-4">
        <div className="grid grid-cols-1 px-2 md:px-8 gap-8 md:grid-cols-2 justify-evenly items-start">
          <div className="border-[1px] border-white rounded-md h-full p-6">
            <div>
              <h1 className="py-6 text-xl font-semibold text-green-400">Create Token Mint</h1>
            </div>
            <CreateTokenMint />
          </div>

          <div className="border-[1px] border-white rounded-md h-full p-6">
            <div>
              <h1 className="py-6 text-xl font-semibold text-green-400">Add Token MetaData</h1>
            </div>
            <TokenMetaData />
          </div>

          <div className="border-[1px] border-white rounded-md h-full p-6">
            <div>
              <h1 className="py-6 text-xl font-semibold text-green-400">Create Token Account</h1>
            </div>
            <CreateTokenAccount />
          </div>

          <div className="border-[1px] border-white rounded-md h-full p-6">
            <div>
              <h1 className="py-6 text-xl font-semibold text-green-400">Mint Tokens</h1>
            </div>
            <MintTokens />
          </div>
        </div>
      </section>
    </main>
  );
}
