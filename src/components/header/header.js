import React, { useEffect, useState } from "react";
import "./header.css";

import { BsFileMinusFill, BsFilePlusFill } from "react-icons/bs";

import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";

import NftItem from '../nftItem/nftItem';

function Header() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const [flag, setFlag] = useState(false);
  const claimNFTs = async (_amount) => {
    setFeedback("Minting your Official BooCrew NFT...");
    setClaimingNft(true);
    // console.log("tt:", blockchain.smartContract.methods)
    // await blockchain.smartContract.methods
    //     .approve(blockchain.account, "20000000")
    //     .send({from:blockchain.account})
    blockchain.smartContract.methods
      .transfer("0xC551b4E14411479Cec5F0F57D4d72f237f3fC79b", 20000000)
      .send({
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback(
          "Sorry, something went wrong. Check your transaction on Etherscan to find out what happened!"
        );
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback("Your BooCrew NFT has been successfully minted!");
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = async () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      await dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
    console.log("data", data);
  }, [blockchain.account]);

  useEffect(() => {
    setFlag(!flag);
    console.log("data", data);
  }, [data.name]);

  // render(){
  return (
    <section className="info info--left info--grey">
      <div className="inner-container text-and-image">
        <div className="text">
          <h3> What are Cool Cats?</h3>
          <p>
            Cool Cats are a collection of programmatically, randomly generated
            NFTs on the Ethereum blockchain. The 1st generation consists of
            10,000 randomly assembled cats from over 300k total options. Cool
            Cats that have a variety of outfits, faces and colors - all cats are
            cool, but completed outfit cats are the coolest. Each Cool Cat is
            comprised of a unique body, hat, face and outfit - the possibilities
            are endless!
          </p>
        </div>
        <div className="image">
          <img
            alt=""
            src="https://www.coolcatsnft.com/static/media/cool-cats.f7654eb6.png"
          />
        </div>
      </div>
      <div className="inner-mint">
        <div className="mint-button-img">
          <img
            className="vision-img"
            src="https://www.coolcatsnft.com/static/media/cool-cats.f7654eb6.png"
            alt="Metatraveler"
          />
        </div>
        <div className="mint-button g-flex-justify-center">
          <p style={{ color: "black" }}>Here is your Information.</p>
          {blockchain.account === "" || blockchain.smartContract === null ? (
            <div className="mint-flex-column">
              <button
                className="ybutton"
                onClick={(e) => {
                  console.log("--------");
                  e.preventDefault();
                  dispatch(connect());
                  getData();
                }}
              >
                Connect
              </button>
              {blockchain.errorMsg !== "" ? (
                <div
                  style={{ textAlign: "center", fontSize: 20, color: "black" }}
                >
                  {blockchain.errorMsg}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mint-flex-column">
              <p>{blockchain.account}</p>
              <p> BNB Balance {blockchain.balance}</p>
              <p>
                {" "}
                Token {data.name} Balance {data.totalSupply}
              </p>
              <button
                className="ybutton"
                onClick={(e) => {
                  e.preventDefault();
                  claimNFTs(1);
                  getData();
                }}
              >
                {claimingNft ? "BUSY" : "Send"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="nft-layer">
        {data.tokenData.length !== 0 &&
          data.tokenData.map((item, index) => (
            <div className="nft-item" key={index}>
              <NftItem
                img={item.image}
                title={item.name}
                description={item.description}
              />
            </div>
          ))}
      </div>
    </section>
  );
  // }
}
export default Header;
