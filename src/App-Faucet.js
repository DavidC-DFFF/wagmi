import './App.css';

import React, { useState, useEffect } from "react";
import Web3 from 'web3';

import Faucet from "./artifacts/Faucet.json";
import Bricoin from "./artifacts/BriCoin.json";

import { ethers } from 'ethers';

let bricoinAddr = "0x3C754189B468f858a9348151A6BAB283Cfb0D3DC";
let faucetAddr = "0x63Ba03c0E7814C4bE7663591434d0EE26a7e87da";

function App() {
    const [userBalance, setUserBalance] = useState(0);
    const [faucetBalance, setFaucetBalance] = useState(0);
    const [userAddress, setUserAddress] = useState("0x63Ba03c0E7814C4bE7663591434d0EE26a7e87da");
    const [amountMax, setAmountMax] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);

    useEffect(() => {
        refresh();
        const interval = setInterval(() => {
            refresh();
        }, 5000);
        return () => clearInterval(interval);
    }, [faucetBalance]);

    async function handleWithdraw() {
        if (typeof window.ethereum == 'undefined') {
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const faucetContract = new ethers.Contract(faucetAddr, Faucet.abi, signer);
        try {
            let data = await faucetContract.withdrawSome(withdrawAmount);
            await data.wait();
            console.log("OK");
        } catch (error) {
            console.log(error);
        }
    }
    async function getUserAddress() {
        if (typeof window.ethereum == 'undefined') {
            return;
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        try {
            setUserAddress(accounts);
        } catch (error) {
            console.log(error);
        }
    }
    async function getUserBalance() {
        if (typeof window.ethereum == 'undefined') {
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(bricoinAddr, Bricoin.abi, provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        try {
            let data = await contract.balanceOf(accounts[0]);
            let data2 = Web3.utils.fromWei(data, 'ether');
            setUserBalance(data2);
        } catch (error) {
            console.log(error);
        }
    }
    async function getFaucetBalance() {
        if (typeof window.ethereum == 'undefined') {
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(bricoinAddr, Bricoin.abi, provider);
        try {
            let data = await contract.balanceOf(faucetAddr);
            let data2 = Web3.utils.fromWei(data, 'ether');
            setFaucetBalance(data2);
        } catch (error) {
            console.log(error);
        }
    }
    async function getAmountMax() {
        if (typeof window.ethereum == 'undefined') {
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(faucetAddr, Faucet.abi, provider);
        try {
            let data = await contract.amountMax();
            setAmountMax(data);
        } catch (error) {
            console.log(error);
        }
    }
    function refresh() {
        getUserAddress();
        getUserBalance();
        getFaucetBalance();
        getAmountMax();
    }

    return (
        <div className="App">
            <h1>Faucet App</h1>
            <div>
                <h2>User Information</h2>
                <p>User Address: {userAddress}</p>
                <div>
                    <p>User balance: {userBalance === null ? 'Loading...' : `${userBalance} BRN`}</p>
                </div>
                <div>
                    <p>Faucet balance: {faucetBalance === null ? 'Loading...' : `${faucetBalance} BRN`}</p>
                </div>
            </div>
            <div>
                <h2>Faucet Settings</h2>
                <p>BRN Address: {bricoinAddr}</p>
                <div>
                    <p>Amount withdrawable : {amountMax === null ? 'Loading...' : `${amountMax} BRN`}</p>
                </div>
            </div>
            <div>
                <h2>Withdraw</h2>
                <input
                    type="number"
                    placeholder="Enter amount to withdraw"
                    //value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <button onClick={handleWithdraw}>Withdraw</button>
            </div>
        </div>
    );
}

export default App;