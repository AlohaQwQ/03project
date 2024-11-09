import React from 'react';
import { clusterApiUrl, Connection, Keypair, Transaction } from '@solana/web3.js';
import { NodeWallet } from '@metaplex/js';
import { decode } from 'bs58';
import { Buffer } from 'buffer';

const confirmTransactionFromBackend = async (network, encodedTransaction, privateKey) => {
  const connection = new Connection(clusterApiUrl(network), 'confirmed');
  const feePayer = Keypair.fromSecretKey(decode(privateKey));
  const wallet = new NodeWallet(feePayer);
  const recoveredTransaction = Transaction.from(
    Buffer.from(encodedTransaction, 'base64')
  );
  const signedTx = await wallet.signTransaction(recoveredTransaction);
  const confirmTransaction = await connection.sendRawTransaction(
    signedTx.serialize()
  );
  return confirmTransaction;
};

const confirmTransactionFromFrontend = async (connection, encodedTransaction, wallet) => {
  console.log(encodedTransaction);
  const recoveredTransaction = Transaction.from(
    Buffer.from(encodedTransaction, 'base64')
  );
  const signedTx = await wallet.signTransaction(recoveredTransaction);
  const confirmTransaction = await connection.sendRawTransaction(
    signedTx.serialize()
  );
  return confirmTransaction;
};

// 统一导出
export { confirmTransactionFromBackend, confirmTransactionFromFrontend };

const shyft = () => {

};

export default shyft;