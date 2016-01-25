var React = require("react");
var ReactDOM = require("react-dom");

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var App = require('./components/App.react');

ReactDOM.render(<App />, document.getElementById("main"));