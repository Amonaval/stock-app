import React, { Component } from 'react';
import './App.css';

class StockList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      stockData: {}
    }
  }

  componentWillReceiveProps(prevProps) {
    let stockDataList = {...this.state.stockData};
    let currentProps = this.props.dataTick;
    currentProps.forEach((item, index) => {
      var currentStock = stockDataList[item.stockName];
      if(currentStock) {
        if(currentStock.stockPrice < item.stockPrice) {  
          currentStock.color = '#CD5C5C';
        }
        if(currentStock.stockPrice > item.stockPrice) {
          currentStock.color = '#90EE90';
        }
        const timeDiff = Math.abs(new Date().getTime() - item.date);
        // const days = parseInt((timeDiff / (1000 * 3600)) % 24, 10); 
        const hours = parseInt(timeDiff / (1000 * 3600), 10); 
        const mins =  Math.ceil((timeDiff / (1000 * 3600)) % 60, 10);
        let lastUpdate = '';
        if(mins) {
          lastUpdate = (hours === 0 && mins < 5) ? 'few secs' : `${mins} min `;
        }
        if(hours) {
          lastUpdate += `${hours} hr`;
        }
        
        lastUpdate +=  '  before';
        const percentageChange = Math.round((1-(currentStock.stockPrice/item.stockPrice))*100).toFixed(2);
        currentStock.date = lastUpdate;
        currentStock.stockPrice = Math.round(item.stockPrice).toFixed(3);
        currentStock[item.stockName] = Math.round(item.stockPrice).toFixed(3);
        currentStock.percentageChange = `${percentageChange} %`;
      } else {
        let newItem = item;
        newItem.color = '';
        stockDataList[item.stockName] = newItem;
        // stockDataList[item.stockName].date = new Date().toUTCString();
        let lastupdate = new Date(item.date).getHours();
        let lastupdateMins = new Date(item.date).getMinutes();
        lastupdate = (lastupdate/12 > 1) ? `${lastupdate % 12}:${lastupdateMins} pm` : `${lastupdate}:${lastupdateMins} am`;
        stockDataList[item.stockName].date = lastupdate;
        stockDataList[item.stockName].stockPrice = Math.round(item.stockPrice).toFixed(3);
      }
    });

    this.setState({stockData: stockDataList});
  }
  
  listItems = () => {

    const stockData = this.state.stockData;
    const itemArr = [...Object.getOwnPropertyNames(stockData)];
    
    const tabItems = itemArr.map(item => {
      const stockDataItem = stockData[item];
      return (<tr key={stockDataItem.stockName}>
        <td>{stockDataItem.stockName}</td>
        <td bgcolor={stockDataItem.color}>{stockDataItem.stockPrice}</td>
        <td color={stockDataItem.color}>{stockDataItem.percentageChange}</td>
        <td className="update-date">{stockDataItem.date}</td>
        </tr>)
    });

    return (
        <table>
          <tbody>
            <tr><th>Ticker</th><th>Price</th><th>% change</th><th>Last Update    </th></tr>
            {tabItems}
          </tbody>
        </table>
      );
  }

  render() {
    return (
      <div className="stock-list">
        {this.listItems()}
      </div>
    );
  }
}

export default StockList;
