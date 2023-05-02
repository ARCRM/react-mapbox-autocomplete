import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import './index.scss';

const ReactMapboxAutocomplete = (props) => {

  const [state, setState] = useState({
    error: false,
    errorMsg: '',
    query: props.query ? props.query : '',
    queryResults: [],
    publicKey: props.publicKey,
    types: 'address,postcode',
    resetSearch: props.resetSearch ? props.resetSearch : false
  })

  const targetRef = useRef(null);

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


  return (
    <div className='container' ref={targetRef}>
      <input placeholder={props.placeholder || 'Search'}
        id={props.inputId}
        onClick={props.inputOnClick}
        onBlur={props.inputOnBlur}
        onFocus={props.inputOnFocus}
        className={props.inputClass ?
          props.inputClass + ' react-mapbox-ac-input form__field'
          : 'react-mapbox-ac-input form__field'}
        // onChange={_updateQuery}
        value={state.query}
        type='text' />
      <div className='react-mapbox-ac-menu'
        style={state.queryResults.length > 0 || state.error ? { display: 'block' }
          : { display: 'none' }}
        // onClick={_resetSearch}>
        >

        {
          map(state.queryResults, (place, i) => {
            return (
              <div className='react-mapbox-ac-suggestion'
                // onClick={_onSuggestionSelect}
                key={i}
                data-suggestion={place.place_name}
                data-lng={place.center[0]}
                data-lat={place.center[1]}
                data-text={place.text}>
                {place.place_name}
                <hr></hr>
              </div>
            )
          })
        }

        {state.error && <div className="react-mapbox-ac-suggestion">{state.errorMsg}</div>}
      </div>
    </div>
  );
}


ReactMapboxAutocomplete.defaultProps = {
  inputId: null,
  inputOnFocus: null,
  inputOnBlur: null,
  inputOnClick: null
};

ReactMapboxAutocomplete.propTypes = {
  inputId: PropTypes.string,
  inputOnFocus: PropTypes.func,
  inputOnBlur: PropTypes.func,
  inputOnClick: PropTypes.func,
  inputClass: PropTypes.string,
  publicKey: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onSuggestionSelect: PropTypes.func.isRequired,
  country: PropTypes.string,
  query: PropTypes.string,
  resetSearch: PropTypes.bool
}

export default ReactMapboxAutocomplete;
