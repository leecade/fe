import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  state = {
    a: 331,
    mockData: []
  }
  show = async () => {
    // await alert(123)
  }
  componentDidMount () {
    fetch('/task-list')
      .then(res => res.json())
      .then(mockData => this.setState(Object.assign({}, this.state, { mockData })))
  }
  render () {
    this.show()
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React {this.state.a}</h2>
        </div>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          mockData: {JSON.stringify(this.state.mockData)} (from: mock/TaskList)
        </p>
      </div>
    )
  }
}

export default App
