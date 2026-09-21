(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function compute(v){var assets=v.cash+v.investments+v.homeValue+v.otherAssets,n=assets-v.debts;return {rows:[{label:"Total assets",value:lib.fmtCurrency(assets),rawValue:assets},{label:"Total liabilities",value:lib.fmtCurrency(v.debts),rawValue:v.debts},{label:"Net worth",value:lib.fmtCurrency(n),rawValue:n,isTotal:true}]};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
