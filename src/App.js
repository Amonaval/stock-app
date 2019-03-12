import React, { Component } from 'react';
import StockList from './StockList'
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      stockData: []
    }
  }

  componentDidMount() {
    const websocketurl = "ws://stocks.mnet.website";
    const socket = new WebSocket(websocketurl);
    socket.onopen = () => this.setState({connected: true});
    socket.onclose = () => this.setState({connected: false});
    socket.onmessage = (message) => {

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
          <div className="stock-analyze">
            <h2>Live Stock Ticker App</h2>
            <StockList dataTick={this.state.stockData} />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
