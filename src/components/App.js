import "../App.css";
import Header from "./Header";
import CreateArea from "./CreateArea";
import React, { useState, useEffect } from "react";

/* ethers 変数を使えるようにする*/
import { ethers } from "ethers";
import abi from "../utils/FundPortal.json";
const App = () => {
  // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);

  const contractAddress = "0x3295338611A8E5A344B925C88423D4811e1025Bb"; //Goerli Test Network address of my app
  const contractABI = abi.abi;
  // window.ethereumにアクセスできることを確認します。
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      // ユーザーのウォレットへのアクセスが許可されているかどうかを確認します。
      const accounts = await ethereum.request({ method: "eth_accounts" });
      getAllCampaigns();
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // connectWalletメソッドを実装
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  // waveの回数をカウントする関数を実装
  const createCampaign = async (fundingGoal, deadline, beneficiary) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const fundPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await fundPortalContract.getCampaignCount();
        console.log("Retrieved total campaign count...", count.toNumber());
        /*
         * コントラクトに👋（wave）を書き込む。ここから...
         */
        const createCampaignTxn = await fundPortalContract.createCampaign(
          fundingGoal,
          deadline,
          beneficiary
        );
        console.log("Mining...", createCampaignTxn.hash);
        await createCampaignTxn.wait();
        console.log("Mined -- ", createCampaignTxn.hash);
        count = await fundPortalContract.getCampaignCount();
        console.log("Retrieved total campaign count...", count.toNumber());
        /*-- ここまで --*/
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // WEBページがロードされたときに下記の関数を実行します。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const [allCampaigns, setAllCampaigns] = useState([]);

  const getAllCampaigns = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const fundPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        /* コントラクトからgetAllWavesメソッドを呼び出す */
        const campaigns = await fundPortalContract.getAllCampaigns();
        /* UIに必要なのは、アドレス、タイムスタンプ、メッセージだけなので、以下のように設定 */
        const campaignsCleaned = campaigns.map((campaign) => {
          return {
            fundingGoal: campaign.fundingGoal,
            deadline: campaign.deadline,
            beneficiary: campaign.beneficiary,
          };
        });

        /* React Stateにデータを格納する */
        setAllCampaigns(campaignsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * `emit`されたイベントに反応する
   */
  useEffect(() => {
    let fundPortalContract;

    const onNewCampaign = (fundingGoal, deadline, beneficiary) => {
      console.log("NewCampaign", fundingGoal, deadline, beneficiary);
      setAllCampaigns((prevState) => [
        ...prevState,
        {
          fundingGoal: fundingGoal,
          deadline: deadline,
          beneficiary: beneficiary,
        },
      ]);
    };

    /* NewWaveイベントがコントラクトから発信されたときに、情報を受け取ります */
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      fundPortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      fundPortalContract.on("CampaignCreated", onNewCampaign);
    }
    /*メモリリークを防ぐために、NewWaveのイベントを解除します*/
    return () => {
      if (fundPortalContract) {
        fundPortalContract.off("CampaignCreated", onNewCampaign);
      }
    };
  }, []);

  const [items, setItems] = useState([]);

  function addItem(inputText) {
    setItems((prevItems) => {
      return [...prevItems, inputText];
    });
  }

  return (
    <div>
      <Header connectWallet={connectWallet} currentAccount={currentAccount} />
      <CreateArea
        createCampaign={createCampaign}
        currentAccount={currentAccount}
      />
      <h2>All Campaigns</h2>
      <ul>
        {allCampaigns.map((campaign, index) => (
          <li key={index}>
            <div>
              <strong>Funding Goal:</strong> {campaign.fundingGoal.toString()}
            </div>
            <div>
              <strong>Deadline:</strong> {campaign.deadline.toString()}
            </div>
            <div>
              <strong>Beneficiary:</strong> {campaign.beneficiary}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
