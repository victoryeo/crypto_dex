import React, { Component } from 'react'

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentForm: 'buy'
        }
    }
    render() {
        let content
        return (
            <div className="card mb-4" >
                <div className="card-body">
                    {content}
                </div>
            </div>
        )
    }

}

export default Main;