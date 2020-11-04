// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'components/template/Container';
import { fetchSelectedMeasure } from 'actions/MeasureActions';
import DayJS from 'react-dayjs';
import style from 'components/routes/Measure.module.scss'


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
            return ( 
                <tr>
                    <td>{activity.name}</td>
                    <td>{activity.title}</td>
                    <td>{activity.description}</td>
                    <td><DayJS format="DD.MM.YYYY">{activity.implementationStart}</DayJS></td>
                    <td><DayJS format="DD.MM.YYYY">{activity.implementationEnd}</DayJS></td>
                </tr> )
        }) : null;
    }

    render() {
        const selectedMeasure = this.props.selectedMeasure;
        return selectedMeasure ? (<Container>
            <h1>{selectedMeasure.name}</h1>
            <table className={style.activitiesTable}>
                <thead>
                    <tr><th>Navn</th><th>tittel</th><th>Beskrivelse</th><th>Start</th><th>Slutt</th></tr>
                </thead>
                <tbody>
                {this.renderActivities(selectedMeasure.activities)}
                </tbody>
                </table>
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
