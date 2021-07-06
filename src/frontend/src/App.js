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
      token: {},
      ethSwap: {},
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

    if (this.web3) {
      console.log(this.web3)
      let accounts = await this.web3.eth.getAccounts()
      console.log(accounts)
      this.setState({
	      loading: false,
	      account: accounts[0]
      })
    }
  }

  buyTokens = (etherAmount) => {
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

    fetch(buyUrl, requestOptions)
      .then(response => response.json())
      .then(data => { 
        this.setState({ loading: false, errorFetch: null })
        console.log(data) 
      })
      .catch (err => {
        console.error('Error ',err.message)
        this.setState({ loading: false , errorFetch: err.message })
      })
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