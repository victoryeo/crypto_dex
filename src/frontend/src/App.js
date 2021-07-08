import React, { Component } from 'react'
import './App.css'
import Main from './Main'
import getWeb3 from './web3/getWeb3'

class App extends Component {
  constructor(props) {
    console.log('constructor')
    super(props)
    this.state = {
      account: '',
      ethBalance: '0',
      tokenBalance: '0',
      loading: true,
      errorFetch: null
    }
    this.web3 = null
  }

  async componentDidMount() {
    console.log('componentDidMount')
    try {
      this.web3 = await getWeb3
    } catch( err ) {
      console.warn('Error in web3 initialization.', err)
    }

    let tokenBal = await this.getTokenBalance()
    console.log(tokenBal)
    if (tokenBal === undefined) {
      tokenBal = 0
    }

    if (this.web3) {
      console.log(this.web3)
      console.log(tokenBal)
      let accounts = await this.web3.eth.getAccounts()
      console.log(accounts)

      let ethBal = await this.web3.eth.getBalance(accounts[0])
      console.log(ethBal)
      
      this.setState({
	      loading: false,
        account: accounts[0],
        tokenBalance: tokenBal.toString(),
        ethBalance: ethBal.toString()
      })
    }
  }

  getTokenBalance = (etherAmount) => {
    // call buy method, pass in amount and account
    const Url = 'http://127.0.0.1:8091/getTokenBal'
    console.log(Url)
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    return fetch(Url, requestOptions)
      .then(response => response.json())
      .then(data => { 
        console.log(data) 
        return(data.result)
      })
      .catch (err => {
        console.error('Error ',err.message)
      })
  }

  buyTokens = async (etherAmount) => {
    this.setState({ loading: true })
    // call buy method, pass in amount and account
    const buyUrl = `http://127.0.0.1:8091/buyToken/${etherAmount}`
    console.log(buyUrl)
    console.log(this.state.account)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account: this.state.account})
    };

    try {
      const response = await fetch(buyUrl, requestOptions)
      console.log(response)
      const data = await response.json()
      console.log(data)
            
      let tokenBal = await this.getTokenBalance()
      console.log(tokenBal)
      if (tokenBal === undefined) {
        tokenBal = 0
      }

      let ethBal = await this.web3.eth.getBalance(this.state.account)
      console.log(ethBal)

      this.setState({ loading: false, errorFetch: null, 
         tokenBalance: tokenBal.toString(),
         ethBalance: ethBal.toString()
      })
    }      
    catch (err) {
      console.error('Error ',err.message)
      this.setState({ loading: false , errorFetch: err.message })
    }
  }

  sellTokens = async (etherAmount) => {
    this.setState({ loading: true })
    console.log(etherAmount)
    // call sell method, pass in amount and account
    const sellUrl = `http://127.0.0.1:8091/sellToken/${etherAmount}`
    console.log(sellUrl)
    console.log(this.state.account)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account: this.state.account})
    };

    try {
      const response = await fetch(sellUrl, requestOptions)
      console.log(response)
      const data = await response.json()
      console.log(data)
            
      let tokenBal = await this.getTokenBalance()
      console.log(tokenBal)
      if (tokenBal === undefined) {
        tokenBal = 0
      }

      let ethBal = await this.web3.eth.getBalance(this.state.account)
      console.log(ethBal)

      this.setState({ loading: false, errorFetch: null, 
         tokenBalance: tokenBal.toString(),
         ethBalance: ethBal.toString()
      })
    }
    catch (err) {
      console.error('Error ',err.message)
      this.setState({ loading: false , errorFetch: err.message })
    }
  }

  render(){
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }
    return (
      <div className="App">
        {content}
        
        { this.state.errorFetch && 
          <div style={{marginTop: 10 + 'em'}}> 
            {this.state.errorFetch} 
          </div> }

      </div>
    )
  }
}

export default App