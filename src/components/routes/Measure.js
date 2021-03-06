// Dependecies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DayJS from 'react-dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// Components
import Container from 'components/template/Container';
import MeasureDetails from 'components/partials/MeasureDetails';
import ReportDetails from 'components/partials/ReportDetails';
import ActivityTable from 'components/partials/ActivityTable';

// Actions
import { fetchMeasure, deleteMeasure } from 'actions/MeasuresActions';
import { translate } from 'actions/ConfigActions';

// Helpers
import { canDeleteMeasure, canAddActivity } from 'helpers/authorizationHelpers';

// Stylesheets
import style from 'components/routes/Measure.module.scss';

class Measure extends Component {
   constructor(props) {
      super(props);
      this.state = {
         dataFetched: false,
         deleteMeasureModalOpen: false,
         open: false
      };
      this.openDeleteMeasureModal = this.openDeleteMeasureModal.bind(this);
      this.closeDeleteMeasureModal = this.closeDeleteMeasureModal.bind(this);
      this.handleDeleteMeasure = this.handleDeleteMeasure.bind(this);
   }

   componentDidMount() {
      this.props.fetchMeasure(this.getMeasureNumber())
         .then(() => {
            this.setState({ dataFetched: true });
         });
   }

   openDeleteMeasureModal() {
      this.setState({ deleteMeasureModalOpen: true });
   }

   closeDeleteMeasureModal() {
      this.setState({ deleteMeasureModalOpen: false });
   }

   handleDeleteMeasure() {
      this.props.deleteMeasure(this.props.measure, this.props.user)
         .then(() => {
            this.props.history.push(`/`);
         });
   }

   getMeasureNumber() {
      return this.props.match && this.props.match.params && this.props.match.params.measureNumber
         ? this.props.match.params.measureNumber
         : null;
   }

   render() {
      const hasMeasure = this.props.measure && Object.keys(this.props.measure).length;
      return this.state.dataFetched && hasMeasure
         ? (
            <Container>
               <h1>{this.props.measure.no} - {this.props.measure.name}</h1>
               {this.props.measure.infoUrl ?
                  <a href={`${this.props.measure.infoUrl}`}>{this.props.translate('infoLinkMeasure')}</a> : ''
               }
               <h5>{this.props.translate('OwnsBy')} {this.props.measure.owner.name}</h5>
               {
                  canDeleteMeasure(this.props.authInfo)
                     ? <Button className="mr-2" variant="secondary" onClick={this.openDeleteMeasureModal}>Slett tiltaket</Button>
                     : ''
               }
               <MeasureDetails selectedMeasure={this.props.measure} />
               <div className={style.btn} onClick={() => { this.setState({ open: !this.state.open }) }}>
                  {this.state.open ? `${this.props.translate('ReportLinkClose')}` : `${this.props.translate('ReportLink')}`} {<FontAwesomeIcon icon={this.state.open ? 'minus-circle' : 'plus-circle'} />}
               </div>


               <div className={`${style.reporting} ${this.state.open ? style.reportOpen : style.reportClose}`}>
                  <h2>{this.props.translate('progressReportTitle')}</h2>
                  <p>{this.props.translate('lastUpdate')} <DayJS format="DD.MM YYYY" locale="nb">{this.props.measure.lastUpdated}</DayJS></p>

                  <ReportDetails />
               </div>

               <h2>{this.props.translate('MeasureActivitiesTitle')}</h2>


               <ActivityTable activities={this.props.measure.activities} />
               {
                  canAddActivity(this.props.authInfo, this.props.measure.owner)
                     ? (<div className={style.block}>
                        <Link to={`/tiltak/${this.getMeasureNumber()}/ny-aktivitet`}>
                           <button className="btn btn-primary">{this.props.translate('btnCreateActivity')}</button>
                        </Link>
                     </div>)
                     : ''
               }

               <Modal
                  show={this.state.deleteMeasureModalOpen}
                  onHide={this.closeDeleteMeasureModal}
                  keyboard={false}
                  animation={false}
                  centered
                  backdrop="static"
                  aria-labelledby="form-dialog-title">
                  <Modal.Header closeButton>
                     <Modal.Title>Slett tiltak</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                     <p>Er du sikker på at du vil slette {this.props.measure.name}?</p>
                     {this.props.measure.activities.length > 0 ? 'Du kan ikke slette da det er aktiviteter knyttet til tiltaket' + this.props.measure.name : ''}
                  </Modal.Body>

                  <Modal.Footer>
                     <Button variant="secondary" onClick={this.closeDeleteMeasureModal}>Avbryt</Button>
                     <Button disabled={this.props.measure.activities.length > 0} variant="danger" onClick={this.handleDeleteMeasure}>Slett</Button>
                  </Modal.Footer>
               </Modal>
            </Container>
         )
         : '';
   }
}

const mapStateToProps = (state) => ({
   measure: state.measures.selectedMeasure,
   user: state.oidc.user,
   authInfo: state.authInfo,
   selectedLanguage: state.selectedLanguage
});

const mapDispatchToProps = {
   fetchMeasure,
   deleteMeasure,
   translate
};

export default connect(mapStateToProps, mapDispatchToProps)(Measure);
