var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var EVENT = 'change';

var _slider = {open: false};

var Store = assign({}, EventEmitter.prototype, {
    addChangeListener: function (callback) {
        this.on(EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(EVENT, callback);
    },
    emitChange: function () {
        this.emit(EVENT);
    },
    getState: function () {
        return _slider;
    }
});

Store.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case 'SliderOpen':
            _slider.open = true;
            break;
        case 'SliderClose':
            _slider.open = false;
            break;
        case 'SliderToggle':
            _slider.open = !_slider.open;
            break;
        default:
            break;
    }

    Store.emitChange();
});

module.exports = Store;
