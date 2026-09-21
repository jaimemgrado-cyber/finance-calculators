(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function compute(v){var coupon=v.faceValue*v.couponRate/100,yieldPct=coupon/v.marketPrice*100;return {rows:[{label:"Annual coupon income",value:lib.fmtCurrency(coupon),rawValue:coupon},{label:"Current yield",value:lib.fmtNumber(yieldPct)+"%",rawValue:yieldPct,isTotal:true},{label:"Market price",value:lib.fmtCurrency(v.marketPrice),rawValue:v.marketPrice}]};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
