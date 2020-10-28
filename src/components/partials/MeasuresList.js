// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';

// Components
import MeasuresListElement from 'components/partials/MeasuresList/MeasuresListElement';

// Actions
import {fetchMeasures} from 'actions/MeasureActions';

// Stylesheets
import style from 'components/partials/MeasuresList.module.scss'

class MeasuresList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingForActionsResponse: true
    }
  }

  componentDidMount() {
    this.props.fetchMeasures();
  }

  renderMeasuresListElements(measures) {
    console.log(measures)
    return measures && measures.length
      ? measures.map(measure => {
        return <MeasuresListElement measure={measure}  />
      })
      : '';
  }

  render() {
    return this.props.measures
      ? (<div>
        <h1 className={style.header}>Tiltaksplaner</h1>
       
        {this.renderMeasuresListElements(this.props.measures)}
      </div>)
      : '';
  }
}

const mapStateToProps = state => ({measures: state.measures});

const mapDispatchToProps = {
  fetchMeasures
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasuresList);
