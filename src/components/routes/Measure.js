// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'components/template/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';


// Components
import ActivityTable from 'components/partials/ActivityTable';

// Actions
import { fetchSelectedMeasure } from 'actions/MeasureActions';
import { createActivity } from 'actions/ActivityActions';

// Stylesheets
import style from 'components/routes/Measure.module.scss';


import { Activity } from 'models/activity';


class Measure extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
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
        const targetvalue = event.target.dataset && event.target.dataset.type && event.target.dataset.type === 'number' ? parseInt(event.target.value) : event.target.value;
      newActivity[event.target.name] = targetvalue;

        this.setState({ newActivity }, () => console.log(this.state.newActivity));
    }

    closeModal() {
        this.setState({ modalOpen: false });
    }

    saveModal() {
        this.props.createActivity(this.state.newActivity).then(() => {
            this.closeModal();
        });
    }

    componentDidMount() {
        this.props.fetchSelectedMeasure(this.getSelectedMeasureId())
    }

    getSelectedMeasureId() {
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
               
               <div className={style.block}>
                     <label>
                        Navn:
                        <input type="text" name="name" value={this.state.newActivity.name} onChange={this.handleChange} />
                     </label>
                  </div>
                  <div className={style.block}>
                     <label>
                        Tittel:
                        <input type="text" name="title" value={this.state.newActivity.title} onChange={this.handleChange} />
                     </label>
                  </div>
                  <div className={style.block}>
                     <label>
                        Beskrivelse:
                        <input type="text" name="description" value={this.state.newActivity.description} onChange={this.handleChange} />
                     </label>
                  </div>

                <div className={style.flexblock}>
                  <TextField
                        id="implementationStart"
                        label="Start"
                        name="implementationStart"
                        type="date"
                        onChange={this.handleChange}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                   
                <TextField
                        id="implementationEnd"
                        label="Slutt"
                        name="implementationEnd"
                        type="date"
                        onChange={this.handleChange}                       
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    </div>
                    <div className={style.block}>
                     <label>
                        Status:
                        <input type="radio" data-type='number' name="status" checked={this.state.newActivity.status === 1} value={1} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="status" checked={this.state.newActivity.status === 2} value={2} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="status" checked={this.state.newActivity.status === 3} value={3} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="status" checked={this.state.newActivity.status === 4} value={4} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="status" checked={this.state.newActivity.status === 5} value={5} onChange={this.handleChange} />
                     </label>
                  </div>
                  <div className={style.block}>
                      <label>
                          Deltakere:
                          <input type="text" name="participants" value={this.state.newActivity.participants} onChange={this.handleChange} />
                      </label>
                  </div>
            </DialogContent>
            <DialogActions>
               <button className="btn" onClick={this.closeModal}>Lukk</button>
               <button className="btn primary" onClick={this.saveModal}>Lagre</button>
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
    fetchSelectedMeasure,
    createActivity
};


export default connect(mapStateToProps, mapDispatchToProps)(Measure);
