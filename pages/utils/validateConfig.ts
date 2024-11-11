import {
  FreezeTokenPayment,
  GuardSet,
  TokenPayment,
} from "@metaplex-foundation/mpl-candy-machine";
import { fetchToken } from "@metaplex-foundation/mpl-toolbox";
import { PublicKey, Some, Umi } from "@metaplex-foundation/umi";
import { notification } from "antd"; // 使用 Ant Design 的 notification 组件

export const checkAtaValid = (
  umi,
  guards
) => {
  console.log("checkAtaValid");
  let atas = [];
  
  guards.forEach((guard) => {
    if (guard.guards.tokenPayment.__option === "Some") {
      let tokenPayment = guard.guards.tokenPayment;
      atas.push(tokenPayment.value.destinationAta);
    }
    if (guard.guards.freezeTokenPayment.__option === "Some") {
      let freezeTokenPayment = guard.guards.freezeTokenPayment;
      atas.push(freezeTokenPayment.value.destinationAta);
    }
  });

  atas.forEach((ata) => {
    fetchToken(umi, ata).catch((e) => {
      console.log(e);
      notification.error({
        message: "Your Candy Guard config is incorrect!",
        description: `${ata} is not an Associated Token Account! Minting will fail!`,
        duration: 9,
      });
    });
  });
  
  return;
};