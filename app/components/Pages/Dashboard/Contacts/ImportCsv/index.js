import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Stepper from '../../../../Partials/Stepper'
import Footer from './Footer'
import SelectFile from './SelectFile'
import Mapper from './Mapper'
import UploadContacts from './UploadContacts'
import { resetCsvImport } from '../../../../../store_actions/contacts'
import {
  CONTACTS__IMPORT_CSV__STEP_SELECT_FILE,
  CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE,
  CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS,
  CONTACTS__IMPORT_CSV__STEP_UPLOAD_CONTACTS
} from '../../../../../constants/contacts'
import PageHeader from '../../../../../views/components/PageHeader'
import { CloseButton } from '../../../../../views/components/Button/CloseButton'

class ImportCsv extends React.Component {
  componentWillUnmount() {
    this.props.resetCsvImport()
  }

  goBack = () => {
    browserHistory.push('/dashboard/contacts')
  }

  getCurrentStepLabel = () => {
    const { currentWizardStep } = this.props

    if (currentWizardStep < 3) {
      return currentWizardStep + 1
    }

    return currentWizardStep
  }

  render() {
    const { currentWizardStep, isCurrentStepValid } = this.props

    return (
      <div className="contact__import-csv">
        <PageHeader
          isFlat
          style={{
            marginBottom: '1.5em',
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>Import a CSV file</PageHeader.Heading>
          </PageHeader.Title>
          <CloseButton />
        </PageHeader>

        <div className="contact__import-csv__container">
          <div className="current-step">
            Step {this.getCurrentStepLabel()} of 3
          </div>

          <Stepper
            disableClick
            isActiveStageFinished={isCurrentStepValid}
            steps={['Choose File', 'Upload', 'Properties']}
            active={currentWizardStep}
          />

          {(currentWizardStep === CONTACTS__IMPORT_CSV__STEP_SELECT_FILE ||
            currentWizardStep === CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE) && (
            <SelectFile />
          )}
          {currentWizardStep === CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS && (
            <Mapper />
          )}
          {currentWizardStep === CONTACTS__IMPORT_CSV__STEP_UPLOAD_CONTACTS && (
            <UploadContacts />
          )}

          <Footer />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ contacts }) {
  const { importCsv } = contacts
  const { file, currentWizardStep, isCurrentStepValid } = importCsv

  return {
    file,
    currentWizardStep,
    isCurrentStepValid
  }
}

export default connect(
  mapStateToProps,
  { resetCsvImport }
)(ImportCsv)
