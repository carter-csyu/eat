import React, { Component } from 'react';
import RestaurentInfo from './RestaurantInfo';
import { withRouter } from 'react-router-dom';
import { List } from 'immutable';
import './DaumMap.css';

class DaumMap extends Component {
  state = {
    modal: null,
    search: '',
    map: null,
    ps: null,
    customOverlay: null,
    circle: null,
    markers: List([]),
    places: List([]),
    placeId: null
  }

  componentDidMount() {
    const { modal } = this;
    const { chips, drawMap } = this;
    const instance = window.M.Chips.init(chips, {});
    const mInstance = window.M.Modal.init(modal, {
      endingTop: '0%'
    });
    
    this.setState({
      modal: mInstance
    });

    // Handling browser back button.
    window.onpopstate = this.handleBrowserBackBtn.bind(this);

    drawMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps) === JSON.stringify(this.props) ) return false;

    const { match } = this.props;

    this.setState({
      search: match.params.keyword 
    }, () => {
      this.triggerKeywordSearch(List([match.params.keyword]));    
    });
  }

  handleBrowserBackBtn = (e) => {
    const { match } = this.props;
    const { modal } = this.state;

    e.preventDefault();

    if (modal.isOpen) {
      modal.close();
    }
  }


  handlePlaceClick = (place, idx) => {
    const { history } = this.props;
    const { map, customOverlay } = this.state;

    this.displayInfowindow(map, place, customOverlay, history);
  }

  handleChange = (e) => {
    this.setState({
      search: e.target.value
    });
  }

  handleKeyPress = (e) => {
    if (e.charCode === 13) {
      this.props.history.push(`/map/${this.state.search}`);
    }
  }

  handleCloseClick = () => {
    this.setState({
      search: ''
    });
  }

  handleRestaurentModalClose = () => {
    const { modal } = this.state;
    const { history, match } = this.props;

    modal.close();
  }

  triggerKeywordSearch = (keywords) => {
    const { map, ps, customOverlay, circle } = this.state;
    const { keywordSearchCB } = this;
    const option = {
      location: map.getCenter(),
      category_group_code: 'FD6',
      radius: 1000,
      page: 1,
      sort: window.daum.maps.services.SortBy.DISTANCE
    };

    // set init
    customOverlay.setMap(null);
    this.clearMarkers();

    // 검색영역 표시
    circle.setPosition(map.getCenter());

    if (keywords.size > -1) {
      keywords.forEach((keyword) => {
        ps.keywordSearch(keyword, keywordSearchCB, option);
      });
    }
  };

  keywordSearchCB = (result, status, pagination) => {
    if (status === window.daum.maps.services.Status.OK) {
        for (let i=0; i < result.length; i++) {
          this.createMarker(result[i]);
        }

        if (pagination.hasNextPage) {
          pagination.nextPage();
        }
    } else if (window.daum.maps.services.Status.ZERO_RESULT) {
      const { selected } = this.props;
      let toastContent = '';

      if (selected !== null && selected.size > 0) {
        toastContent = `주변에 ${selected.get(0)}를 판매하는 음식점이 없습니다`;
      } else {
        toastContent = '주변에 음식점이 없습니다.';
      }

      window.M.toast({
        html: toastContent,
        inDuration: 300,
        outDuration: 375,
        activationPercent: 0.8
      });
    }
  }

  drawMap = () => {
    const options = {
      center: new window.daum.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
      level: 3 // 지도의 확대 레벨
		};

    this.setState({
      map: new window.daum.maps.Map(this.daumMap, options),
      ps: new window.daum.maps.services.Places(),
      customOverlay: new window.daum.maps.CustomOverlay({
        yAnchor: 1
      }),
      circle: new window.daum.maps.Circle({
        radius: 1000, // 미터 단위의 원의 반지름입니다
        strokeWeight: 1, // 선의 두께입니다
        strokeColor: '#75B8FA', // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid', // 선의 스타일 입니다
        fillColor: '#CFE7FF', // 채우기 색깔입니다
        fillOpacity: 0.4  // 채우기 불투명도 입니다
      })
    }, () => {
      // 현재 접속 위치 정보
      if (navigator.geolocation && true) {
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude; // 위도
          const lon = position.coords.longitude; // 경도
          const locPosition = new window.daum.maps.LatLng(lat, lon);

          // 지도에 원을 표시합니다
          this.state.circle.setMap(this.state.map);

          this.state.map.setCenter(locPosition);
          this.afterDrawMap();
         });
      } else {
        /*
          팬코타워
          latitude: 37.56081428335535
          longitude:
        */
        const lat = 37.56081428335535;
        const lon = 126.8394108875395;
        const locPosition = new window.daum.maps.LatLng(lat, lon);

        this.state.map.setCenter(locPosition);
        this.afterDrawMap();
      }

      window.daum.maps.event.addListener(this.state.map, 'center_changed', () => {

        // this.state.circle.setPosition(this.state.map.getCenter());
      });
    });
  }

  afterDrawMap = () => {
    const { match, selected } = this.props;

    // 파라미터가 존재할 경우 (keyword 존재)
    if (match.params.keyword && match.params.keyword !== "") {
      this.setState({
        search: match.params.keyword
      });

      this.clearMarkers();
      this.triggerKeywordSearch(List([match.params.keyword]));

      return;
    }

    // 선택 된 카테고리가 존재할 경우
    if (selected !== null && selected.size > 0) {
      this.setState({
        search: selected.get(0)
      });

      this.triggerKeywordSearch(selected);
    }
  }

  clearMarkers = () => {
    const { markers } = this.state;
    
    markers.forEach((marker) => {
      marker.setMap(null);
    });

    this.setState({
      markers: List([]),
      places: List([]),
    });
  }

  handleSetCenterClick = () => {
    const { map } = this.state;

    // 현재 접속 위치 정보
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        const locPosition = new window.daum.maps.LatLng(lat, lon);

        map.setCenter(locPosition);
       });
    } else {
      window.M.toast({
        html: '위치정보를 가져올 수 없습니다.',
        inDuration: 300,
        outDuration: 375,
        activationPercent: 0.8
      });
    }
  }

  createMarker = (place) => {
    const { map, customOverlay, markers, places } = this.state;
    const { history } = this.props;
    const markerImage = new window.daum.maps.MarkerImage(
      'http://icons.iconarchive.com/icons/paomedia/small-n-flat/128/map-marker-icon.png',
      new window.daum.maps.Size(34, 34),
      {offset: new window.daum.maps.Point(17, 34)});

    // 마커를 생성하고 지도에 표시합니다
    const marker = new window.daum.maps.Marker({
        position: new window.daum.maps.LatLng(place.y, place.x),
        image: markerImage
    });

    this.setState({
      markers: markers.push(marker),
      places: places.push(place)
    });

    marker.setMap(map);

    window.daummap = {
      map: map
    };

    // 마커에 클릭이벤트를 등록합니다
    window.daum.maps.event.addListener(marker, 'click', () => {
      this.displayInfowindow(map, place, customOverlay, history);
    });
  }

  displayInfowindow = (map, place, customOverlay, history) => {
    const locPosition = new window.daum.maps.LatLng(place.y, place.x);
    const { modal } = this.state;

    map.setCenter(locPosition);
    map.setLevel(2);

    customOverlay.setMap(map);
    customOverlay.setPosition(locPosition);
    customOverlay.setContent(
      '<div id="co" class="customoverlay">' +
      '  <a>' +
      '    <span class="title">' + place.place_name + '</span>' +
      '  </a>' +
      '</div>');

    // Native Dom Event Listener
    const co = document.getElementById('co');
    co.addEventListener('click', () => {
      this.setState({
        placeId: place.id
      });
      modal.open();
    });
  }

  render() {
    const { handleChange, handleKeyPress, handleCloseClick, handlePlaceClick, handleSetCenterClick, handleRestaurentModalClose } = this;
    const { search, places, placeId } = this.state;
    const placeItems = places.sort((a, b) => {
      if (a.distance > b.distance) return 1;
      if( a.distance < b.distance) return -1;
      return 0;
    }).map(
      (place, idx) => {
        const { id, category_name, distance, phone, place_name, road_address_name, x, y } = place;

        return (
          <a key={idx} onClick={() => handlePlaceClick(place)} className="collection-item"><span className="new badge" data-badge-caption="m">{distance}</span>[{category_name.split(' > ')[1]}] {place_name}</a>
        );
      }
    );

    return (
      <div className='map-wrapper'>
        <nav>
          <div className='nav-wrapper blue-grey darken-4'>
              {
                /*
                <div className="chips search-chips" ref={ref => { this.chips = ref}}></div>
                */
              }
            <div className='input-field'>
              <input
                type='search'
                name='search'
                value={search}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                required />
              <label className='label-icon'><i className='material-icons'>search</i></label>
              <i className='material-icons' onClick={handleCloseClick} >close</i>
            </div>
          </div>
        </nav>
        <i className="material-icons red-text text-darken-4 map-pointer">place</i>
        <i className="material-icons indigo-text text-darken-4 map-current-pos"
          onClick={handleSetCenterClick}>gps_fixed</i>
        <div className="map-content" ref={ref => { this.daumMap = ref}}></div>
        <div className="content-list">
          <div className="collection place-info">
            {placeItems}
          </div>
        </div>

        <div ref={ref => { this.modal = ref }} className="modal modal-restaurant">
          <div className="modal-content modal-content-restaurant">
            <RestaurentInfo placeId={placeId} />
          </div>
          <div className="fixed-action-btn btn-restaurant-close">
            <a className="btn-floating red" onClick={handleRestaurentModalClose}>
              <i className="large material-icons">close</i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DaumMap);
