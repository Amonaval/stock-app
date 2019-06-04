import React, { Component } from 'react';
import _bindAll from 'lodash/bindAll';
import _isEmpty from 'lodash/isEmpty';
import axios from 'axios';
import {onlyBuyersData, onlySellerData, baseURL} from './AppConst';
import StockApp from './StockApp';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      onlyBuyer: [],
      resultStocks: [],
      currentTopLoser: [],
      removedFromOnlyBuyers: [],
      addedToOnlyBuyers: []
    };
    this.onlyBuyersInterval = null
    _bindAll(this, ['updateState', 'loadError', 'apiCallFunction', 'apiAxios']);
  }


  updateState(options) {
    this.setState({...options})
  }

  loadError(err) {
     this.setState({
          isLoaded: true,
          error: err
      });
  }

  reduceResult(total, item) {
    return total.searchresult.concat(item.searchresult);
  }

  apiAxios(method, url, body) {
      axios({
          method,
          url,
          data: body
      })
      .then(function (response) {
          console.log(response);
      })
      .catch(function (error) {
          console.log(error);
      });
  }

  apiCallFunction(apis) {
    // Use of axios & further way of implementation improvement
    // async & await
    
    if(Array.isArray(apis)) {
        let promiseArr = [];
        promiseArr = apis.map((item) => {
          return fetch(item).then(res => res.json())
        });
        return Promise.all(promiseArr).then(values => { 
          return values.reduce(this.reduceResult);
        }, (err) => {
          this.loadError(err);    
        }).catch((err) => {
          this.loadError(err);
        })
      } else {
        return fetch(apis).then(res => res.json()).then((result) => result.searchresult,
        (err) => {
          this.loadError(err);
        })
      }
  }

  componentDidMount() {

    const url = `${baseURL}${onlyBuyersData}`;

    this.onlyBuyersInterval = setTimeout(() => {
    this.apiCallFunction(url).then(result => {


        /****  Test hook *******
        var mathRandomNum = parseInt(Math.random() * (result.length-1), 10);
        result[mathRandomNum].companyName = 'newly'+ mathRandomNum;
        *******************/

        let addedToOnlyBuyers=[];
        let removedFromOnlyBuyers=[];
        let currentTopLoser = {...this.state.currentTopLoser};
        let newTopLoserResult = {};

        result.forEach(function(item){
          newTopLoserResult[item.companyName] = item.percentChange;
          if(!currentTopLoser.hasOwnProperty(item.companyName) && !_isEmpty(currentTopLoser) && newTopLoserResult.hasOwnProperty(item.companyName)) {
              addedToOnlyBuyers.push(item.companyName);
          } 
        });
        for(var key in currentTopLoser) {
            if(!newTopLoserResult.hasOwnProperty(key) && currentTopLoser.hasOwnProperty(key)) {
                removedFromOnlyBuyers.push(key);
            }
        }

        let pushOpInQueue = setTimeout(() =>  {
          const body = {
            addedToOnlyBuyers,
            removedFromOnlyBuyers
          }
          // this.apiAxios('post','/onlyBuyDiff', body);
          this.setState({currentTopLoser: newTopLoserResult, isLoaded: true, addedToOnlyBuyers: [...addedToOnlyBuyers,  ...this.state.addedToOnlyBuyers], removedFromOnlyBuyers: [...removedFromOnlyBuyers,  ...this.state.removedFromOnlyBuyers]});
          clearTimeout(pushOpInQueue);
        },0)

      }, (err) => {
        this.loadError(err);
      });
    }, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.onlyBuyersInterval);
  }
  
  render() {
    const {error, isLoaded} = this.state;

        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading.....</div>;
        } else {
          return (
            <div className="stock-app-container">
              {/*<div className="stock-list">
                <div> Added To Only Buyers </div>
                {this.state.addedToOnlyBuyers.map(op => (
                  <div key={op}>
                    {op} 
                  </div>
                ))}
                <div> Removed from Only Buyers </div>
                {this.state.removedFromOnlyBuyers.map(op => (
                  <div key={op}>
                    {op} 
                  </div>
                ))}
              </div>*/}
              <StockApp />
            </div>

          );
        }
    }
}

export default App;
