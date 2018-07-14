import React, { Component } from 'react';

class RestaurantInfo extends Component {
  state = {
    id: '',
    url: ''
  }

  componentDidMount() {
    const { match } = this.props;
    const baseUrl = 'http://place.map.daum.net/';

    if (match && match.params.id && match.params.id !== "") {
      this.setState({
        id: match.params.id,
        url: baseUrl + match.params.id
      }, () => {
        this.updateIframe();
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { placeId } = this.props;
    const baseUrl = 'http://place.map.daum.net/';


    if (JSON.stringify(prevProps) === JSON.stringify(this.props) ) return false;

    if (placeId && placeId !== "") {
      this.setState({
        id: placeId,
        url: baseUrl + placeId
      }, () => {
        this.updateIframe();
      });
    }
  }

  updateIframe = () => {
    const { url } = this.state;
    const { iframe } = this;

    iframe.src = url;
  }

  render() {
    const { url } = this.props;
    const style = {
      display: 'block',
      height: '100%',
      width: '100%',
      border: 0
    };

    return (
      <iframe title="restaurantIframe" style={style} ref={ref => { this.iframe = ref}} url={url} />
    );
  }
}

RestaurantInfo.defaultProps = {
  url: 'http://place.map.daum.net/'
};

export default RestaurantInfo;
