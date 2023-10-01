import {useState} from 'react';
import {ethers} from 'ethers';
import ABI from './ABI.json';
import CreatePost from './CreatePost';
import PostsList from './PostsList';

const contractAddress = "0xce7aD8A9D90Aa7da7Df05471C87d29E6BDc5EA43"

const App = () => {

  const [connected, setConnected] = useState(false)
  const [name, setName] = useState("")
  const [balance, setBalance] = useState("0")
  const [sub, setSub] = useState(null)

  const connect = async () => {
    try {
      let provider;
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const desiredChainId = '0xAA36A7';
      if (network.chainId !== parseInt(desiredChainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: desiredChainId,
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://rpc.sepolia.org'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                }],
              });
            } catch (addError) {
              throw addError;
            }
          } else {
            throw switchError;
          }
        }
      }
      provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const _userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const _balance = await contract.balanceOf(_userAddress)
      setBalance(_balance);
      const { ethereum } = window;
      if (ethereum) {
        const ensProvider = new ethers.providers.InfuraProvider('mainnet');
        const displayAddress = _userAddress?.substr(0, 6) + "...";
        const ens = await ensProvider.lookupAddress(_userAddress);
        if (ens !== null) {
          setName(ens)
        } else {
          setName(displayAddress)
        }
      }

      await signer.signMessage("Welcome to Web3 Builders!");

      setConnected(true)
    } catch(error) {
      console.log(error)
    }
  }

  const mint = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const _userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.registerUser(_userAddress, name, "https://test.com")
      await tx.wait()
      const _balance = await contract.balanceOf(_userAddress)
      setBalance(_balance);
    } catch(error) {
      console.log(error)
    }
  }

  const disconnect = async () => {
    setConnected(false)
  }

  return (
    <div className='app'>
      {!connected && <div className='connect-cont'><button className='connect' onClick={connect}>Sign In</button></div>}
      {connected && (
        <>
          <button className='disconnect' onClick={disconnect}>{name}</button>
          {balance.gt(0) ? (
            <>
              <CreatePost name={name}/>
              <PostsList/>
            </>
          ) : (
            <div className='mint-cont'>
            <button className='mint-btn' onClick={mint}>Create Account</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
