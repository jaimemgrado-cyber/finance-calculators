(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function compute(v){var gain=v.salePrice-v.purchasePrice,tax=gain>0?gain*v.taxRate/100:0;return {rows:[{label:"Capital gain / loss",value:lib.fmtCurrency(gain),rawValue:gain,isTotal:true},{label:"Illustrative tax",value:lib.fmtCurrency(tax),rawValue:tax},{label:"After-tax proceeds (illustrative)",value:lib.fmtCurrency(v.salePrice-tax),rawValue:v.salePrice-tax}]};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
