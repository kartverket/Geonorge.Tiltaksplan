// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import Container from 'components/template/Container';
import ActivityDetails from 'components/partials/ActivityDetails';

// Actions
import { fetchActivity } from 'actions/ActivityActions';

class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFetched: false
        };
    }

    componentDidMount() {
        this.props.fetchActivity(this.getActivityId())
            .then(() => {
                this.setState({ dataFetched: true });
            });
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
                <ActivityDetails newActivity={!this.getActivityId()}/>
            </Container>
        );
    }
}


const mapStateToProps = (state) => ({
    activity: state.selectedActivity
 });
 
 const mapDispatchToProps = {
    fetchActivity
 };
 

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
