// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'components/template/Container';

import { fetchMeasure } from 'actions/MeasuresActions';

// Components
import EditMeasure from 'components/partials/EditMeasure';

class Measure extends Component {
   constructor(props) {
      super(props);

      this.state = {
         dataFetched: false
      };
   }

   componentDidMount() {
      this.props.fetchMeasure(this.getMeasureId())
         .then(() => {
            this.setState({ dataFetched: true });
         });
   }

   getMeasureId() {
      return this.props.match && this.props.match.params && this.props.match.params.measureId
         ? this.props.match.params.measureId
         : null;
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return (
         <Container>
            <h1>{this.props.measure.name}</h1>

            <EditMeasure />
         </Container>
      );
   }
}

const mapStateToProps = (state) => ({
   measure: state.measure
});

const mapDispatchToProps = {
   fetchMeasure,
};

export default connect(mapStateToProps, mapDispatchToProps)(Measure);
