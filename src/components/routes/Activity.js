// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import Container from 'components/template/Container';
import ActivityDetails from 'components/partials/ActivityDetails';

// Actions
import { fetchMeasure } from 'actions/MeasuresActions';
import { fetchActivity } from 'actions/ActivityActions';

class Activity extends Component {
   constructor(props) {
      super(props);

      this.state = {
         dataFetched: false
      };
   }

   componentDidMount() {
      const measureNumber = this.getMeasureNumber();
      const activityNumber = this.getActivityNumber();
      const promises = [this.props.fetchMeasure(measureNumber)];

      if (activityNumber) {
        promises.push(this.props.fetchActivity(measureNumber, activityNumber));
      }

      Promise.all(promises)
        .then(() => {
          this.setState({ dataFetched: true });
        });
   }

   getMeasureNumber() {
      return this.props.match && this.props.match.params && this.props.match.params.measureNumber
         ? this.props.match.params.measureNumber
         : null;
   }

   getActivityNumber() {
      return this.props.match && this.props.match.params && this.props.match.params.activityNumber
         ? this.props.match.params.activityNumber
         : null;
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return (
         <Container>
            <h1>{this.props.activity.name}</h1>
            <ActivityDetails newActivity={!this.getActivityNumber()} />
         </Container>
      );
   }
}


const mapStateToProps = (state) => ({
   activity: state.activities.selectedActivity
});

const mapDispatchToProps = {
   fetchMeasure,
   fetchActivity
};


export default connect(mapStateToProps, mapDispatchToProps)(Activity);
