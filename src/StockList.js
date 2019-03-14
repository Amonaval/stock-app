import React, { Component } from 'react';
import './App.css';
import {displayDateFormat, colorPriceChange, TABLE_HEADING} from './App.config';

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

      //  const testDate = 1552532183984
       const timeDiff = Math.abs(new Date().getTime() - item.date);
       // const days = parseInt((timeDiff / (1000 * 3600)) % 24, 10);  
       const hours = parseInt(timeDiff / (1000 * 3600), 10); 
       const mins =  Math.ceil((timeDiff / (1000 * 3600)) % 60, 10);
       
       switch(displayFormat){
          case displayDateFormat.TEXT_FORMAT:
              // Format like - few secs before, x min before, x hr y min before
              if(mins) {
                lastUpdate = (hours === 0 && mins < 5 && mins > 1) ? 'few mins' : `${mins} min `;
              }
              if(hours) {
                lastUpdate += `${hours} hr`;
              }
              lastUpdate +=  '  ago';
              break;
          case displayDateFormat.TIME_FORMAT:
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
          currentStock.color = colorPriceChange.RED;
        }
        if(currentStock.stockPrice > item.stockPrice) {
          currentStock.color = colorPriceChange.GREEN;
        }
        let lastUpdate = this.getlastUpdateVal(currentStock, displayDateFormat.TIME_FORMAT);
        const percentageChange = Math.round(((currentStock.stockPrice/item.stockPrice)-1)*100).toFixed(2);

        currentStock.date = item.date;
        currentStock.displayDate = lastUpdate;
        currentStock.stockPrice = Math.round(item.stockPrice).toFixed(3);
        currentStock[item.stockName] = Math.round(item.stockPrice).toFixed(3);
        currentStock.percentageChange = `${percentageChange} %`;
      } else {
        let newItem = item;
        stockDataList[item.stockName] = newItem;
        stockDataList[item.stockName].displayDate =  this.getlastUpdateVal(item, displayDateFormat.TIME_FORMAT);
        stockDataList[item.stockName].stockPrice = Math.round(item.stockPrice).toFixed(3);
      }
    });

    this.setState((state) => ({
      stockData: stockDataList
    }));
  }
  
  listItems = () => {
    const stockData = this.state.stockData;
    const itemArr = [...Object.getOwnPropertyNames(stockData)];
    const tabItems = itemArr.map(item => {
      const stockDataItem = stockData[item];
      return (<tr key={stockDataItem.stockName}>
        <td>{stockDataItem.stockName}</td>
        <td bgcolor={stockDataItem.color}>{stockDataItem.stockPrice}</td>
        <td>{stockDataItem.percentageChange}</td>
        <td className="update-date">{stockDataItem.displayDate}</td>
      </tr>)
    });

    return (
        <table>
          <tbody>
            <tr>
              <th>{TABLE_HEADING.TICKER}</th>
              <th>{TABLE_HEADING.PRICE}</th>
              <th>{TABLE_HEADING.PERCENT_CHANGE}</th>
              <th>{TABLE_HEADING.LAST_UPDATE}</th>
            </tr>
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
