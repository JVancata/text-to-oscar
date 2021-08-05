const { getFullMacro } = require("./lib.js");
const fs = require('fs');

const fileName = "textmacro.amc";

const text = "Test.";

const fullMacro = getFullMacro(text);
fs.writeFileSync(fileName, fullMacro);