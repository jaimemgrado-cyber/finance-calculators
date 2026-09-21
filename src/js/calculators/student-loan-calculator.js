(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function payment(p, rate, months) { var i=rate/100/12; if(i===0) return p/months; var f=Math.pow(1+i,months); return p*i*f/(f-1); }
function compute(v){var m=payment(v.loanAmount,v.interestRate,v.termYears*12),total=m*v.termYears*12,interest=total-v.loanAmount;return {rows:[{label:"Monthly payment",value:lib.fmtCurrency(m),rawValue:m,isTotal:true},{label:"Total interest",value:lib.fmtCurrency(interest),rawValue:interest},{label:"Total repayment",value:lib.fmtCurrency(total),rawValue:total}]};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
