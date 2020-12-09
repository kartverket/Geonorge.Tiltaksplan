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
      Promise.all([
         this.props.fetchMeasure(this.getMeasureId()),
         this.props.fetchActivity(this.getActivityId())
      ])
      .then(() => {
         this.setState({ dataFetched: true });
      });
   }

   getMeasureId() {
      return this.props.match && this.props.match.params && this.props.match.params.measureId
         ? this.props.match.params.measureId
         : null;
   }

   getActivityId() {
      return this.props.match && this.props.match.params && this.props.match.params.activityId
         ? this.props.match.params.activityId
         : null;
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return (
         <Container>
            <h1>{this.props.activity.name}</h1>
            <ActivityDetails newActivity={!this.getActivityId()} />
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
