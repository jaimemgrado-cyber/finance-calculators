(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function compute(v){var reg=v.hourlyRate*v.regularHours,ot=v.hourlyRate*v.overtimeHours*v.overtimeMultiplier,total=reg+ot;return {rows:[{label:"Regular pay",value:lib.fmtCurrency(reg),rawValue:reg},{label:"Overtime pay",value:lib.fmtCurrency(ot),rawValue:ot},{label:"Gross weekly pay",value:lib.fmtCurrency(total),rawValue:total,isTotal:true}]};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
