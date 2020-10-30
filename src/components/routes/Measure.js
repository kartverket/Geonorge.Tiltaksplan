// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Template
import Container from 'components/template/Container';

// Actions
import { fetchSelectedMeasure } from 'actions/MeasureActions';

class Measure extends Component {

    componentDidMount() {
        this.props.fetchSelectedMeasure(this.getSelectedMeasureId())
    }

    getSelectedMeasureId(){
        return this.props.match && this.props.match.params && this.props.match.params.measureId
        ? this.props.match.params.measureId
        : null;
    }

    renderActivities(activities){
        return activities && activities.length ?activities.map(activity => {
            return <p>{activity.name}</p>
        }) : null;
    }

    render() {
        const selectedMeasure = this.props.selectedMeasure;
        return selectedMeasure ? (<Container>
            {selectedMeasure.name}
            {this.renderActivities(selectedMeasure.activities)}
        </Container>) : 'hoy'
    }
}

const mapStateToProps = state => ({
    selectedMeasure: state.selectedMeasure
});

const mapDispatchToProps = {
    fetchSelectedMeasure
};


export default connect(mapStateToProps, mapDispatchToProps)(Measure);
