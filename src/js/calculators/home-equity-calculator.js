(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function compute(v){var debt=v.mortgageBalance+v.otherLiens,e=v.homeValue-debt,ltv=debt/v.homeValue*100;if(e<0)e=e;return {rows:[{label:"Home equity",value:lib.fmtCurrency(e),rawValue:e,isTotal:true},{label:"Secured debt",value:lib.fmtCurrency(debt),rawValue:debt},{label:"Loan-to-value ratio",value:lib.fmtNumber(ltv)+"%",rawValue:ltv}],note:"Equity is home value minus secured debt; borrowing capacity depends on lender rules."};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
