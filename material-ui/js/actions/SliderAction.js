var AppDispatcher = require('../dispatcher/AppDispatcher');

var Actions = {
    open: function () {
        AppDispatcher.dispatch({
            actionType: 'SliderOpen'
        });
    },
    close: function () {
        AppDispatcher.dispatch({
            actionType: 'SliderClose'
        });
    },
    toggle: function () {
        AppDispatcher.dispatch({
            actionType: 'SliderToggle'
        });
    },
};

module.exports = Actions;