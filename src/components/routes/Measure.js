import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMeasure } from 'actions/MeasuresActions';
import Container from 'components/template/Container';
import EditMeasure from 'components/partials/EditMeasure';
import ActivityTable from 'components/partials/ActivityTable';
import { Link } from 'react-router-dom';

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
            <Link to={`${this.getMeasureId()}/ny-aktivitet`}><button className="btn btn-primary">Opprett aktivitet</button></Link>
            <ActivityTable activities={this.props.measure.activities}/>
            <EditMeasure />
         </Container>
      );
   }
}

const mapStateToProps = (state) => ({
   measure: state.measures.selectedMeasure
});

const mapDispatchToProps = {
   fetchMeasure
};

export default connect(mapStateToProps, mapDispatchToProps)(Measure);
