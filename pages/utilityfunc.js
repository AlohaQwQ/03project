import React from 'react';
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { confirmTransactionFromBackend, confirmTransactionFromFrontend } from './shyft.js';

const connectTheWallet = async () => {
    const { solana } = window;
    let res = { success: false, message: "Could not connect wallet", addr: "" };

    if (!solana) {
        alert("Please Install Phantom");
        return res; // 如果没有安装 Phantom，直接返回
    }

    try {
        const network = "devnet";
        const phantom = new PhantomWalletAdapter();
        await phantom.connect(); // 连接钱包

        const rpcUrl = clusterApiUrl(network);
        const connection = new Connection(rpcUrl, "confirmed");

        const wallet = {
            address: phantom.publicKey.toBase58(),
        };

        if (wallet.address) {
            const accountInfo = await connection.getAccountInfo(new PublicKey(wallet.address), "confirmed");
            console.log('Wallet Connected');
            res.success = true;
            res.message = "Wallet connected successfully";
            res.addr = wallet.address;
        }
    } catch (err) {
        console.log(err);
    }

    return res; // 返回结果
};

const signAndConfirmTransaction = async (network, transaction, callback, prvKey) => {
    const phantom = new PhantomWalletAdapter();
    await phantom.connect(); // 连接钱包

    const rpcUrl = clusterApiUrl(network);
    const connection = new Connection(rpcUrl, "confirmed");

    const ret = await confirmTransactionFromBackend(network, transaction, prvKey);
    console.log(ret);

    connection.onSignature(ret, callback, 'finalized');
    return ret; // 返回签名结果
};

const signAndConfirmTransactionFe = async (network, transaction, callback) => {
    const phantom = new PhantomWalletAdapter();
    await phantom.connect(); // 连接钱包

    const rpcUrl = clusterApiUrl(network);
    const connection = new Connection(rpcUrl, "confirmed");

    const ret = await confirmTransactionFromFrontend(connection, transaction, phantom);
    console.log(ret);

    connection.onSignature(ret, callback, 'finalized');
    return ret; // 返回签名结果
};

// 统一导出
export { connectTheWallet, signAndConfirmTransaction, signAndConfirmTransactionFe };

const utilityfunc = () => {

};

export default utilityfunc;