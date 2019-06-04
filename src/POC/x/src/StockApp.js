import React, { Component } from 'react';
import _bindAll from 'lodash/bindAll';
import _isEmpty from 'lodash/isEmpty';
import {topLosers, topGainers, volumeShockers, priceShockers, mathOperator, logicalOperator, stockParams, numbers} from './AppConst';

class StockApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      mathOps: mathOperator.split(','), 
      logicalOps: logicalOperator.split(','), 
      stockParamOps: stockParams.split(','),
      displayExpression: '',
      evalExpression: '',
      resultStocks: [],
      volumeShock: [],
      showVolumeShocker: false,
      priceShock: [],
      showPriceShocker: false,
      operationItems: []
    };
    _bindAll(this, ['mathOperationClick', 'logicalOperationClick', 
      'stockParamClick', 'updateState', 'executeExp', 'clearExp', 'loadError',
      'backSpace', 'reduceResult', 'apiCallFunction', 'priceshocker', 'volumeShocker']);
  }

  opertationItems(op, disp) {
    const opItems = [...this.state.operationItems];
    if(disp) {
      opItems.push({[op]: disp});
    } else {
      opItems.push(op);
    }
    this.setState({operationItems: opItems}); 
  }

  mathOperationClick(e) {
    this.opertationItems(e.target.innerText);
    const displayExpression = this.state.displayExpression.concat(e.target.innerText + '  ');
    const evalExpression = this.state.evalExpression.concat(e.target.innerText);
    this.updateState({displayExpression, evalExpression})
  }

  logicalOperationClick(e) {
    this.opertationItems(e.target.innerText);
    const displayExpression = this.state.displayExpression.concat(e.target.innerText + '  ');
    const evalExpression = this.state.evalExpression.concat(e.target.innerText)
    this.updateState({displayExpression, evalExpression})
  }

  stockParamClick(e) {
    this.opertationItems(e.target.innerText, `item.${e.target.innerText}`);
    const displayExpression = this.state.displayExpression.concat(e.target.innerText + '  ');
    const evalExpression = this.state.evalExpression.concat(`item.${e.target.innerText}`);
    this.updateState({displayExpression, evalExpression})
  }

  updateState(options) {
    this.setState({...options})
  }

  backSpace() {
    let {displayExpression, evalExpression, operationItems} = this.state;
    const opItems = [...operationItems];
    const item = opItems.pop();
    let lastIndex1 = 0;
    let lastIndex2 = 0;
    if(typeof item == "object") {
      lastIndex1 = evalExpression.lastIndexOf(item[Object.keys(item)[0]]);
      lastIndex2 = displayExpression.lastIndexOf(Object.keys(item)[0]);
    } else {
      lastIndex1 = evalExpression.lastIndexOf(item);
      lastIndex2 = displayExpression.lastIndexOf(item);  
    }
    evalExpression = evalExpression.substring(0, lastIndex1);
    displayExpression = displayExpression.substring(0, lastIndex2);
    this.updateState({displayExpression, evalExpression, operationItems: opItems})
  }

  clearExp() {
    const displayExpression = '';
    const evalExpression = '';
    this.updateState({displayExpression, evalExpression})
  }

  executeExp() {
    const resultStocks = this.state.items.filter((item) => {
       const {evalExpression} = this.state;
       return eval(evalExpression);
    });
    this.setState({resultStocks});
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

  apiCallFunction(apis, stateParam) {
    const that = this;
    if(Array.isArray(apis)) {
        let promiseArr = [];
        promiseArr = apis.map((item) => {
          return fetch(item).then(res => res.json())
        });
        Promise.all(promiseArr).then(values => { 
          const result = values.reduce(this.reduceResult);
          stateParam[Object.keys(stateParam)[0]] = result;
          that.updateState({
              isLoaded: true,
              ...stateParam
          });
        }, (err) => {
          this.loadError(err);    
        }).catch((err) => {
          this.loadError(err);
        })
      } else {
        fetch(apis).then(res => res.json()).then((result) =>
        {
            stateParam[Object.keys(stateParam)[0]] = result.searchresult;
            that.updateState({
                isLoaded: true,
                ...stateParam
            });
        }, (err) => {
          this.loadError(err);
        })
      }
  }

  priceshocker() {
    this.setState({showPriceShocker: !this.state.showPriceShocker, showVolumeShocker: false});
  }

  volumeShocker() {
    this.setState({showVolumeShocker: !this.state.showVolumeShocker, showPriceShocker: false});
  }

  componentDidMount() {
    this.apiCallFunction([topLosers, topGainers], {items: []});
    this.apiCallFunction(volumeShockers, {volumeShock: []});
    this.apiCallFunction(priceShockers, {priceShock: []});
  }
  
  render() {
    const {error, isLoaded, mathOps, logicalOps, stockParamOps, displayExpression} = this.state;

        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
          return (
            <div className="stock-app-container">
              <div className="display-expression">
                Display Expression: {displayExpression}
              </div>
              <div className="btn-container">
                <div className="btn" onClick={this.executeExp}>Execute
                </div>
                <div className="btn" onClick={this.clearExp}> Clear
                </div>
                <div className="btn" onClick={this.backSpace}> Backspace
                </div>
                <div className="btn" onClick={this.volumeShocker}> Show Volume Shocker
                </div>
                <div className="btn" onClick={this.priceshocker}> Show Price Shocker
                </div>
              </div>
              
              <div className="expression-params">
                <div className="expression-type">Numbers</div>
                <div className="flex-container">
                  {numbers.map(op => (
                    <div onClick={this.logicalOperationClick  } key={op}>
                      {op}
                    </div>
                  ))}
                </div>
                <div className="expression-type">Maths Operators</div>
                <div className="flex-container">
                  {mathOps.map(op => (
                    <div onClick={this.mathOperationClick} key={op}>
                      {op}
                    </div>
                  ))}
                </div>
                <div className="expression-type">Logical Operators</div>
                <div className="flex-container">
                  {logicalOps.map(op => (
                    <div onClick={this.logicalOperationClick} key={op}>
                      {op}
                    </div>
                  ))}
                </div>
                <div className="expression-type">Stock Parameters</div>
                <div className="flex-container">
                  {stockParamOps.map(op => (
                    <div onClick={this.stockParamClick} key={op}>
                      {op}
                    </div>
                  ))}
                </div>
              </div>
              <div className="stock-list">
                {this.state.resultStocks.map(op => (
                  <div key={op.companyShortName}>
                    {op.companyShortName} {op.current}
                  </div>
                ))}

                {this.state.showPriceShocker && this.state.priceShock.map(op => (
                  <div key={op.companyShortName}>
                    {op.companyShortName} {op.current}
                  </div>
                ))}
                {this.state.showVolumeShocker && this.state.volumeShock.map(op => (
                  <div key={op.companyShortName}>
                    {op.companyShortName} {op.current}
                  </div>
                ))}
              </div>
            </div>

          );
        }
    }
}

export default StockApp;
