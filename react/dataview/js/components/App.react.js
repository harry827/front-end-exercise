var Header = require('./Header.react');
//var MainSection = require('./MainSection.react');
var React = require('react');
//var TodoStore = require('../stores/TodoStore');

function getTodoState() {
    return {
        //allTodos: TodoStore.getAll(),
        //areAllComplete: TodoStore.areAllComplete()
    };
}

var App = React.createClass({

    _onChange: function () {
        //this.setState(getTodoState());
    },
    getInitialState: function () {
        return {};
        //return getTodoState();
    },

    componentDidMount: function () {
        //TodoStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        //TodoStore.removeChangeListener(this._onChange);
    },

    render: function () {
        return (
            <div>
                <Header />
            </div>
        );
    }

});

module.exports = App;
