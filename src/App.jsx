import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    /*
     * First make sure we have access to the Ethereum object.
     */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(0); // added missing state for totalWaves
  const contractAddress = "0x4E0CDc56C47C6B3A47A344e04416fE942188a6C0";
  const contractABI = abi.abi;

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const wave = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // rest of the code
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAccount = async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
    };
    fetchAccount();
  }, []);

  return (
    <div className="App">
      <div>
        <a>
          <h1 className="">sup ladies</h1>
        </a>
      </div>
      <h1>👋 Hey there!</h1>
      <h4 className="mt-[3px] font-mono font-semibold">
        Aryan is pretty cool, right?
      </h4>
      <div>
        <button
          className="waveButton mt-6 hover:bg-[#00000073] transition duration-500 transform hover:scale-110 ring-transparent ring-2 focus:ring-[#646cff] hover:ring-[#646cff]"
          onClick={wave}
        >
          Heck Yeah!
        </button>
        <button className="bg-[#1a1a1a] ml-2 text-white py-2 px-4 rounded-lg">
          <span className="">{totalWaves}</span> agreed
        </button>
      </div>
      <div>
        {!currentAccount && (
          <button
            className="waveButton mt-2 hover:bg-[#00000073] transition duration-500 transform hover:scale-110 ring-transparent ring-2 focus:ring-[#646cff] hover:ring-[#646cff]"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
