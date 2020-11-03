// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Template
import MeasuresTable from 'components/partials/MeasuresTable';
import Container from 'components/template/Container';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Measure } from 'models/measure';

class Measures extends Component {
   constructor(props) {
      super(props);

      this.state = {
         modalOpen: false,
         newMeasure: new Measure({}) 
      };

      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
   }

   openModal() {
      this.setState({ 
         modalOpen: true,
         newMeasure: new Measure({ name: 'Ny aktivitet' })
      });
   }

   handleChange(event) {
      const value = event.target.value;

      /*setState({
        ...state,
        [event.target.name]: value
      });*/
   }

   closeModal() {
      this.setState({ modalOpen: false });
   }

   render() {
      return (
         <Container>
            <h1>Tiltaksplaner</h1>

            <button className="btn" onClick={this.openModal}>Legg til tiltak</button>

            <MeasuresTable />

            <Dialog open={this.state.modalOpen} onClose={this.closeModal} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title">Legg til tiltak</DialogTitle>
               <DialogContent>
                  <label>
                     Navn:
                     <input type="text" name="name" value={this.state.newMeasure.name} onChange={this.handleChange} />
                  </label>
               </DialogContent>
               <DialogActions>
                  <button className="btn" onClick={this.closeModal}>Lukk</button>
                  <button className="btn primary" onClick={this.closeModal}>Lagre</button>
               </DialogActions>
            </Dialog>
         </Container>
      )
   }
}

export default connect(null, null)(Measures);
