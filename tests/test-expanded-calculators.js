const fs=require("fs"),path=require("path");
const data=require("../build/data/calculators.js");
let pass=0,fail=0;function ok(n,c,d){if(c)pass++;else{fail++;console.log("FAIL:",n,d||"");}}
data.slice(-20).forEach(c=>{try{const fn=require(path.join("..","src","js","calculators",c.jsFile));const v={};c.fields.forEach(f=>v[f.id]=Number(f.default)||0);const r=fn(v);ok(c.slug,!!r&&!r.error,r&&r.error)}catch(e){ok(c.slug,false,e.message)}});console.log(`\n${pass} passed, ${fail} failed`);if(fail)process.exit(1);
