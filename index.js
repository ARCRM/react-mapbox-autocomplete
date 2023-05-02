'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactMapboxAutocomplete = function ReactMapboxAutocomplete(props) {
  var _useState = (0, _react.useState)({
    error: false,
    errorMsg: '',
    query: props.query ? props.query : '',
    queryResults: [],
    publicKey: props.publicKey,
    types: 'address,postcode',
    resetSearch: props.resetSearch ? props.resetSearch : false
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var targetRef = (0, _react.useRef)(null);

  // const _updateQuery = (event) => {
  //   setState(state => ({ ...state, query: event.target.value }));
  //   const header = { 'Content-Type': 'application/json' };
  //   let path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + state.query + '.json?access_token=' + state.publicKey + '&types=' + state.types;

  //   if (props.country) {
  //     path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + state.query + '.json?access_token=' + state.publicKey + '&types=' + state.types + '&country=' + props.country;
  //   }

  //   if (state.query.length > 2) {
  //     return fetch(path, {
  //       headers: header,
  //     }).then(res => {
  //       if (!res.ok) throw Error(res.statusText);
  //       return res.json();
  //     }).then(json => {
  //       setState(state => ({
  //         ...state,
  //         error: false,
  //         queryResults: json.features
  //       }));
  //     }).catch(err => {
  //       setState(state => ({
  //         ...state,
  //         error: true,
  //         errorMsg: 'There was a problem retrieving data from mapbox',
  //         queryResults: []
  //       }));
  //     })
  //   } else {
  //     setState(state => ({
  //       ...state,
  //       error: false,
  //       queryResults: []
  //     }));
  //   }
  // }

  // const _resetSearch = () => {
  //   if (state.resetSearch) {
  //     setState(state => ({
  //       ...state,
  //       query: '',
  //       queryResults: []
  //     }));
  //   } else {
  //     setState(state => ({ ...state, queryResults: [] }));
  //   }
  // }

  // const _onSuggestionSelect = (event) => {
  //   if (state.resetSearch === false) {
  //     setState(state => ({ ...state, query: event.target.getAttribute('data-suggestion') }));
  //   }

  //   props.onSuggestionSelect(
  //     event.target.getAttribute('data-suggestion'),
  //     event.target.getAttribute('data-lat'),
  //     event.target.getAttribute('data-lng'),
  //     event.target.getAttribute('data-text')
  //   )
  // }

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     console.log(targetRef.current)
  //     if (targetRef.current && !targetRef.current.contains(event.target)) {
  //       setIsReset(true);
  //     }
  //   }

  //   document.addEventListener("click", handleClickOutside, { capture: true });

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, { capture: true });
  //   };
  // }, [targetRef]);


  return _react2.default.createElement(
    'div',
    { className: 'container', ref: targetRef },
    _react2.default.createElement('input', { placeholder: props.placeholder || 'Search',
      id: props.inputId,
      onClick: props.inputOnClick,
      onBlur: props.inputOnBlur,
      onFocus: props.inputOnFocus,
      className: props.inputClass ? props.inputClass + ' react-mapbox-ac-input form__field' : 'react-mapbox-ac-input form__field'
      // onChange={_updateQuery}
      , value: state.query,
      type: 'text' }),
    _react2.default.createElement(
      'div',
      { className: 'react-mapbox-ac-menu',
        style: state.queryResults.length > 0 || state.error ? { display: 'block' } : { display: 'none' }
        // onClick={_resetSearch}>
      },
      (0, _lodash.map)(state.queryResults, function (place, i) {
        return _react2.default.createElement(
          'div',
          { className: 'react-mapbox-ac-suggestion'
            // onClick={_onSuggestionSelect}
            , key: i,
            'data-suggestion': place.place_name,
            'data-lng': place.center[0],
            'data-lat': place.center[1],
            'data-text': place.text },
          place.place_name,
          _react2.default.createElement('hr', null)
        );
      }),
      state.error && _react2.default.createElement(
        'div',
        { className: 'react-mapbox-ac-suggestion' },
        state.errorMsg
      )
    )
  );
};

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
  resetSearch: _propTypes2.default.bool
};

exports.default = ReactMapboxAutocomplete;
