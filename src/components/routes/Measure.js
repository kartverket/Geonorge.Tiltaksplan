// Dependecies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Components
import Container from 'components/template/Container';
import EditMeasure from 'components/partials/EditMeasure';
import ActivityTable from 'components/partials/ActivityTable';

// Actions
import { fetchMeasure } from 'actions/MeasuresActions';

// Helpers
import { canEditMeasure, canAddActivity } from 'helpers/authorizationHelpers';

// Stylesheets
import style from 'components/routes/Measure.module.scss';

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
            <h1>{this.props.measure.no} - {this.props.measure.name}</h1>
            <h5>Eies av {this.props.measure.owner.name}</h5>
            {
               canAddActivity()
                  ? (<div className={style.block}>
                     <Link to={`${this.getMeasureId()}/ny-aktivitet`}>
                        <button className="btn btn-primary">Opprett aktivitet</button>
                     </Link>
                  </div>)
                  : ''
            }
            <ActivityTable activities={this.props.measure.activities} />
            {
               canEditMeasure()
                  ? <EditMeasure />
                  : ''
            }
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
