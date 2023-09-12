import Head from 'next/head';
import Web3 from 'web3';
import 'bulma/css/bulma.css';
import styles from '../styles/vendingMachine.module.css';


const VendingMachine = () => {
    // Metamask API provides something called ethereum provider api
    // its a global object thats injected into the window, 
    // its a provider api that lets us request accounts from metamask wallet
    // allows user to sign messages and transactions
    // allows us to read data from blockchain

    // window.ethereum
    const connectWalletHandler = () => {
        alert('connect wallet');
    }
    return (
        <div className={styles.main}>
            <Head>
                <title>Vending Machine App</title>
                <meta name= 'description' content='A blockchain vending machine app'/>
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
        </div>
        
    )
}

export default VendingMachine;