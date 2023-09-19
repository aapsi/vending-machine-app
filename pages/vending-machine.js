import Head from 'next/head';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import vendingMachineContract from '@/blockchain/vending';
import 'bulma/css/bulma.css';
import styles from '../styles/vendingMachine.module.css';


const VendingMachine = () => {
    // Metamask API provides something called ethereum provider api
    // its a global object thats injected into the window, 
    // its a provider api that lets us request accounts from metamask wallet
    // allows user to sign messages and transactions
    // allows us to read data from blockchain

    // window.ethereum -> this object is only going to exist if user has installed metamask
    
    const [error, setError] = useState('');
    const [inventory, setInventory] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [myDonutCount, setMyDonutCount] = useState('');
    const [buyCount, setBuyCount] = useState('');
    const [web3, setWeb3] = useState(null);
    const [address, setAddress] = useState('');
    const [vmContract, setVmContract] = useState(null);


    // when you have to load something after all the components of the page are loaded
    // we only have to run this when vmContract & address change
    useEffect(()=> { 
        if (vmContract && address) getInventoryHandler();
        if (vmContract && address) getMyDonutCountHandler();
    }, [vmContract, address])

    const getInventoryHandler = async () => {
        // whenever we basically read from the blockchain we use call and not send as we dont have to send in any ether
        const inventory = await vmContract.methods.getVendingMachineBalance().call();
        // the above returns a promise so we will need async and await
        setInventory(inventory);
    }

    // the accounts will not load as soon as the page loads so we cannot use useEffect here
    const getMyDonutCountHandler = async () => {
        const count = await vmContract.methods.donutBalances(address).call();
        setMyDonutCount(count);
    }

    const updateDonutQty = event => {
        setBuyCount(event.target.value); 
    }

    const buyDonutHandler = async () => {


        try {
            await vmContract.methods.purchase(buyCount).send({
                from: address,
                value: web3.utils.toWei('0.001', 'ether') * buyCount
            })
            setSuccessMsg(`${buyCount} donuts purchased!`)
            if (vmContract && address) getInventoryHandler();
            if (vmContract && address) getMyDonutCountHandler();
        }

        catch(err) {
            setError(err.message)
        }
    }
    
    const connectWalletHandler = async () => {
        // check if metamask is available
        if(typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            // we will first request the accounts to check if the connection is established
            try{
                // request wallet connect
                await window.ethereum.request({ method: "eth_requestAccounts"})
                // set web3 instance
                const web3 = new Web3(window.ethereum)
                setWeb3(web3)
                // get list of accounts
                const account = await web3.eth.getAccounts();
                setAddress(account[0]);

                // create a local contract copy
                const vm = vendingMachineContract(web3)
                setVmContract(vm)

            } catch(err) {
                setError(err.message)
            }

        } else {
            console.log("Please install Metamask")
        }
    }
    return (
        <div className={`${styles.main} full-height `}>
            <Head>
                <title>Vending Machine App</title>
                <meta name="description" content="A blockchain vending machine app" />
                {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" /> */}
                <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />

            </Head>
            <nav className='navbar is-fixed-top mb-4'>
                <div className='container'>
                    <div className='navbar-brand mt-4'>
                        <h1>Vending Machine</h1>
                    </div>
                    <div className='navbar-end mt-4'>
                        <button onClick = {connectWalletHandler} className='button is-primary'>Connect Wallet</button>
                    </div>
                </div>
            </nav>
            {/* semactic dividing element */}
            <section>
                {/* className='container'-> bulma convention to give some padding and spacing */}
                <div className='container has-text-centered  mb-10'>
                    <h2>Vending Machine Inventory: {inventory} </h2>
                </div>
            </section>
            <section>
                {/* className='container'-> bulma convention to give some padding and spacing */}
                <div className='container has-text-centered full-height mb-10'>
                    <h2>My Donuts: {myDonutCount} </h2>
                </div>
            </section>
            <section className="mt-5 has-text-centered full-height">
              <div className="container">
                <div className="field">
                  <label className="label">Buy donuts</label>
                  <div className="control">
                    <input onChange= {updateDonutQty} className="input" type="type" placeholder="Enter amount..." />
                  </div>
                  <button 
                    onClick={buyDonutHandler} 
                    className="button is-primary mt-2 my-button"
                  >Buy</button>
                </div>
              </div>
          </section>
          <section className="has-text-centered full-height">
              {/* className='container'-> bulma convention to give some padding and spacing */}
              <div className="container has-text-danger">
                <p>{error}</p>
              </div>
          </section>
          <section className="has-text-centered full-height">
              <div className="container has-text-success">
                  <p>{successMsg}</p>
              </div>
          </section>
        </div>
        
    )
}

export default VendingMachine;