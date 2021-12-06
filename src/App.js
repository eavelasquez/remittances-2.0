import { useState } from 'react'
import RLogin, { RLoginButton } from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'
// import rifId from './rif-id-social.png'
import './App.css'

const rLogin = new RLogin({
  cachedProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          31: 'https://public-node.testnet.rsk.co'
        }
      }
    }
  },
  supportedChains: [31] // we are going to connect to rsk testnet for this test
})

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [txHash, setTxHash] = useState('')
  const [signature, setSignature] = useState('')
  const [amountBtc, setAmountBtc] = useState('');
  const [amountUsd, setAmountUsd] = useState('');

  const connect = () => rLogin.connect()
    .then(({ provider }) => {
      setProvider(provider)
      provider.request({ method: 'eth_accounts' }).then(([account]) => setAccount(account))
    })

  const getBalance = () => provider.request({
    method: 'eth_getBalance',
    params: [account]
  }).then(setBalance)

  const toAddress = '0xEf4A35cD4D9c20591B330Cf9Ac1885E796Ed5661'
  const sendTransaction = () => {
    const totalAmount = Math.floor((Number(amountBtc) * 1000000000000000000)).toString(16);
    console.log('amountBtc', amountBtc);
    console.log('totalAmount', totalAmount);
    return provider.request({
      method: 'eth_sendTransaction',
      params: [{ from: account, to: toAddress, value: totalAmount }]
    }).then(setTxHash)
  }

  const message = 'Welcome to RIF Identity suite!!!'
  const personalSign = () => provider.request({
    method: 'personal_sign',
    params: [message, account]
  }).then(setSignature)

  const handleChangeAmount = (event) => {
    setAmountUsd(event.target.value);

    fetch('https://api.coingecko.com/api/v3/simple/price/?ids=rootstock&vs_currencies=usd')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAmountBtc(event.target.value / data.rootstock.usd);
      });
  }

  return (
    <div className="App">
      {/* <img src={rifId} height={200} /><br /> */}
      <RLoginButton onClick={connect}>Connect wallet</RLoginButton>
      <p>wallet address: {account}</p>
      <hr />
      <button onClick={getBalance} disabled={!account}>get balance</button>
      <p>balance: {balance}</p>
      <hr />
      <input type="number" value={amountUsd} onChange={handleChangeAmount} />
      <p>amount btc: {(+amountBtc).toFixed(8)}</p>
      <hr />
      <button onClick={sendTransaction} disabled={!account || !amountBtc}>send transaction</button>
      <p>txHash: {txHash}</p>
      <hr />
      <button onClick={personalSign} disabled={!account}>sign message</button>
      <p>signature: {signature}</p>
    </div>
  );
}

export default App;
