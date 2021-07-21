import React from 'react'

import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import styled from 'styled-components'

import {
  CONTACTS__IMPORT_CSV__STEP_SELECT_FILE,
  CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE,
  CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS,
  CONTACTS__IMPORT_CSV__STEP_UPLOAD_CONTACTS
} from '../../../../../constants/contacts'
import { resetCsvImport } from '../../../../../store_actions/contacts'
import { FullPageHeader } from '../../../../../views/components/FullPageHeader'
import Stepper from '../../../../Partials/Stepper'

import Footer from './Footer'
import Mapper from './Mapper'
import SelectFile from './SelectFile'
import UploadContacts from './UploadContacts'

const Container = styled.div`
  overflow: auto;
  height: calc(
    100vh - ${({ stickyFooter }) => (stickyFooter ? '13rem' : '10rem + 2.5em')}
  );
`

class ImportCsv extends React.Component {
  state = {
    owner: this.props.user
  }

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

  onChangeOwner = owner => this.setState({ owner: owner.value })

  render() {
    const { currentWizardStep, isCurrentStepValid } = this.props

    return (
      <div className="contact__import-csv">
        <Helmet>
          <title>Import | Contacts | Rechat</title>
        </Helmet>

        <FullPageHeader
          title="Import a CSV file"
          handleClose={this.goBack}
          style={{ marginBottom: '1rem' }}
        />

        <Container
          stickyFooter={
            currentWizardStep !== CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS
          }
          className="contact__import-csv__container"
        >
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
            <SelectFile
              onChangeOwner={this.onChangeOwner}
              owner={this.state.owner}
            />
          )}
          {currentWizardStep === CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS && (
            <Mapper owner={this.state.owner} />
          )}
          {currentWizardStep === CONTACTS__IMPORT_CSV__STEP_UPLOAD_CONTACTS && (
            <UploadContacts owner={this.state.owner} />
          )}

          <Footer />
        </Container>
      </div>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { importCsv } = contacts
  const { file, currentWizardStep, isCurrentStepValid } = importCsv

  return {
    file,
    user,
    currentWizardStep,
    isCurrentStepValid
  }
}

export default connect(mapStateToProps, { resetCsvImport })(ImportCsv)
