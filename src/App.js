import './App.css';

import { WagmiConfig, createConfig } from 'wagmi'
import { createPublicClient, http } from 'viem'

import { useAccount, useConnect, useDisconnect, useContractRead } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { polygonMumbai } from 'viem/chains';

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  }),
})

function Profile() {
  const { address } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (address)
    return (
      <button onClick={() => disconnect()}>Disconnect</button>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>
}

function Address() {
  const { address } = useAccount()
  if (address)
    return (
      <div>
        <p>Connected to {address}</p>
      </div>
    )
  return <p>Not connected</p>
}

function UserInfo() {
  const { address } = useAccount()
  const { balance } = useContractRead({
    address: '0x3C754189B468f858a9348151A6BAB283Cfb0D3DC',
    abi: './artifacts/Faucet.json',
    functionName: 'balanceOf',
    args: [address],
  })
  if (address)
    return (<div>
      <p>User address : {address}</p>
      <p>User balance : {balance} BRN</p>
    </div>)
  return (<div>
    <p>User address : Not connected</p>
    <p>User balance : Not connected</p>
  </div>)
}

function App() {
  return (
    <WagmiConfig config={config}>
      <div className="App">
        <header className="App-header">
          <Profile />
        </header>
        <main className="App-main">
          <h1>Faucet App</h1>
          <div>
            <h2>User Information</h2>
            <UserInfo />
          </div>
          <div>
            <h2>Faucet Settings</h2>
            <p>Faucet balance: </p>
            <p>BRN Address: </p>
            <p>Amount withdrawable : </p>
          </div>
          <div>
            <h2>Withdraw</h2>
          </div>
        </main>
      </div>
    </WagmiConfig>

  );
}

export default App;