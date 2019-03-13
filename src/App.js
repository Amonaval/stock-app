import React, { Component } from 'react';
import StockList from './StockList'
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      stockData: [],
      connectionState: 0
    }
  }

  componentDidMount() {
    const websocketurl = "ws://stocks.mnet.website";
    const socket = new WebSocket(websocketurl);
    this.setState({connectionState: socket.readyState})
    socket.onclose = () => this.setState({connectionState: socket.readyState});
    socket.onmessage = (message) => {
      this.setState({connectionState: socket.readyState})
      let modifiedItems = [];
      const stockList = message && message.data && JSON.parse(message.data);
      stockList && stockList.forEach((data, i) => {
        let obj = {}
        obj.stockName = data[0];
        obj.stockPrice = data[1];
        obj[data[0]] = data[1];
        obj.color = '';
        obj.date = new Date().getTime();
        modifiedItems.push(obj);
      })

      this.setState((state, props) => ({
        stockData: modifiedItems
      }));
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.connectionState === 1 && <div className="stock-analyze">
            <h2>Live Stock Ticker App</h2>
              <StockList dataTick={this.state.stockData} />
          </div>}
          {this.state.connectionState > 1 && <div>
             Unable to establish socket connection. Please check internet or 
             proxy settings of your machine
          </div>}
          {this.state.connectionState === 0 && <div>
             Connecting...
          </div>}
        </header>
      </div>
    );
  }
}

export default App;
