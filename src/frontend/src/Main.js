import React, { Component } from 'react'
import BuyForm from './BuyForm'

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentForm: 'buy'
        }
    }
    render() {
        let content
        if(this.state.currentForm === 'buy') {
            content = <BuyForm
              ethBalance={this.props.ethBalance}
              tokenBalance={this.props.tokenBalance}
              buyTokens={this.props.buyTokens}
            />
        }
        return (
            <div id="content" className="mt-3">
                <div className="d-flex justify-content-between mb-3">
                <button
                    className="btn btn-light"
                    onClick={(event) => {
                        this.setState({ currentForm: 'buy' })
                    }}
                    >
                    Buy
                </button>
                </div>
                <div className="card mb-4" >
                    <div className="card-body">
                        {content}
                    </div>
                </div>
            </div>
        )
    }

}

export default Main;