// pages/_app.js
import '../styles/globals.css';
import './resources/css/home.css'; // 导入全局 CSS
import './resources/css/mintnfts.css'; // 导入全局 CSS
import React, { useMemo, useState } from "react";
import Navbar from './Navbar'; // 导入 Navbar 组件
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

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
import { IntlProvider } from 'react-intl';
import messages from './locales';

import "@solana/wallet-adapter-react-ui/styles.css";
import "./mintnft.css";
import { UmiProvider } from "./utils/UmiProvider";
import dynamic from 'next/dynamic';
import { ConfigProvider } from 'antd'; // 导入 ConfigProvider

function MyApp({ Component, pageProps }) {
  //https://rpc.shyft.to?api_key=GZdHhsJYG2Wa94Am
  //https://dawn-solemn-patina.solana-mainnet.quiknode.pro/da677c8be19b38de7459b4a3cb37f2336c5480df
  const [network, setNetwork] = useState('https://dawn-solemn-patina.solana-mainnet.quiknode.pro/da677c8be19b38de7459b4a3cb37f2336c5480df');

  const endpoint = useMemo(() => network, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network })
      // new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  // const ButtonWrapper = dynamic(() =>
  //   import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton)
  // );

  const [locale, setLocale] = useState('zh'); // 默认语言

  const switchLanguage = (lang) => {
    setLocale(lang);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ffffff', // 设置主色
          colorText: '#ffffff', // 设置文字颜色
          fontFamily: 'WenYue, Joystix, Roboto, sans-serif',
        },
      }}
    >

      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <MetaplexProvider>
            <UmiProvider endpoint={endpoint}>
              <IntlProvider locale={locale} messages={messages[locale]}>
                <div>
                  <Navbar switchLanguage={switchLanguage} /> {/* 在这里渲染 Navbar */}
                  {/* <ButtonWrapper /> */}
                  <Component {...pageProps} /> {/* 渲染当前页面组件 */}
                </div>
              </IntlProvider>
            </UmiProvider>
              
            </MetaplexProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ConfigProvider>
  );
}

export default MyApp;