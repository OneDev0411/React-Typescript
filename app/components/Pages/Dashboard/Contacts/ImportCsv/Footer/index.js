import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import CancelButton from '../../../../../../views/components/Button/CancelButton'
import { updateWizardStep } from '../../../../../../store_actions/contacts'
import { CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS } from '../../../../../../constants/contacts'
import { confirmation } from '../../../../../../store_actions/confirmation'

class Footer extends React.Component {
  onCancel = () =>
    this.props.confirmation({
      message: 'Are you sure you want to quit?',
      confirmLabel: 'Yes',
      onConfirm: () => browserHistory.push('/dashboard/contacts')
    })

  onClickNext = () => {
    const { currentWizardStep, updateWizardStep } = this.props

    updateWizardStep(currentWizardStep + 1)
  }

  getNextButtonCaption() {
    const { currentWizardStep } = this.props

    if (currentWizardStep >= CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS) {
      return 'Finish Import'
    }

    return 'Next'
  }

  render() {
    const { isCurrentStepValid } = this.props

    return (
      <div className="contact__import-csv__footer">
        <ActionButton onClick={this.onClickNext} disabled={!isCurrentStepValid}>
          {this.getNextButtonCaption()}
        </ActionButton>

        <CancelButton
          className="contact__import-csv--upload__cancel-btn"
          onClick={this.onCancel}
        >
          Cancel
        </CancelButton>
      </div>
    )
  }
}

function mapStateToProps({ contacts }) {
  const { importCsv } = contacts
  const { file, currentWizardStep, isCurrentStepValid } = importCsv

  return {
    currentWizardStep,
    isCurrentStepValid,
    file
  }
}

export default connect(mapStateToProps, {
  updateWizardStep,
  confirmation
})(Footer)
