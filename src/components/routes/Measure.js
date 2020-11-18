// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'components/template/Container';
import { fetchMeasure } from 'actions/MeasuresActions';

class Measure extends Component {
    componentDidMount() {
        this.props.fetchMeasure(this.getSelectedMeasureId())
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
        const measure = this.props.measure;
        return measure ? (<Container>
            {measure.name}
            {this.renderActivities(measure.activities)}
        </Container>) : 'hoy'
    }
}

const mapStateToProps = state => ({
    measure: state.measure
});

const mapDispatchToProps = {
  fetchMeasure
};


export default connect(mapStateToProps, mapDispatchToProps)(Measure);
