import { BlockhashWithExpiryBlockHeight, PublicKey, Umi } from "@metaplex-foundation/umi";
import { notification } from "antd"; // 使用 Ant Design 的 notification 组件
import { base58 } from "@metaplex-foundation/umi/serializers";

const detectBotTax = (logs) => {
  return logs.find((l) => l.includes("Candy Guard Botting")) !== undefined;
};

export const verifyTx = async (umi, signatures, blockhash, commitment) => {
  const verifySignature = async (signature) => {
    console.log(base58.deserialize(signature));
    let transaction;
    for (let i = 0; i < 30; i++) {
      transaction = await umi.rpc.getTransaction(signature);
      if (transaction) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    if (!transaction) {
      return { success: false, reason: "No TX found" };
    }

    if (detectBotTax(transaction.meta.logs)) {
      return { success: false, reason: "Bot Tax detected!" };
    }

    return { success: true, mint: transaction.message.accounts[1] };
  };

  await umi.rpc.confirmTransaction(signatures[0], { strategy: { type: "blockhash", ...blockhash }, commitment });

  const stati = await Promise.all(signatures.map(verifySignature));
  let successful = [];
  let failed = [];
  stati.forEach((status) => {
    if (status.success === true) {
      successful.push(status.mint);
    } else {
      failed.push(status.reason);
    }
  });

  if (failed.length > 0) {
    notification.error({
      message: `${failed.length} transactions failed!`,
      description: failed.join(', '),
      duration: 3,
    });
    failed.forEach((fail) => {
      console.error(fail);
    });
  }

  if (successful.length > 0) {
    notification.success({
      message: `${successful.length} transactions successful!`,
      duration: 3,
    });
  }

  return successful;
};