import {
  PublicKey,
  publicKey,
  Umi,
} from "@metaplex-foundation/umi";
import { DigitalAssetWithToken, JsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useUmi } from "./utils/useUmi";
import { fetchCandyMachine, safeFetchCandyGuard, CandyGuard, CandyMachine, AccountVersion } from "@metaplex-foundation/mpl-candy-machine"
import { guardChecker } from "./utils/checkAllowed";
//import { Center, Card, CardHeader, CardBody, StackDivider, Heading, Stack, useToast, Text, Skeleton, useDisclosure, Button, Modal, ModalBody, ModalCloseButton, ModalContent, Image, ModalHeader, ModalOverlay, Box, Divider, VStack, Flex } from '@chakra-ui/react';
import { Center, Skeleton, useDisclosure, ModalHeader, ModalOverlay, Box, Divider, useToast, VStack, Flex } from '@chakra-ui/react';
import { ButtonList } from "./components/mintButton";
import { GuardReturn } from "./utils/checkerHelper";
import { ShowNft } from "./components/showNft";
import { InitializeModal } from "./components/initializeModal";
import { image, headerText } from "./settings";
import { useSolanaTime } from "./utils/SolanaTimeContext";
import { Button, Card, Row, Col, Spin, Layout, Modal, Menu, Image } from 'antd';
import { FormattedMessage } from 'react-intl';
import useScreenSize from './screenSize';
import { useWallet } from "@solana/wallet-adapter-react";

const { Header, Sider, Content, Footer } = Layout;

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const useCandyMachine = (
  umi: Umi,
  candyMachineId: string,
  checkEligibility: boolean,
  setCheckEligibility: Dispatch<SetStateAction<boolean>>,
  firstRun: boolean,
  setfirstRun: Dispatch<SetStateAction<boolean>>
) => {
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [candyGuard, setCandyGuard] = useState<CandyGuard>();
  const toast = useToast();


  useEffect(() => {
    (async () => {
      if (checkEligibility) {
        if (!candyMachineId) {
          console.error("No candy machine in .env!Add your candy machine address to the .env file!");
          // if (!toast.isActive("no-cm")) {
          //   toast({
          //     id: "no-cm",
          //     title: "No candy machine in .env!",
          //     description: "Add your candy machine address to the .env file!",
          //     status: "error",
          //     duration: 999999,
          //     isClosable: true,
          //   });
          // }
          return;
        }

        let candyMachine;
        try {
          candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
          //verify CM Version
          if (candyMachine.version != AccountVersion.V2) {
            console.error("Wrong candy machine account version!Please use latest sugar to create your candy machine. Need Account Version 2!");
            // toast({
            //   id: "wrong-account-version",
            //   title: "Wrong candy machine account version!",
            //   description: "Please use latest sugar to create your candy machine. Need Account Version 2!",
            //   status: "error",
            //   duration: 999999,
            //   isClosable: true,
            // });
            return;
          }
        } catch (e) {
          console.error("The CM from .env is invalid!Are you using the correct environment?" + e);
          // toast({
          //   id: "no-cm-found",
          //   title: "The CM from .env is invalid",
          //   description: "Are you using the correct environment?",
          //   status: "error",
          //   duration: 999999,
          //   isClosable: true,
          // });
        }
        setCandyMachine(candyMachine);
        if (!candyMachine) {
          return;
        }
        let candyGuard;
        try {
          candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
        } catch (e) {
          console.error("No Candy Guard found!Do you have one assigned?" + e);
          // toast({
          //   id: "no-guard-found",
          //   title: "No Candy Guard found!",
          //   description: "Do you have one assigned?",
          //   status: "error",
          //   duration: 999999,
          //   isClosable: true,
          // });
        }
        if (!candyGuard) {
          return;
        }
        setCandyGuard(candyGuard);
        if (firstRun) {
          setfirstRun(false)
        }
      }
    })();
  }, [umi, checkEligibility, candyMachineId, firstRun, setfirstRun, toast]);

  return { candyMachine, candyGuard };
};

export default function Home() {
  const umi = useUmi();
  const solanaTime = useSolanaTime();
  const toast = useToast();
  const { isOpen: isShowNftOpen, onOpen: onShowNftOpen, onClose: onShowNftClose } = useDisclosure();
  const { isOpen: isInitializerOpen, onOpen: onInitializerOpen, onClose: onInitializerClose } = useDisclosure();
  const [mintsCreated, setMintsCreated] = useState<{ mint: PublicKey, offChainMetadata: JsonMetadata | undefined }[] | undefined>();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [ownedTokens, setOwnedTokens] = useState<DigitalAssetWithToken[]>();
  const [guards, setGuards] = useState<GuardReturn[]>([
    { label: "startDefault", allowed: false, maxAmount: 0 },
  ]);
  const [firstRun, setFirstRun] = useState(true);
  const [checkEligibility, setCheckEligibility] = useState<boolean>(true);
  const [disableMint, setDisableMint] = useState(true);
  const [canMint, setCanMint] = useState(true);
  const [stopMint, setStopMint] = useState(true);
  const { connected, connect } = useWallet(); // 获取连接状态和连接函数
  
  if (!process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
    console.error("No candy machine in .env!Add your candy machine address to the .env file!")
    // if (!toast.isActive('no-cm')) {
    //   toast({
    //     id: 'no-cm',
    //     title: 'No candy machine in .env!',
    //     description: "Add your candy machine address to the .env file!",
    //     status: 'error',
    //     duration: 999999,
    //     isClosable: true,
    //   })
    // }
  }
  const candyMachineId: PublicKey = useMemo(() => {
    if (process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
      return publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
    } else {
      console.error(`NO CANDY MACHINE IN .env FILE DEFINED!Add your candy machine address to the .env file!`);
      // toast({
      //   id: 'no-cm',
      //   title: 'No candy machine in .env!',
      //   description: "Add your candy machine address to the .env file!",
      //   status: 'error',
      //   duration: 999999,
      //   isClosable: true,
      // })
      return publicKey("11111111111111111111111111111111");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { candyMachine, candyGuard } = useCandyMachine(umi, candyMachineId, checkEligibility, setCheckEligibility, firstRun, setFirstRun);

  useEffect(() => {
    const checkEligibilityFunc = async () => {
      if (!candyMachine || !candyGuard || !checkEligibility || isShowNftOpen) {
        return;
      }
      setFirstRun(false);

      const { guardReturn, ownedTokens } = await guardChecker(
        umi, candyGuard, candyMachine, solanaTime
      );

      setOwnedTokens(ownedTokens);
      setGuards(guardReturn);
      setIsAllowed(false);

      let allowed = false;
      for (const guard of guardReturn) {
        if (guard.allowed) {
          allowed = true;
          break;
        }
      }

      setIsAllowed(allowed);
      setLoading(false);
    };

    checkEligibilityFunc();
    // On purpose: not check for candyMachine, candyGuard, solanaTime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umi, checkEligibility, firstRun]);

  const MobileLayout = () => {
    return (
      <Layout style={{ background: 'rgba(255, 255, 255, 0)' }}>
        <Image
							alt="img"
							src="/resources/images/mintback.png" // 背景图路径
							preview={false} // 禁用预览
							style={{
								position: 'fixed', // 使用 fixed 使其相对于视口固定
								top: 0,
								left: 0,
								width: '100vw', // 设置宽度为视口宽度
								height: '100vh', // 设置高度为视口高度
								objectFit: 'cover', // 确保图片覆盖整个区域
								zIndex: -1 // 确保背景图在其他内容后面
							}}
						/>
        <div style={{ marginTop: '18%', padding: 0, display: 'flex', flex: 1, gap: '1%', flexDirection: 'column', alignItems: 'center' }}> {/* 使用 Flexbox 布局 */}

          <Content style={{ width: "90%", display: 'flex', alignItems: 'center' }}>
            <Image
              alt="03-logo"
              src="/resources/images/03-logo.png"
              style={{ width: '50%', marginLeft: '25%',height: 'auto' }} // 设置图片宽度自适应
              preview={false} // 禁用预览
            />
          </Content>

          <Content style={{ width: "90%" }}> {/* 设置为完全透明 */}
            <div style={{ fontSize: '18px', flex: '0 0 70%' }}>
              <Content style={{
                display: 'flex', // 使用 Flexbox 布局
              }}> {/* 使用 Flexbox 布局 */}

                <p style={{ fontSize: '26px', marginBottom: '1%' }}><FormattedMessage id="zeroSan" /></p>
                <Image
                  alt="account"
                  src="/resources/images/account.png"
                  style={{ width: '20px', height: 'auto', marginLeft: '10px' }} // 设置图片宽度自适应
                  preview={false} // 禁用预览
                />
              </Content>

              <p style={{ marginBottom: '1%', lineHeight: '1.5' }}><FormattedMessage id="communityIntro" /></p>
              <p style={{ marginBottom: '1%', lineHeight: '1.5' }}><FormattedMessage id="collaboration" /></p>
              <p style={{ marginBottom: '1%', lineHeight: '1.5' }}><FormattedMessage id="mission" /></p>
              <p style={{ marginBottom: '1%', lineHeight: '1.5' }}><FormattedMessage id="missionStatement1" /></p>
              <p style={{ marginBottom: '1%', lineHeight: '1.5' }}><FormattedMessage id="missionStatement2" /></p>
              <p style={{ marginBottom: '1%', lineHeight: '1.5' }}><FormattedMessage id="identity" /></p>
              <p style={{ marginTop: '6%' }}>
                <a href="https://x.com/LINGSAN03" target="_blank" rel="noreferrer" style={{ color: '#1890ff', textDecoration: 'underline', marginRight: '5%' }}><FormattedMessage id="twitter" /></a>
                <a href="https://t.me/LINGSAN_03" target="_blank" rel="noreferrer" style={{ color: '#1890ff', textDecoration: 'underline' }}><FormattedMessage id="telegram" /></a>
              </p>
            </div>
          </Content>

        </div>
        <Footer style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0)',  marginTop: 40, marginBottom: 20,padding: 0, marginLeft: 20, }}>
          <Content style={{
            padding: 16,
            height: 45,
            width: '30%',
            marginBottom: '5%',
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
            <p style={{  marginLeft: '11%' }}><FormattedMessage id="mint" /></p> {/* 添加右边距以增加间隔 */}
          </Content>

          <div style={{ marginTop: '1%', display: 'flex', flexDirection: 'column', gap: '1%'}}> {/* 使用 Flexbox 布局 */}
            <Content
              style={{
                padding: 16,
                minHeight: 50,
                width: '60%',
                flex: '0 0 30%',
                marginBottom: '5%',
                background: 'rgba(128, 128, 128, 0.3)', // 设置透明的灰色背景
                borderRadius: '8px', // 设置圆角
              }}
            >
              <div style={{ textAlign: 'left', width: '100%' }}>
                <p style={{ marginBottom: '5%' }}><FormattedMessage id="mintPrice" /></p>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}><FormattedMessage id="mintPriceValue" /></p>{/* 设置字体大小和加粗 */}
              </div>
            </Content>
            <Content
              style={{
                padding: 16,
                minHeight: 50,
                width: '60%',
                flex: '0 0 30%',
                background: 'rgba(128, 128, 128, 0.3)', // 设置透明的灰色背景
                borderRadius: '8px', // 设置圆角
                display: 'flex', // 使用 Flexbox 布局
                flexDirection: 'column', // 垂直排列
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ textAlign: 'left' , width: '80%' }}>
                  <p style={{ fontSize: '18px' }} >
                    <FormattedMessage id="availability" />
                    {/* {Number(candyMachine?.data.itemsAvailable) - Number(candyMachine?.itemsRedeemed)}/{Number(candyMachine?.data.itemsAvailable)} */}
                  </p>
                  {/* <p style={{ fontSize: '24px', fontWeight: 'bold' }} ><FormattedMessage id="presaleOnly" /></p> */}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '15%', marginTop: 0, marginBottom: 0 }}>
                  <ButtonList
                    guardList={guards}
                    candyMachine={candyMachine}
                    candyGuard={candyGuard}
                    umi={umi}
                    ownedTokens={ownedTokens}
                    setGuardList={setGuards}
                    mintsCreated={mintsCreated}
                    setMintsCreated={setMintsCreated}
                    onOpen={onShowNftOpen}
                    setCheckEligibility={setCheckEligibility}
                  />
                </div>
                {/* <Button
                //onClick={canMint && disableMint ? onClick : null} // 当 canMint 为 true 且 disableMint 为 false 时，点击事件为 onClick
                disabled={!canMint || !disableMint} // 根据 canMint 和 disableMint 设置按钮禁用状态
                className={`mint-button ${!disableMint ? 'disabled' : ''}`} // 根据 disableMint 设置类名
              >
                <FormattedMessage id={!disableMint ? 'notMint' : canMint ? 'mint' : 'minted'} />
              </Button> */}
              </div>
            </Content>
          </div >
        </Footer >
      </Layout >
    );
  };

  const PageContent = () => {

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
          <Content style={{ width: "60%" }}> {/* 设置为完全透明 */}
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

              <p style={{ marginBottom: '2%' }}><FormattedMessage id="communityIntro" /></p>
              <p style={{ marginBottom: '2%' }}><FormattedMessage id="collaboration" /></p>
              <p style={{ marginBottom: '2%' }}><FormattedMessage id="mission" /></p>
              <p style={{ marginBottom: '2%' }}><FormattedMessage id="missionStatement1" /></p>
              <p style={{ marginBottom: '2%' }}><FormattedMessage id="missionStatement2" /></p>
              <p style={{ marginBottom: '2%' }}><FormattedMessage id="identity" /></p>
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
            <p style={{ fontSize: '20px', marginLeft: '11%' }}><FormattedMessage id="mint" /></p> {/* 添加右边距以增加间隔 */}
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
                <p style={{ fontSize: '18px', marginBottom: '5%' }}><FormattedMessage id="mintPrice" /></p>
                <p style={{ fontSize: '26px', fontWeight: 'bold' }}><FormattedMessage id="mintPriceValue" /></p>{/* 设置字体大小和加粗 */}
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
                  <p style={{ fontSize: '26px', marginBottom: '12%' }} >
                    <FormattedMessage id="availability" />
                    {/* {Number(candyMachine?.data.itemsAvailable) - Number(candyMachine?.itemsRedeemed)}/{Number(candyMachine?.data.itemsAvailable)} */}
                  </p>
                  {/* <p style={{ fontSize: '24px', fontWeight: 'bold' }} ><FormattedMessage id="presaleOnly" /></p> */}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '80%' }}>
                  <ButtonList
                    guardList={guards}
                    candyMachine={candyMachine}
                    candyGuard={candyGuard}
                    umi={umi}
                    ownedTokens={ownedTokens}
                    setGuardList={setGuards}
                    mintsCreated={mintsCreated}
                    setMintsCreated={setMintsCreated}
                    onOpen={onShowNftOpen}
                    setCheckEligibility={setCheckEligibility}
                  />
                </div>
                {/* <Button
                  //onClick={canMint && disableMint ? onClick : null} // 当 canMint 为 true 且 disableMint 为 false 时，点击事件为 onClick
                  disabled={!canMint || !disableMint} // 根据 canMint 和 disableMint 设置按钮禁用状态
                  className={`mint-button ${!disableMint ? 'disabled' : ''}`} // 根据 disableMint 设置类名
                >
                  <FormattedMessage id={!disableMint ? 'notMint' : canMint ? 'mint' : 'minted'} />
                </Button> */}
              </div>
            </Content>
          </div >
        </Footer >
      </Layout >
    );
  };

  // 获取屏幕宽度
  const { width } = useScreenSize();

  return (
    // <main>
    //   {/* <div className='wallet'>
    //     <WalletMultiButtonDynamic />
    //   </div> */}
    //   <PageContent key="content" />
    // </main>
    <main>
      {width < 768 ? <MobileLayout key="content" /> : <PageContent key="content" />} {/* 根据屏幕宽度选择布局 */}
    </main>
  );
}