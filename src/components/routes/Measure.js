// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'components/template/Container';
import { fetchSelectedMeasure } from 'actions/MeasureActions';
import style from 'components/routes/Measure.module.scss';
import ActivityTable from 'components/partials/ActivityTable';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Activity } from 'models/activity';


class Measure extends Component {
    constructor(props) {
        super(props);
  
        this.state = {
           modalOpen: false,         
        };
  
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
  
     }

     openModal() {
        this.setState({
           modalOpen: true,
           newActivity: new Activity()
        });
     }
  
     handleChange(event) {
        const newActivity = this.state.newActivity;
        newActivity[event.target.name] = event.target.value;
  
        this.setState({ newActivity }, () => console.log(this.state.newActivity));
     }
  
     closeModal() {
        this.setState({ modalOpen: false });
     }
  
     /*const */
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
        <div className={style.block}>{selectedMeasure.progress}</div>
        <div className={style.block}>{selectedMeasure.results}</div>

        <div>
            <button className="btn" onClick={this.openModal}>Legg til aktivitet</button>
        </div>

        <ActivityTable activities={selectedMeasure.activities} />   
        {this.state.newActivity ? (
            <Dialog open={this.state.modalOpen} onClose={this.closeModal} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Legg til aktivitet</DialogTitle>
            <DialogContent>

               <div className={style.block}><TextField label="Navn" variant="outlined" name="name" value={this.state.newActivity.name} onChange={this.handleChange} /></div>
               <div className={style.block}><TextField label="Tittel" variant="outlined" name="title" value={this.state.newActivity.title} onChange={this.handleChange} /></div>
              
            </DialogContent>
            <DialogActions>
               <button className="btn" onClick={this.closeModal}>Lukk</button>
               <button className="btn primary" onClick={this.closeModal}>Lagre</button>
            </DialogActions>
         </Dialog>  
        ) : ''}
                
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
