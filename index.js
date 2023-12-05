'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactMapboxAutocomplete = function (_React$Component) {
  _inherits(ReactMapboxAutocomplete, _React$Component);

  function ReactMapboxAutocomplete(props) {
    _classCallCheck(this, ReactMapboxAutocomplete);

    var _this = _possibleConstructorReturn(this, (ReactMapboxAutocomplete.__proto__ || Object.getPrototypeOf(ReactMapboxAutocomplete)).call(this, props));

    _this.state = {
      error: false,
      errorMsg: '',
      query: _this.props.query ? _this.props.query : _this.props.defaultValue,
      queryResults: [],
      publicKey: _this.props.publicKey,
      types: 'address,postcode,locality,place',
      resetSearch: false,
      language: _this.props.language
    };

    _this._updateQueryOnChange = function (event) {
      _this.setState({ query: event.target.value });
      _this.__triggerSearch();
    };

    _this._updateQueryOnPaste = function (event) {
      // this.setState({ query: event.clipboardData.getData('text') });
      _this.setState({ query: '69100' });
      _this.__triggerSearch();
    };

    _this._triggerSearch = function () {
      var header = { 'Content-Type': 'application/json' };
      var path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + _this.state.query + '.json?access_token=' + _this.state.publicKey + '&types=' + _this.state.types + '&language=' + _this.state.language;

      if (_this.props.country) {
        path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + _this.state.query + '.json?access_token=' + _this.state.publicKey + '&types=' + _this.state.types + '&language=' + _this.state.language + '&country=' + _this.props.country;
      }

      if (_this.state.query.length > 2) {
        return fetch(path, {
          headers: header
        }).then(function (res) {
          if (!res.ok) throw Error(res.statusText);
          return res.json();
        }).then(function (json) {
          _this.setState({
            error: false,
            queryResults: json.features
          });
        }).catch(function (err) {
          _this.setState({
            error: true,
            errorMsg: 'There was a problem retrieving data from mapbox',
            queryResults: []
          });
        });
      } else {
        _this.setState({
          error: false,
          queryResults: []
        });
      }
    };

    _this._resetSearch = function () {
      _this.setState({ queryResults: [] });
    };

    _this._onSuggestionSelect = function (event) {
      _this.setState({ query: event.target.getAttribute('data-suggestion') });

      _this.props.onSuggestionSelect(event.target.getAttribute('data-suggestion'), event.target.getAttribute('data-lat'), event.target.getAttribute('data-lng'), event.target.getAttribute('data-text'));
    };

    _this.setWrapperRef = _this.setWrapperRef.bind(_this);
    _this.handleClickOutside = _this.handleClickOutside.bind(_this);
    return _this;
  }

  _createClass(ReactMapboxAutocomplete, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('click', this.handleClickOutside);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('click', this.handleClickOutside);
    }
  }, {
    key: 'setWrapperRef',
    value: function setWrapperRef(node) {
      this.wrapperRef = node;
    }

    /**
     * Alert if clicked on outside of element
     */

  }, {
    key: 'handleClickOutside',
    value: function handleClickOutside(event) {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.setState({ queryResults: [] });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'container', ref: this.setWrapperRef },
        _react2.default.createElement('input', { placeholder: this.props.placeholder || 'Search',
          id: this.props.inputId,
          onClick: this.props.inputOnClick,
          onBlur: this.props.inputOnBlur,
          onFocus: this.props.inputOnFocus,
          className: this.props.inputClass ? this.props.inputClass + ' react-mapbox-ac-input form__field' : 'react-mapbox-ac-input form__field',
          onChange: this._updateQueryOnChange,
          onPaste: this._updateQueryOnPaste,
          value: this.state.query,
          type: 'text' }),
        this.state.query.length > 0 && _react2.default.createElement(
          'button',
          { className: 'react-mapbox-ac-clear-button', onClick: function onClick() {
              _this2.setState({ query: '', queryResults: [], resetSearch: true });
              _this2.props.resetSearch({ state: true, type: _this2.props.type });
            } },
          '\u2715'
        ),
        _react2.default.createElement(
          'div',
          { className: 'react-mapbox-ac-menu',
            style: this.state.queryResults.length > 0 || this.state.error ? { display: 'block' } : { display: 'none' },
            onClick: this._resetSearch },
          (0, _lodash.map)(this.state.queryResults, function (place, i) {
            return _react2.default.createElement(
              'div',
              { className: 'react-mapbox-ac-suggestion',
                onClick: _this2._onSuggestionSelect,
                key: i,
                'data-suggestion': place.place_name,
                'data-lng': place.center[0],
                'data-lat': place.center[1],
                'data-text': place.text },
              place.place_name,
              _react2.default.createElement('hr', null)
            );
          }),
          this.state.error && _react2.default.createElement(
            'div',
            { className: 'react-mapbox-ac-suggestion' },
            this.state.errorMsg
          )
        )
      );
    }
  }]);

  return ReactMapboxAutocomplete;
}(_react2.default.Component);

ReactMapboxAutocomplete.defaultProps = {
  inputId: null,
  inputOnFocus: null,
  inputOnBlur: null,
  inputOnClick: null
};

ReactMapboxAutocomplete.propTypes = {
  inputId: _propTypes2.default.string,
  inputOnFocus: _propTypes2.default.func,
  inputOnBlur: _propTypes2.default.func,
  inputOnClick: _propTypes2.default.func,
  inputClass: _propTypes2.default.string,
  publicKey: _propTypes2.default.string.isRequired,
  placeholder: _propTypes2.default.string,
  onSuggestionSelect: _propTypes2.default.func.isRequired,
  country: _propTypes2.default.string,
  query: _propTypes2.default.string,
  language: _propTypes2.default.string,
  defaultValue: _propTypes2.default.string,
  resetSearch: _propTypes2.default.func,
  type: _propTypes2.default.string
};

exports.default = ReactMapboxAutocomplete;
