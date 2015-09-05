require("babel/register");
var setting = require("./webpack.common");

setting.devtool = "source-map";

module.exports = setting;
