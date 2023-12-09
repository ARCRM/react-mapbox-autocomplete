import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import './index.scss';

class ReactMapboxAutocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  state = {
    error: false,
    errorMsg: '',
    query: this.props.query ? this.props.query : this.props.defaultValue,
    queryResults: [],
    publicKey: this.props.publicKey,
    types: 'address,postcode,locality,place',
    resetSearch: false,
    language: this.props.language
  }

  _updateQueryOnChange = event => {
    this.setState({ query: event.target.value });
    this._triggerSearch();
  }

  _updateQueryOnPaste = event => {
    event.preventDefault();
    this.setState({ query: event.clipboardData.getData('text') });
    this._triggerSearch();
  }

  _triggerSearch = () => {
    const header = { 'Content-Type': 'application/json' };
    let path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json?access_token=' + this.state.publicKey + '&types=' + this.state.types + '&language=' + this.state.language;

    if (this.props.country) {
      path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json?access_token=' + this.state.publicKey + '&types=' + this.state.types + '&language=' + this.state.language + '&country=' + this.props.country;
    }

    if (this.state.query.length > 2) {
      return fetch(path, {
        headers: header,
      }).then(res => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      }).then(json => {
        this.setState({
          error: false,
          queryResults: json.features
        });
      }).catch(err => {
        this.setState({
          error: true,
          errorMsg: 'There was a problem retrieving data from mapbox',
          queryResults: []
        });
      })
    } else {
      this.setState({
        error: false,
        queryResults: []
      });
    }
  }

  _resetSearch = () => {
    this.setState({ queryResults: [] });
  }

  _onSuggestionSelect = event => {
    this.setState({ query: event.target.getAttribute('data-suggestion') });

    this.props.onSuggestionSelect(
      event.target.getAttribute('data-suggestion'),
      event.target.getAttribute('data-lat'),
      event.target.getAttribute('data-lng'),
      event.target.getAttribute('data-text')
    )
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ queryResults: [] });
    }
  }

  render() {
    return (
      <div className='container' ref={this.setWrapperRef}>
        <input placeholder={this.props.placeholder || 'Search'}
          id={this.props.inputId}
          onClick={this.props.inputOnClick}
          onBlur={this.props.inputOnBlur}
          onFocus={this.props.inputOnFocus}
          className={this.props.inputClass ?
            this.props.inputClass + ' react-mapbox-ac-input form__field'
            : 'react-mapbox-ac-input form__field'}
          onChange={this._updateQueryOnChange}
          onPaste={this._updateQueryOnPaste}
          value={this.state.query}
          type='text' />
        {this.state.query.length > 0 && (
          <button className="react-mapbox-ac-clear-button" onClick={() => {
            this.setState({ query: '', queryResults: [],  resetSearch: true })
            this.props.resetSearch({state: true, type: this.props.type})
          }}>
            &#x2715;
          </button>
        )}
        <div className='react-mapbox-ac-menu'
          style={this.state.queryResults.length > 0 || this.state.error ? { display: 'block' }
            : { display: 'none' }}
          onClick={this._resetSearch}>

          {
            map(this.state.queryResults, (place, i) => {
              return (
                <div className='react-mapbox-ac-suggestion'
                  onClick={this._onSuggestionSelect}
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

          {this.state.error && <div className="react-mapbox-ac-suggestion">{this.state.errorMsg}</div>}
        </div>
      </div>
    );
  }
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
  language: PropTypes.string,
  defaultValue: PropTypes.string,
  resetSearch: PropTypes.func,
  type: PropTypes.string
}

export default ReactMapboxAutocomplete;
