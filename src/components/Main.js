import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { List } from 'immutable';
import './Main.css';

class Main extends Component {
  state = {
    modal: null,
    activeId: -1,
    randomStyle: {
      display: 'none'
    },
    selectedMenu: null,
    selected: List([])
  }

  handleClick = (id, name) => {
    const { categories } = this.props;
    const { selected } = this.state;
    let nSelected;

    const index = selected.findIndex(sId => sId === id);
    if (index > -1) {
      nSelected = selected.delete(index);
    } else {
      nSelected = selected.push(id);
      if (id === 0 ) {
        nSelected = nSelected.clear().push(id);
      }
      if (selected.findIndex(sId => sId === categories.getIn([0, 'id'])) > -1) {
        nSelected = nSelected.delete(0);
      }
    }

    /*
    const menu = categories.getIn([id, 'menu']);
    const idx = Math.floor(Math.random() * (menu.size));
    console.log(menu.get(idx));

    */
    this.setState({
      selected: nSelected
    });
  }

  handleClickDirect = () => {
    const { history, setSelect } = this.props;
    setSelect(List([]));

    history.push('/map/')
  }

  handleClickNext = () => {
    const { categories, setSelect } = this.props;
    const { selected, modal } = this.state;
    const { menuName } = this;

    this.setState({
      randomStyle: {
        display: 'block'
      }
    }, () => {
      setTimeout(() => {
        let menu = List([]);

        selected.forEach((id) => {
          if ( id === 0 ) {
            // 전체를 선택 한경우 전체 카테고리에서 메뉴 선택
            categories.forEach((category) => {
              menu = menu.concat(category.get('menu'));
            });
          } else {
            menu = menu.concat(categories.getIn([id, 'menu']));
          }
        });
        
        const idx = Math.floor(Math.random() * (menu.size));

        this.setState({
          randomStyle: {
            display: 'none'
          }
        }, () => {
          setTimeout(() => {
            this.setState({
              selectedMenu: menu.get(idx)
            }, () => {
              if (menu.size === 1) {
                this.handleModalBtnClick();
              } else {
                menuName.innerHTML = `${menu.get(idx)}`;
                modal.open();
                
                setSelect(List([
                  menu.get(idx)
                ]));
              }
            });
          }, 500);
        });
      }, 500);
    });
  }

  handleModalBtnClick = () => {
    const { history } = this.props;
    const { selectedMenu } = this.state;
    
    // redirect to '/map/:keyword'
    history.push(`/map/${selectedMenu}`);
  }

  handleAllChanged = (e, idx) => {
    const checked = e.target.checked;
    const areaDiv = e.target.parentElement.parentElement.parentElement;
    const inputItems = [...areaDiv.getElementsByTagName('input')];

    inputItems.forEach(
      (item, idx) => {
        if (idx === 0) return;
        item.checked = checked;
      }
    );
  }

  componentDidMount() {
    const { modal, collapsible } = this;
    const instance = window.M.Modal.init(modal, {});
    const cInstance = window.M.Collapsible.init(collapsible, {});
    this.setState({
      modal: instance
    });
  }

  render() {
    const { handleClick, handleClickNext, handleClickDirect, handleModalBtnClick, handleAllChanged, handleClickTest } = this;
    const { randomStyle, selected } = this.state;
    const { categories } = this.props;
    const categoryItems = categories.map(
      (category, idx) => {
        const { name, id } = category.toJS();
        const isActive = selected.findIndex(sId => sId === id) > -1 ? true : false;
        const className = `collection-item collection-item-category blue-grey-text text-darken-4 ${isActive ? 'active' : ''}`;

        return (
          <div key={idx} onClick={() => handleClick(id, name)} className={className}>
            {name}
          </div>
        );
      }
    );
    
    // not use
    const collapsibleItems = categories.map(
      (category, idx) => {
        const { name } = category.toJS();
        const menu = category.get('menu');
        const menuList = menu.map(
            (item, menuIdx) => {
              return (
                <p key={`menuIdx${menuIdx}`}>
                  <label>
                    <input className="checkboxes" type="checkbox" />
                    <span>{item}</span>
                  </label>
                </p>
              );
            }
        );

        return (
          <li key={`categoryIdx${idx}`}>
            <div className="collapsible-header">{name}</div>
            <div className="collapsible-body">
              <p>
                <label>
                  <input className="checkboxes" type="checkbox" onChange={(event) => handleAllChanged(event, idx)} />
                  <span>전체</span>
                </label>
              </p>
              {menuList}
            </div>
          </li>
        );
      }
    );

    return (
      <div>
        <div className="main-preloader-wrapper" style={randomStyle}>
          <div className="preloader-wrapper big active main-preloader">
            <div className="spinner-layer">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div>
              <div className="gap-patch">
                <div className="circle"></div>
              </div>
              <div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-btns">
          <a onClick={handleClickDirect}
            className="waves-effect waves-light btn-small deep-orange darken-4"
            style={{marginRight: '0.2rem'}}>직접선택</a>
          <a onClick={handleClickNext}
            className={`waves-effect waves-light btn-small indigo darken-4 ${selected.size > 0 ? '' : 'disabled'}`}>다음</a>
        </div>
        <div className='collection collection-category'>
          {categoryItems}
        </div>
        {/*
          <ul ref={ref => { this.collapsible = ref }} className="collapsible collection-category">
            {collapsibleItems}
          </ul>
        */}
        <div ref={ref => { this.modal = ref }} className="modal bottom-sheet">
          <div className="modal-content">
            <h5>점심메뉴 선택</h5>
            <p>
              <strong><span className="indigo-text text-darken-4" ref={ref => { this.menuName = ref }}></span></strong> 이(가) 선택되었습니다.
            </p>
          </div>
          <div className="modal-footer">
            <a onClick={handleClickNext} className="modal-close waves-effect waves-green btn-flat">재시도</a>
            <a onClick={handleModalBtnClick} className="modal-close waves-effect waves-green btn-flat">음식점찾기</a>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
