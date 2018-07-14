import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as categoryActions from 'store/modules/category';
import Main from 'components/Main';

class MainContainer extends Component {
  render() {
    const { categories, setSelect } = this.props;

    return (
      <Main
        categories={categories}
        setSelect={setSelect}/>
    );
  }
}

export default connect(
  (state) => ({
    categories: state.category.get('categories'),
    selected: state.category.get('selected')
  }),
  (dispatch) => ({
    setSelect: (selected) => dispatch(categoryActions.setSelect(selected))
  }))(MainContainer);
