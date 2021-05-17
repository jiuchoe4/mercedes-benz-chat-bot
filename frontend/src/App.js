import React from 'react';
import './App.css';

import Chatbox from './components/Chatbox'
import {dataExtract} from './components/dataExtract'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    this.setState({messages: ["Hi, this is your personal Mercedes-Benz assitant. How can I help you?"]})
  }

  handleMessage = (response) => {
    this.setState({messages: [...this.state.messages, response.userMessage]})
    let displayMessage = dataExtract(response)
    this.setState({messages: [...this.state.messages, displayMessage]})
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.messages.map(message => <p>{message}</p>)}
          <Chatbox callback={this.handleMessage}/>
        </header>
      </div>
    );
  }
}

export default App;