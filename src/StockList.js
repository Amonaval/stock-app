import React, { Component } from 'react';
import './App.css';

class StockList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      stockData: {}
    }
  }

  getlastUpdateVal = (item, displayFormat) => {
       let lastUpdate = '';

       // Below diff is calculated here to switch the case of format
       // for customize condition
       // e.g if hours > 2 show textFormat/timeFormat

       const timeDiff = Math.abs(new Date().getTime() - item.date);
       // const days = parseInt((timeDiff / (1000 * 3600)) % 24, 10);  
       const hours = parseInt(timeDiff / (1000 * 3600), 10); 
       const mins =  Math.ceil((timeDiff / (1000 * 3600)) % 60, 10);
       
       switch(displayFormat){
          case 'textFomat':
              // Format like - few secs before, x min before, x hr y min before
              if(mins) {
                lastUpdate = (hours === 0 && mins < 2) ? 'few secs' : `${mins} min `;
              }
              if(hours) {
                lastUpdate += `${hours} hr`;
              }
              lastUpdate +=  '  before';
              break;
          case 'timeFormat':
              const itemDate = new Date(item.date);
              lastUpdate = itemDate.getHours();
              let lastupdateMins = itemDate.getMinutes();
              let lastupdateSecs = itemDate.getSeconds();
              if (lastUpdate / 12 > 1) {
                lastUpdate = `${lastUpdate % 12} : ${lastupdateMins} : ${lastupdateSecs} pm `;
              } else {
                lastUpdate = `${lastUpdate} : ${lastupdateMins} : ${lastupdateSecs} am`;
              }
              break;
          default:
             break;
       }
      return lastUpdate;
  }

  componentWillReceiveProps(prevProps) {
    let stockDataList = {...this.state.stockData};
    let currentProps = this.props.dataTick;
    currentProps.forEach((item, index) => {
      var currentStock = stockDataList[item.stockName];
      if(currentStock) {
        // Change color for positive & negative price change
        if(currentStock.stockPrice < item.stockPrice) {  
          currentStock.color = '#CD5C5C';
        }
        if(currentStock.stockPrice > item.stockPrice) {
          currentStock.color = '#90EE90';
        }
        let lastUpdate = this.getlastUpdateVal(currentStock, 'timeFormat');
        const percentageChange = Math.round((1-(currentStock.stockPrice/item.stockPrice))*100).toFixed(2);

        currentStock.date = item.date;
        currentStock.displayDate = lastUpdate;
        currentStock.stockPrice = Math.round(item.stockPrice).toFixed(3);
        currentStock[item.stockName] = Math.round(item.stockPrice).toFixed(3);
        currentStock.percentageChange = `${percentageChange} %`;
      } else {
        let newItem = item;
        stockDataList[item.stockName] = newItem;
        stockDataList[item.stockName].displayDate =  this.getlastUpdateVal(item, 'timeFormat');;
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
        <td className="update-date">{stockDataItem.displayDate}</td>
      </tr>)
    });

    return (
        <table>
          <tbody>
            <tr><th>Ticker</th><th>Price</th><th>% change</th><th>Last Update</th></tr>
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
