
export const onlyBuyersData = 'https://etmarketsapis.indiatimes.com/ET_Stats/onlybuyer?pagesize=1000&pid=4&exchange=nse&pageno=1&service=buyers&sortby=bestBuyQty&sortorder=desc&callback=ajaxResponse'
export const onlySellerData = 'https://etmarketsapis.indiatimes.com/ET_Stats/onlyseller?pid=4&pageno=1&pagesize=1000&sortby=bestSellQty&sortorder=desc&service=sellers&exchange=nse&callback=ajaxResponse'

export default {
  onlyBuyersData,
  onlySellerData
}