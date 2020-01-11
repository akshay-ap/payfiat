require("dotenv").config();
const Web3 = require("web3");
const Common = require('ethereumjs-common');
const Tx = require("ethereumjs-tx").Transaction;
//instantite web3
let web3 = new Web3(process.env.INFURA_NODE);

const customPacific = Common.default.forCustomChain(
  'ropsten',
  {
    name: 'pacific-network',
    networkId: 846353,
    chainId: 846353,
  },
  'petersburg'
)

async function sendTx(txData, from, to, value) {
  try {
    //get current nonce
    let nonce = await web3.eth.getTransactionCount(from, "pending");
    console.log(`Nonce for ${from} - ${nonce}`);

    //prepare unsigned tx
    let gasPrice = "20000000000";
    let chainId = await getChainId(web3);
    console.log("Chain Id  - ", chainId);

    let rawTransaction = {
      from: from,
      nonce: nonce,
      gasPrice: web3.utils.toHex(parseInt(gasPrice)),
      gasLimit: web3.utils.toHex(parseInt("1000000")),
      to: to,
      value: 0,
      data: txData,
      chainId: chainId //846353
    };

    let tx = new Tx(rawTransaction, { chain: 4 });
    //sign the transaction
    console.log("The transaction's chain id is", tx.getChainId())
    let privKey = new Buffer.from(process.env.OCEAN_FROM_KEY, "hex");
    //sign the transaction
    tx.sign(privKey);
    console.log(`Signed tx`);
    //serialize the given tx to send it to blockchain
    let serializedTx = tx.serialize();
    console.log(`Tx serialised`);
    console.log(serializedTx)
    // send our signed tx to ethereum blockchain
    let signedTx = web3.eth.sendSignedTransaction(
      "0x" + serializedTx.toString("hex")
    );
    console.log(`Tx sent to the node`);

    //wait for confirmation
    let txHash = await new Promise((resolve, reject) => {
      signedTx
        .on("transactionHash", function (hash) {
          console.log(`Tx sent to network with id - ${hash}`);
          signedTx.off("transactionHash");
          resolve(hash);
        })
        .on("error", function (error) {
          reject(error);
          throw Error(error);
        });
    });

    return txHash;
  } catch (error) {
    throw Error(error);
  }
}

async function getChainId(web3) {
  try {
    console.log('Getting chain id')
    const chainId = await web3.eth.net.getId()
    console.log({ chainId }, 'Chain id obtained')
    return chainId
  } catch (e) {
    throw new Error(`Chain Id cannot be obtained`)
  }
}

module.exports = { sendTx };
