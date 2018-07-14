import React, { Component } from 'react';
import { connect } from 'react-redux';
import DaumMap from 'components/DaumMap';

class MapContainer extends Component {
  render() {
    const { selected, categories } = this.props;

    return (
      <DaumMap
        selected={selected}
        categories={categories} />
    );
  }
}

export default connect(
  (state) => ({
    categories: state.category.get('categories'),
    selected: state.category.get('selected')
  }), undefined)(MapContainer);
