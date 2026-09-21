(function(global){"use strict";
var lib = (typeof module !== "undefined" && module.exports) ? require("./_lib.js") : {fmtCurrency:fmtCurrency,fmtNumber:fmtNumber,isSafe:isSafe};
function compute(v){if(v.sellingPrice<=0)return {error:"Selling price must be greater than zero."};var p=v.sellingPrice-v.cost,markup=p/v.cost*100,margin=p/v.sellingPrice*100;if(v.cost<=0)return {error:"Cost must be greater than zero."};return {rows:[{label:"Gross profit",value:lib.fmtCurrency(p),rawValue:p},{label:"Markup",value:lib.fmtNumber(markup)+"%",rawValue:markup},{label:"Margin",value:lib.fmtNumber(margin)+"%",rawValue:margin,isTotal:true}]};}
if(typeof module!=="undefined"&&module.exports){module.exports=compute;}else{global.CalcCompute=compute;}})(typeof window!=="undefined"?window:globalThis);
