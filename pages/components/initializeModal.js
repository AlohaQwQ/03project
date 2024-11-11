import { createLutForCandyMachineAndGuard } from "../utils/createLutForCandyGuard";
import {
  Button,
  Modal,
  InputNumber,
  Typography,
  Row,
  Col,
  notification,
} from "antd";
import {
  CandyGuard,
  CandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  Umi,
} from "@metaplex-foundation/umi";
import React, { useState } from "react";

const { Text } = Typography;

const InitializeModal = ({ umi, candyMachine, candyGuard, visible, onClose }) => {
  const [computeUnitPrice, setComputeUnitPriceState] = useState(0);
  const [computeUnitLimit, setComputeUnitLimitState] = useState(0);
  const [solAmount, setSolAmount] = useState(0);

  const handleCreateLUT = async () => {
    try {
      // 确保只传递 5 个参数
      await createLutForCandyMachineAndGuard(umi, null, candyMachine, candyGuard, umi.identity.publicKey);
      notification.success({
        message: "LUT Created Successfully",
        description: "The LUT for the Candy Machine and Guard has been created.",
      });
      onClose();
    } catch (error) {
      notification.error({
        message: "Error Creating LUT",
        description: error.message,
      });
    }
  };

  return (
    <Modal
      title="Initialize Candy Machine"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleCreateLUT}>
          Create LUT
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Text>Compute Unit Price:</Text>
          <InputNumber
            min={0}
            value={computeUnitPrice}
            onChange={(value) => setComputeUnitPriceState(value)}
          />
        </Col>
        <Col span={12}>
          <Text>Compute Unit Limit:</Text>
          <InputNumber
            min={0}
            value={computeUnitLimit}
            onChange={(value) => setComputeUnitLimitState(value)}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Text>Sol Amount:</Text>
          <InputNumber
            min={0}
            value={solAmount}
            onChange={(value) => setSolAmount(value)}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default InitializeModal;