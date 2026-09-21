(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function compute(v){var raise=v.currentSalary*v.raisePercent/100,n=v.currentSalary+raise;return {rows:[{label:"Raise amount",value:lib.fmtCurrency(raise),rawValue:raise},{label:"New annual salary",value:lib.fmtCurrency(n),rawValue:n,isTotal:true},{label:"Monthly gross increase",value:lib.fmtCurrency(raise/12),rawValue:raise/12}]};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
