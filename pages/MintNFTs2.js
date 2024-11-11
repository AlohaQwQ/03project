import {
  PublicKey,
  publicKey,
  Umi,
} from "@metaplex-foundation/umi";
import { DigitalAssetWithToken, JsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useUmi } from "./utils/useUmi";
import { fetchCandyMachine, safeFetchCandyGuard, CandyGuard, CandyMachine, AccountVersion } from "@metaplex-foundation/mpl-candy-machine";
import { guardChecker } from "./utils/checkAllowed";
import { Button, Modal, Typography, Spin, Card, Row, Col } from 'antd';
import ButtonList from "./components/mintButton";
import { ShowNft } from "./components/showNft";
import InitializeModal from "./components/initializeModal";
import { image, headerText } from "./settings";
import { useSolanaTime } from "./utils/SolanaTimeContext";

const { Title, Text } = Typography;

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const useCandyMachine = (
  umi,
  candyMachineId,
  checkEligibility,
  setCheckEligibility,
  firstRun,
  setFirstRun
) => {
  const [candyMachine, setCandyMachine] = useState();
  const [candyGuard, setCandyGuard] = useState();

  useEffect(() => {
    (async () => {
      if (checkEligibility) {
        if (!candyMachineId) {
          console.error("No candy machine in .env!");
          return;
        }

        let candyMachine;
        try {
          candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
          // Verify CM Version
          if (candyMachine.version !== AccountVersion.V2) {
            console.error("Wrong candy machine account version!");
            return;
          }
        } catch (e) {
          console.error(e);
          return;
        }
        setCandyMachine(candyMachine);
        if (!candyMachine) {
          return;
        }
        let candyGuard;
        try {
          candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
        } catch (e) {
          console.error(e);
        }
        if (!candyGuard) {
          return;
        }
        setCandyGuard(candyGuard);
        if (firstRun) {
          setFirstRun(false);
        }
      }
    })();
  }, [umi, checkEligibility]);

  return { candyMachine, candyGuard };
};

const MintNFTs2 = () => {
  const umi = useUmi();
  const solanaTime = useSolanaTime();
  const [mintsCreated, setMintsCreated] = useState();
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownedTokens, setOwnedTokens] = useState();
  const [guards, setGuards] = useState([
    { label: "startDefault", allowed: false, maxAmount: 0 },
  ]);
  const [firstRun, setFirstRun] = useState(true);
  const [checkEligibility, setCheckEligibility] = useState(true);
  const [isShowNftOpen, setShowNftOpen] = useState(false);
  const [isInitializerOpen, setInitializerOpen] = useState(false);

  if (!process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
    console.error("No candy machine in .env!");
  }

  const candyMachineId = useMemo(() => {
    if (process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
      return publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
    } else {
      console.error(`NO CANDY MACHINE IN .env FILE DEFINED!`);
      return publicKey("11111111111111111111111111111111");
    }
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
  }, [umi, checkEligibility, firstRun]);

  const PageContent = () => {
    return (
      <Card>
        <Title level={3}>{headerText}</Title>
        {loading ? (
          <Spin />
        ) : (
          <Row justify="space-between" align="middle">
            <Col>
              <Text>Available NFTs: {Number(candyMachine?.data.itemsAvailable) - Number(candyMachine?.itemsRedeemed)}/{Number(candyMachine?.data.itemsAvailable)}</Text>
            </Col>
            <Col>
              <ButtonList
                guardList={guards}
                candyMachine={candyMachine}
                candyGuard={candyGuard}
                umi={umi}
                ownedTokens={ownedTokens}
                setGuardList={setGuards}
                mintsCreated={mintsCreated}
                setMintsCreated={setMintsCreated}
                onOpen={() => setShowNftOpen(true)}
                setCheckEligibility={setCheckEligibility}
              />
            </Col>
          </Row>
        )}
      </Card>
    );
  };

  return (
    <main>
      <div className={'wallet'}>
        <WalletMultiButtonDynamic />
      </div>

      <div className={'center'}>
        <PageContent />
      </div>

      <Modal
        title="Your minted NFT:"
        visible={isShowNftOpen}
        onCancel={() => setShowNftOpen(false)}
        footer={null}
      >
        <ShowNft nfts={mintsCreated} />
      </Modal>

      <Modal
        title="Initializer"
        visible={isInitializerOpen}
        onCancel={() => setInitializerOpen(false)}
        footer={null}
      >
        <InitializeModal umi={umi} candyMachine={candyMachine} candyGuard={candyGuard} />
      </Modal>
    </main>
  );
};

export default MintNFTs2;