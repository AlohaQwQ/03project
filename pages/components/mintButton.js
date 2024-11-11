import {
  CandyGuard,
  CandyMachine,
  mintV2,
} from "@metaplex-foundation/mpl-candy-machine";
import { GuardReturn } from "../utils/checkerHelper";
import {
  AddressLookupTableInput,
  PublicKey,
  Umi,
  transactionBuilder,
  publicKey,
  some,
  none,
} from "@metaplex-foundation/umi";
import {
  DigitalAssetWithToken,
} from "@metaplex-foundation/mpl-token-metadata";
import { mintText } from "../settings";
import {
  Button,
  InputNumber,
  Tooltip,
  Typography,
  Divider,
  Row,
  Col,
} from "antd"; // 使用 Ant Design 的组件
import {
  fetchAddressLookupTable,
  setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  chooseGuardToUse,
  routeBuilder,
  mintArgsBuilder,
  buildTx,
  getRequiredCU,
} from "../utils/mintHelper";
import { useSolanaTime } from ".././utils/SolanaTimeContext";
import { verifyTx } from ".././utils/verifyTx";
import { base58 } from "@metaplex-foundation/umi/serializers";

const MintButton = ({
  umi,
  guardList,
  candyMachine,
  candyGuard,
  ownedTokens = [],
  setGuardList,
  mintsCreated,
  setMintsCreated,
  onOpen,
  setCheckEligibility,
}) => {
  const solanaTime = useSolanaTime();
  const [numberInputValues, setNumberInputValues] = useState({});

  const handleNumberInputChange = (label, value) => {
    setNumberInputValues((prev) => ({ ...prev, [label]: value }));
  };

  const mintClick = async (guard) => {
    const guardToUse = chooseGuardToUse(guard, candyGuard);
    if (!guardToUse.guards) {
      console.error("no guard defined!");
      return;
    }

    try {
      const mintArgs = mintArgsBuilder(candyMachine, guardToUse, ownedTokens);
      const tx = buildTx(
        umi,
        candyMachine,
        candyGuard,
        publicKey(umi.identity.publicKey),
        guardToUse,
        mintArgs,
        [],
        (await umi.rpc.getLatestBlockhash()).blockhash,
        1_400_000,
        true
      );

      const requiredCu = await getRequiredCU(umi, tx);
      const signatures = await verifyTx(umi, [tx], (await umi.rpc.getLatestBlockhash()).blockhash, "finalized");

      // notification.success({
      //   message: `${signatures.length} Transaction(s) sent!`,
      //   duration: 3,
      // });
    } catch (e) {
      console.error(`minting failed because of ${e}`);
      // notification.error({
      //   message: "Your mint failed!",
      //   description: "Please try again.",
      //   duration: 3,
      // });
    }
  };

  return (
    <div>
      {guardList.map((guard, index) => (
        <div key={index} style={{ marginTop: "20px" }}>
          <Divider />
          <Row>
            <Col span={12}>
              <Typography.Text strong>{guard.label}</Typography.Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Tooltip title={guard.reason}>
                <Button
                  onClick={() => mintClick(guard)}
                  type="primary"
                  disabled={!guard.allowed}
                >
                  {guard.label}
                </Button>
              </Tooltip>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <InputNumber
                min={1}
                max={guard.maxAmount < 1 ? 1 : guard.maxAmount}
                defaultValue={numberInputValues[guard.label] || 1}
                onChange={(value) => handleNumberInputChange(guard.label, value)}
              />
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default MintButton;