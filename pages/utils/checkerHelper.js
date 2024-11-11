import {
  Allocation,
  CandyMachine,
  GuardSet,
  MintLimit,
  safeFetchAllocationTrackerFromSeeds,
  safeFetchMintCounterFromSeeds,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  fetchToken,
  findAssociatedTokenPda,
} from "@metaplex-foundation/mpl-toolbox";
import {
  PublicKey,
  SolAmount,
  Some,
  Umi,
  publicKey,
} from "@metaplex-foundation/umi";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { notification } from "antd"; // 使用 Ant Design 的 notification 组件

// 保留 GuardReturn 结构定义
export const GuardReturn = {
  label: "",
  allowed: false,
  minting: undefined,
  loadingText: undefined,
  reason: undefined,
  maxAmount: 0,
  mintAmount: undefined,
};

export const addressGateChecker = (wallet, address) => {
  return wallet === address;
};

export const allocationChecker = async (
  umi,
  candyMachine,
  guard
) => {
  const allocation = guard.guards.allocation;

  try {
    const mintCounter = await safeFetchAllocationTrackerFromSeeds(umi, {
      id: allocation.value.id,
      candyMachine: candyMachine.publicKey,
      candyGuard: candyMachine.mintAuthority,
    });

    if (mintCounter) {
      return allocation.value.limit - mintCounter.count;
    } else {
      // no allocation mint Counter found - not created yet
      notification.error({
        message: "Allocation Guard not Initialized!",
        description: "Minting will fail!",
        duration: 9,
      });
      return allocation.value.limit;
    }

  } catch (error) {
    console.error(`AllocationChecker: ${error}`);
    return 0;
  }
};

export const solBalanceChecker = (
  solBalance,
  solAmount
) => {
  return solAmount <= solBalance;
};

export const tokenBalanceChecker = async (
  umi,
  tokenAmount,
  tokenMint
) => {
  const ata = findAssociatedTokenPda(umi, {
    mint: tokenMint,
    owner: umi.identity.publicKey,
  });

  const balance = await fetchToken(umi, umi.identity.publicKey);

  return Number(balance.amount) >= Number(tokenAmount);
};

export const mintLimitChecker = async (
  umi,
  candyMachine,
  guard
) => {
  const mintLimit = guard.guards.mintLimit;

  //not minted yet
  try {
    const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
      id: mintLimit.value.id,
      user: umi.identity.publicKey,
      candyMachine: candyMachine.publicKey,
      candyGuard: candyMachine.mintAuthority,
    });

    if (mintCounter) {
      return mintLimit.value.limit - mintCounter.count;
    } else {
      // no mintlimit counter found. Possibly the first mint
      return mintLimit.value.limit;
    }
  } catch (error) {
    console.error(`mintLimitChecker: ${error}`);
    return 0;
  }
};

export const ownedNftChecker = async (
  ownedNfts,
  requiredCollection
) => {
  const count = ownedNfts.filter(
    (el) =>
      el.metadata.collection.__option === "Some" &&
      el.metadata.collection.value.key === requiredCollection &&
      el.metadata.collection.value.verified === true
  ).length;
  return count;
};

export const allowlistChecker = (
  allowLists,
  umi,
  guardlabel
) => {
  if (!allowLists.has(guardlabel)) {
    console.error(`Guard ${guardlabel}; allowlist missing from allowlist.tsx`);
    return false;
  }
  if (
    !allowLists
      .get(guardlabel)
      ?.includes(publicKey(umi.identity.publicKey))
  ) {
    return false;
  }
  return true;
};

export const getSolanaTime = async (umi) => {
  const slot = await umi.rpc.getSlot();

  let solanaTime = await umi.rpc.getBlockTime(slot);

  if (!solanaTime) solanaTime = BigInt(0);
  return solanaTime;
};

export const checkDateRequired = (
  guards
) => {
  for (const guard of guards) {
    if (guard.guards.startDate || guard.guards.endDate) {
      return true;
    }
  }

  return false;
};

export const checkSolBalanceRequired = (
  guards
) => {
  let solBalanceRequired = false;
  guards.forEach((guard) => {
    if (guard.guards.freezeSolPayment || guard.guards.solPayment) {
      solBalanceRequired = true;
    }
  });

  return solBalanceRequired;
};

export const checkTokensRequired = (
  guards
) => {
  let nftBalanceRequired = false;
  guards.forEach((guard) => {
    if (
      guard.guards.nftBurn ||
      guard.guards.nftGate ||
      guard.guards.nftPayment
    ) {
      nftBalanceRequired = true;
    }
  });

  return nftBalanceRequired;
};

export const calculateMintable = (
  mintableAmount,
  newAmount
) => {
  if (mintableAmount > newAmount){
    mintableAmount = newAmount;
  }

  if (!process.env.NEXT_PUBLIC_MAXMINTAMOUNT) return mintableAmount;
  let maxmintamount = 0;
  try {
    maxmintamount = Number(process.env.NEXT_PUBLIC_MAXMINTAMOUNT)
  } catch (e){
    console.error('process.env.NEXT_PUBLIC_MAXMINTAMOUNT is not a number!', e)
    return mintableAmount;
  }
  if (mintableAmount > maxmintamount){
    mintableAmount = maxmintamount;
  }

  return mintableAmount;
};