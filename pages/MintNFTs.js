import styles from "../styles/Home.module.css";
import { useMetaplex } from "./useMetaplex";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Card, Row, Col, Spin, Layout, Modal, Menu, Image } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Header, Sider, Content, Footer } = Layout;

const MintNFTs = ({ onClusterChange }) => {
  const { metaplex } = useMetaplex();
  const wallet = useWallet();

  const [nft, setNft] = useState(null);

  const [disableMint, setDisableMint] = useState(true);
  const [canMint, setCanMint] = useState(true);
  const [stopMint, setStopMint] = useState(true);

  const candyMachineAddress = new PublicKey("Soe1xuE4EU81KsnuJ66SJkiSyGvDfNzPAk1g4qi6KjF");//Soe1xuE4EU81KsnuJ66SJkiSyGvDfNzPAk1g4qi6KjF BB622ucoRBPB1QCCBVxNvwVbYXzDpyPm8RsUShC9iGqG

  let candyMachine;
  let walletBalance;

  const addListener = async () => {
    // 检查 candyMachine.candyGuard 是否为 null
    if (candyMachine.candyGuard) {
      // 添加监听器以监控 candy guard 的变化
      metaplex.connection.onAccountChange(candyMachine.candyGuard.address, () => checkEligibility());
    } else {
      console.error("candyMachine.candyGuard 为 null");
      // 处理错误情况
    }

    // add a listener to monitor changes to the user's wallet
    metaplex.connection.onAccountChange(metaplex.identity().publicKey,
      () => checkEligibility()
    );

    // add a listener to reevaluate if the user is allowed to mint if startDate is reached
    const slot = await metaplex.connection.getSlot();
    const solanaTime = await metaplex.connection.getBlockTime(slot);
    if (candyMachine.candyGuard && candyMachine.candyGuard.guards != null) {
      const startDateGuard = candyMachine.candyGuard.guards.startDate;
      if (startDateGuard != null) {
        const candyStartDate = startDateGuard.date.toString(10);
        const refreshTime = candyStartDate - solanaTime.toString(10);
        if (refreshTime > 0) {
          setTimeout(() => checkEligibility(), refreshTime * 1000);
        }
      }

      // also reevaluate eligibility after endDate is reached
      const endDateGuard = candyMachine.candyGuard.guards.endDate;
      if (endDateGuard != null) {
        const candyEndDate = endDateGuard.date.toString(10);
        const refreshTime = solanaTime.toString(10) - candyEndDate;
        if (refreshTime > 0) {
          setTimeout(() => checkEligibility(), refreshTime * 1000);
        }
      }
    }

  };

  const handleError = (error) => {
    console.error("error：" + error);
  };

  const checkEligibility = async () => {
    try {

      //wallet not connected?
      if (!wallet.connected) {
        setDisableMint(false);
        console.error("wallet not connect");
        return;
      }

      // read candy machine state from chain
      candyMachine = await metaplex
        .candyMachines()
        .findByAddress({ address: candyMachineAddress });

      // enough items available?
      if (
        candyMachine.itemsMinted.toString(10) -
        candyMachine.itemsAvailable.toString(10) >
        0
      ) {
        console.error("not enough items available");
        setDisableMint(false);
        setStopMint(false);
        return;
      }

      // guard checks have to be done for the relevant guard group! Example is for the default groups defined in Part 1 of the CM guide
      let guard = null;

      // 检查 candyMachine.candyGuard 是否为 null
      if (candyMachine.candyGuard) {
        guard = candyMachine.candyGuard.guards;
        // 继续处理 guard
      } else {
        console.error("candyMachine.candyGuard 为 null");
        // 处理错误情况
      }

      // Calculate current time based on Solana BlockTime which the on chain program is using - startTime and endTime guards will need that
      const slot = await metaplex.connection.getSlot();
      const solanaTime = await metaplex.connection.getBlockTime(slot);

      if (guard && guard.startDate != null) {
        const candyStartDate = guard.startDate.date.toString(10);
        if (solanaTime < candyStartDate) {
          console.error("startDate: CM not live yet");
          setDisableMint(false);
          return;
        }
      } else {
        console.error("guard 为 null 或 startDate 不存在");
        // 处理错误情况
      }

      if (guard && guard.endDate != null) {
        const candyEndDate = guard.endDate.date.toString(10);
        if (solanaTime > candyEndDate) {
          console.error("endDate: CM not live anymore");
          setDisableMint(false);
          return;
        }
      }

      if (guard && guard.addressGate != null) {
        if (metaplex.identity().publicKey.toBase58() != guard.addressGate.address.toBase58()) {
          console.error("addressGate: You are not allowed to mint");
          setDisableMint(false);
          return;
        }
      }

      if (guard && guard.mintLimit != null) {
        const mitLimitCounter = metaplex.candyMachines().pdas().mintLimitCounter({
          id: guard.mintLimit.id,
          user: metaplex.identity().publicKey,
          candyMachine: candyMachine.address,
          candyGuard: candyMachine.candyGuard.address,
        });
        //Read Data from chain
        const mintedAmountBuffer = await metaplex.connection.getAccountInfo(mitLimitCounter, "processed");
        let mintedAmount;
        if (mintedAmountBuffer != null) {
          mintedAmount = mintedAmountBuffer.data.readUintLE(0, 1);
        }
        if (mintedAmount != null && mintedAmount >= guard.mintLimit.limit) {
          console.error("mintLimit: mintLimit reached!");
          setDisableMint(false);
          return;
        }
      }

      if (guard && guard.solPayment != null) {
        walletBalance = await metaplex.connection.getBalance(
          metaplex.identity().publicKey
        );

        const costInLamports = guard.solPayment.amount.basisPoints.toString(10);

        if (costInLamports > walletBalance) {
          console.error("solPayment: Not enough SOL!");
          setDisableMint(false);
          return;
        }
      }

      if (guard && guard.freezeSolPayment != null) {
        walletBalance = await metaplex.connection.getBalance(
          metaplex.identity().publicKey
        );

        const costInLamports = guard.freezeSolPayment.amount.basisPoints.toString(10);

        if (costInLamports > walletBalance) {
          console.error("freezeSolPayment: Not enough SOL!");
          setDisableMint(false);
          return;
        }
      }

      if (guard && guard.nftGate != null) {
        const ownedNfts = await metaplex.nfts().findAllByOwner({ owner: metaplex.identity().publicKey });
        const nftsInCollection = ownedNfts.filter(obj => {
          return (obj.collection?.address.toBase58() === guard.nftGate.requiredCollection.toBase58()) && (obj.collection?.verified === true);
        });
        if (nftsInCollection.length < 1) {
          console.error("nftGate: The user has no NFT to pay with!");
          setDisableMint(false);
          setCanMint(false);
          return;
        }
      }

      if (guard && guard.nftBurn != null) {
        const ownedNfts = await metaplex.nfts().findAllByOwner({ owner: metaplex.identity().publicKey });
        const nftsInCollection = ownedNfts.filter(obj => {
          return (obj.collection?.address.toBase58() === guard.nftBurn.requiredCollection.toBase58()) && (obj.collection?.verified === true);
        });
        if (nftsInCollection.length < 1) {
          console.error("nftBurn: The user has no NFT to pay with!");
          setDisableMint(false);
          setCanMint(false);
          return;
        }
      }

      if (guard && guard.nftPayment != null) {
        const ownedNfts = await metaplex.nfts().findAllByOwner({ owner: metaplex.identity().publicKey });
        const nftsInCollection = ownedNfts.filter(obj => {
          return (obj.collection?.address.toBase58() === guard.nftPayment.requiredCollection.toBase58()) && (obj.collection?.verified === true);
        });
        if (nftsInCollection.length < 1) {
          console.error("nftPayment: The user has no NFT to pay with!");
          setDisableMint(false);
          setCanMint(false);
          return;
        }
      }

      if (guard && guard.redeemedAmount != null) {
        if (guard.redeemedAmount.maximum.toString(10) <= candyMachine.itemsMinted.toString(10)) {
          console.error("redeemedAmount: Too many NFTs have already been minted!");
          setDisableMint(false);
          return;
        }
      }

      if (guard && guard.tokenBurn != null) {
        const ata = await metaplex.tokens().pdas().associatedTokenAccount({ mint: guard.tokenBurn.mint, owner: metaplex.identity().publicKey });
        const balance = await metaplex.connection.getTokenAccountBalance(ata);
        if (balance < guard.tokenBurn.amount.basisPoints.toNumber()) {
          console.error("tokenBurn: Not enough SPL tokens to burn!");
          setDisableMint(false);
          return;
        }
      }

      if (guard && guard.tokenGate != null) {
        const ata = await metaplex.tokens().pdas().associatedTokenAccount({ mint: guard.tokenGate.mint, owner: metaplex.identity().publicKey });
        const balance = await metaplex.connection.getTokenAccountBalance(ata);
        if (balance < guard.tokenGate.amount.basisPoints.toNumber()) {
          console.error("tokenGate: Not enough SPL tokens!");
          setDisableMint(false);
          return;
        }
      }

      if (guard && guard.tokenPayment != null) {
        const ata = await metaplex.tokens().pdas().associatedTokenAccount({ mint: guard.tokenPayment.mint, owner: metaplex.identity().publicKey });
        const balance = await metaplex.connection.getTokenAccountBalance(ata);
        if (balance < guard.tokenPayment.amount.basisPoints.toNumber()) {
          console.error("tokenPayment: Not enough SPL tokens to pay!");
          setDisableMint(false);
          return;
        }
        if (guard && guard.freezeTokenPayment != null) {
          const ata = await metaplex.tokens().pdas().associatedTokenAccount({ mint: guard.freezeTokenPayment.mint, owner: metaplex.identity().publicKey });
          const balance = await metaplex.connection.getTokenAccountBalance(ata);
          if (balance < guard.tokenPayment.amount.basisPoints.toNumber()) {
            console.error("freezeTokenPayment: Not enough SPL tokens to pay!");
            setDisableMint(false);
            return;
          }
        }
      }

      //good to go! Allow them to mint
      setDisableMint(true);
      setCanMint(true);
      console.info("Can mint!");
    } catch (error) {
      handleError(error); // 调用自定义错误处理
    }
  };

  // show and do nothing if no wallet is connected
  // if (!wallet.connected) {
  //   return null;
  // }
  let onClick;
  if (wallet.connected) {
    console.log('disableMint:' + disableMint);
    console.log('canMint:' + canMint);
    // if it's the first time we are processing this function with a connected wallet we read the CM data and add Listeners
    if (candyMachine === undefined) {
      (async () => {
        // read candy machine data to get the candy guards address
        await checkEligibility();
        // Add listeners to refresh CM data to reevaluate if minting is allowed after the candy guard updates or startDate is reached
        addListener();
      }
      )();
    }

    onClick = async () => {
      // Here the actual mint happens. Depending on the guards that you are using you have to run some pre validation beforehand 
      // Read more: https://docs.metaplex.com/programs/candy-machine/minting#minting-with-pre-validation
      // const nftsMint = await metaplex.candyMachinesV2().findMintedNfts({ candyMachine });

      // console.log('nftsMint:' + nftsMint);
      try {
        console.log('mint!');
        const { nft } = await metaplex.candyMachines().mint({
          candyMachine,
          collectionUpdateAuthority: candyMachine.authorityAddress,
          group: 'Public',
        });
        setNft(nft);
      } catch (error) {
        handleError(error); // 调用自定义错误处理
      }
    };
  }

  return (
    <Layout style={{ position: 'relative', background: 'rgba(255, 255, 255, 0)' }}>
      <Image
        alt="img"
        src="/resources/images/mintback.png" // 背景图路径
        preview={false} // 禁用预览
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          objectFit: 'cover', // 确保图片覆盖整个区域
          zIndex: -1 // 确保背景图在其他内容后面
        }}
      />
      <div style={{ marginTop: '6%', marginLeft: 80, padding: 0, display: 'flex', flex: 1, gap: '1%', alignItems: 'center' }}> {/* 使用 Flexbox 布局 */}
        <Content width="70%" > {/* 设置为完全透明 */}
          <div style={{ fontSize: '20px', flex: '0 0 70%' }}>
            <Content style={{
              display: 'flex', // 使用 Flexbox 布局
              marginBottom: '3%'
            }}> {/* 使用 Flexbox 布局 */}

              <p style={{ fontSize: '60px' }}><FormattedMessage id="zeroSan" /></p>
              <Image
                alt="account"
                src="/resources/images/account.png"
                style={{ width: '30px', height: 'auto', marginLeft: '30px' }} // 设置图片宽度自适应
                preview={false} // 禁用预览
              />
            </Content>

            <p style={{ marginBottom: '1%' }}><FormattedMessage id="communityIntro" /></p>
            <p style={{ marginBottom: '1%' }}><FormattedMessage id="collaboration" /></p>
            <p style={{ marginBottom: '1%' }}><FormattedMessage id="mission" /></p>
            <p style={{ marginBottom: '1%' }}><FormattedMessage id="missionStatement1" /></p>
            <p style={{ marginBottom: '1%' }}><FormattedMessage id="missionStatement2" /></p>
            <p style={{ marginBottom: '1%' }}><FormattedMessage id="identity" /></p>
            <p style={{ marginTop: '3%' }}>
              <a href="https://x.com/LINGSAN03" target="_blank" rel="noreferrer" style={{ color: '#1890ff', textDecoration: 'underline', marginRight: '1%' }}><FormattedMessage id="twitter" /></a>
              <a href="https://t.me/LINGSAN_03" target="_blank" rel="noreferrer" style={{ color: '#1890ff', textDecoration: 'underline' }}><FormattedMessage id="telegram" /></a>
            </p>
          </div>
        </Content>
        <Content style={{ width: "30%", display: 'flex', alignItems: 'center' }}>
          <Image
            alt="03-logo"
            src="/resources/images/03-logo.png"
            style={{ width: '400px', height: 'auto' }} // 设置图片宽度自适应
            preview={false} // 禁用预览
          />
        </Content>
      </div>
      <Footer style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0)', marginLeft: 80, marginTop: 80, padding: 0 }}>
        <Content style={{
          padding: 16,
          height: 55,
          width: '9%',
          background: 'rgba(128, 128, 128, 0.5)', // 设置透明的灰色背景
          borderRadius: '24px', // 设置圆角
          display: 'flex', // 使用 Flexbox 布局
          alignItems: 'center', // 垂直居中对齐
        }}> {/* 使用 Flexbox 布局 */}
          <Image
            alt="status-live"
            src={stopMint ? "/resources/images/status-live.png" : "/resources/images/status-stop.png"} // 根据 StopMint 状态选择图片
            style={{ width: '25px', height: 'auto' }} // 设置图片宽度自适应
            preview={false} // 禁用预览
          />
          <p style={{ fontSize: '20px', marginLeft: '11%' }}><FormattedMessage id="presale" /></p> {/* 添加右边距以增加间隔 */}
        </Content>

        <div style={{ marginTop: '1%', display: 'flex', flex: 1, gap: '1%' }}> {/* 使用 Flexbox 布局 */}
          <Content
            style={{
              padding: 40,
              minHeight: 120,
              flex: '0 0 30%',
              background: 'rgba(128, 128, 128, 0.3)', // 设置透明的灰色背景
              borderRadius: '8px', // 设置圆角
            }}
          >
            <div style={{ textAlign: 'left', width: '100%' }}>
              <p style={{ fontSize: '16px', marginBottom: '5%' }}><FormattedMessage id="mintPrice" /></p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}><FormattedMessage id="mintPriceValue" /></p>{/* 设置字体大小和加粗 */}
            </div>
          </Content>
          <Content
            style={{
              padding: 40,
              minHeight: 120,
              flex: '0 0 30%',
              background: 'rgba(128, 128, 128, 0.3)', // 设置透明的灰色背景
              borderRadius: '8px', // 设置圆角
              display: 'flex', // 使用 Flexbox 布局
              flexDirection: 'column', // 垂直排列
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '16px', marginBottom: '12%' }} ><FormattedMessage id="availability" /></p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }} ><FormattedMessage id="presaleOnly" /></p>
              </div>
              <Button
                onClick={canMint && disableMint ? onClick : null} // 当 canMint 为 true 且 disableMint 为 false 时，点击事件为 onClick
                disabled={!canMint || !disableMint} // 根据 canMint 和 disableMint 设置按钮禁用状态
                className={`mint-button ${!disableMint ? 'disabled' : ''}`} // 根据 disableMint 设置类名
              >
                <FormattedMessage id={!disableMint ? 'notMint' : canMint ? 'mint' : 'minted'} />
              </Button>
            </div>
          </Content>
        </div >
      </Footer >
    </Layout >
  );
};
{/* 
  <div>
    <h1>NFT Mint Address</h1>
    <div>
      <input
        type="text"
        value={nft ? nft.mint.address.toBase58() : ""}
        readOnly
      />
    </div>
    {nft && (
      <div className={styles.nftPreview}>
        <h1>{nft.name}</h1>
        <img
          src={nft?.json?.image || "/fallbackImage.jpg"}
          alt="The downloaded illustration of the provided NFT address."
          className={styles.nftImage}
        />
      </div>
    )}
  </div> */}
export default MintNFTs; 