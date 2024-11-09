import styles from "../styles/Home.module.css";
import { useMemo, useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import MetaplexProvider from "./MetaplexProvider";

import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from 'next/dynamic';
import Navbar from './Navbar';

import MintNFTs from "./MintNFTs";
import Home3 from "./Home3";

export default function Home() {
  const [network, setNetwork] = useState('https://rpc.shyft.to?api_key=GZdHhsJYG2Wa94Am');

  const endpoint = useMemo(() => network, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network })
      //new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <div className={styles.App}>
      <Home3 />
    </div>);

  // return (
  //   <div>
  //     <ConnectionProvider endpoint={endpoint}>
  //       <WalletProvider wallets={wallets} autoConnect>
  //         <WalletModalProvider>
  //           <MetaplexProvider>
  //             <div className={styles.App}>
  //               {/* <Navbar /> */}
  //               {/* <ButtonWrapper /> */}
  //               {/* <MintNFTs /> */}
  //               <Home3 />
  //             </div>
  //           </MetaplexProvider>
  //         </WalletModalProvider>
  //       </WalletProvider>
  //     </ConnectionProvider>
  //   </div>
  // );
}
