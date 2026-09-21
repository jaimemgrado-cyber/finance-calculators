(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function compute(v){var c=v.salesAmount*v.commissionRate/100;return {rows:[{label:"Commission",value:lib.fmtCurrency(c),rawValue:c,isTotal:true},{label:"Sales amount",value:lib.fmtCurrency(v.salesAmount),rawValue:v.salesAmount}]};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
