
export const stockParams = "bestBuyQty, fiftyTwoWeekLowPrice, absoluteChange, value, current, bargraphValue, eventCount, bestBuyPrice, bestSellQty, volumeInThousand, fiftyTwoWeekHighPrice, percentChange, volume, high, low, bestSellPrice, highPercentGap, lowPercentGap, isPsu, belowDaysHigh, belowDaysHighPerChange, aboveDaysLow, aboveDaysLowPerChange, weekHighPrice, monthHighPrice, month3HighPrice, month6HighPrice, yearHighPrice, weekLowPrice, monthLowPrice, month3LowPrice, month6LowPrice, yearLowPrice, barGraphValue1W, barGraphValue1M, barGraphValue3M, barGraphValue6M, barGraphValue1Y, noOfShares, open, totalTradedValue";

export const mathOperator = '+,-,*,/,%,>,<,=,==, ^,(,)';

export const logicalOperator = '&&, ||, !, ?, :';

export const numbers = [0,1,2,3,4,5,6,7,8,9,'.'];


export const topLosers = 'https://etmarketsapis.indiatimes.com/ET_Stats/losers?pid=1&pageno=1&pagesize=3000&sortby=percentchange&sortorder=asc&sort=intraday&exchange=nse&duration=1d&callback=ajaxResponse'

export const topGainers = 'https://etmarketsapis.indiatimes.com/ET_Stats/gainers?pid=0&pageno=1&pagesize=3000&sortby=percentchange&sortorder=desc&sort=intraday&exchange=nse&duration=1d&callback=ajaxResponse'

export const volumeShockers = 'https://etmarketsapis.indiatimes.com/ET_Stats/volumeshocker?pageno=1&pagesize=3250&sortby=volumepercentagechange&sortorder=desc&avgvolumeover=DAY_3&exchange=50'

export const priceShockers = 'https://etmarketsapis.indiatimes.com/ET_Stats/priceshocker?pageno=1&pagesize=3250&sortby=periodicpercentchange&sortorder=desc&compareprice=DAY_3&exchange=50'

export const onlyBuyersData = '/onlyBuyersData'

export const onlySellerData = '/onlySellerData'

export const baseURL = 'http://172.24.27.209:5000'

export default {
  baseURL,
  onlyBuyersData,
  onlySellerData,
  stockParams,
  mathOperator,
  logicalOperator,
  numbers,
  topLosers,
  topGainers,
  volumeShockers,
  priceShockers
}