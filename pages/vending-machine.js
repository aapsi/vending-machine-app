import Head from 'next/head';
import { useState } from 'react';
import Web3 from 'web3';
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
    let web3;
    
    const connectWalletHandler = async () => {
        if(typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            // we will first request the accounts to check if the connection is established
            try{
                window.ethereum.request({ method: "eth_requestAccounts"})
                web3 = new Web3()
            } catch(err) {
                setError(err.message)
            }
        
            
        } else {
            console.log("Please install Metamask")
        }
    }
    return (
        <div className={styles.main}>
        <Head>
            <title>Vending Machine App</title>
            <meta name="description" content="A blockchain vending machine app" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" />
        </Head>
            <nav className='navbar mt-4 mb-4'>
                <div className='container'>
                    <div className='navbar-brand'>
                        <h1>Vending Machine</h1>
                    </div>
                    <div className='navbar-end'>
                        <button onClick = {connectWalletHandler} className='button is-primary'>Connect Wallet</button>
                    </div>
                </div>
            </nav>
            {/* semactic dividing element */}
            <section>
                {/* className='container'-> bulma convention to give some padding and spacing */}
                <div className='container'>
                    <p>placeholder text</p>
                </div>
            </section>
            <section>
                {/* className='container'-> bulma convention to give some padding and spacing */}
                <div className='container has-text-danger'>
                    <p>{error}</p>
                </div>
            </section>
        </div>
        
    )
}

export default VendingMachine;