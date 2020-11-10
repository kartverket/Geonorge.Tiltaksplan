// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'components/template/Container';
import { fetchSelectedMeasure } from 'actions/MeasureActions';
import style from 'components/routes/Measure.module.scss';
import Activity from 'components/partials/ActivityTable/ActivityTableRow';
import ActivityTable from 'components/partials/ActivityTable';


class Measure extends Component {
    componentDidMount() {
        this.props.fetchSelectedMeasure(this.getSelectedMeasureId())
    }

    getSelectedMeasureId(){
        return this.props.match && this.props.match.params && this.props.match.params.measureId
        ? this.props.match.params.measureId
        : null;
    }   

    render() {
        const selectedMeasure = this.props.selectedMeasure;
        return selectedMeasure ? (<Container>            
            <h1>{selectedMeasure.name}</h1>
        <div>{selectedMeasure.progress}</div>
        <div>{selectedMeasure.results}</div>
        <ActivityTable activities={selectedMeasure.activities} />            
        </Container>) : ''
    }
}

const mapStateToProps = state => ({
    selectedMeasure: state.selectedMeasure
});

const mapDispatchToProps = {
    fetchSelectedMeasure
};


export default connect(mapStateToProps, mapDispatchToProps)(Measure);
