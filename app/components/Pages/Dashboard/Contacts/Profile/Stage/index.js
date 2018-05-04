import React from 'react'
import Stepper from '../../../../../Partials/Stepper'
import { getAttributeFromSummary } from '../../../../../../models/contacts/helpers/get-attribute-from-summary'

const STEPS = [
  'General',
  'Unqualified Lead',
  'Qualified Lead',
  'Active',
  'Past Client'
]
export default class Stage extends React.Component {
  state = {
    isSaving: false
  }

  getStageIndex = () =>
    STEPS.indexOf(
      getAttributeFromSummary(this.props.contact, 'stage') || 'General'
    )

  onChange = async stage => {
    if (this.state.isSaving) {
      return
    }

    try {
      this.setState({ isSaving: true })

      await this.props.onChange(stage)
    } catch (error) {
      throw error
    } finally {
      this.setState({ isSaving: false })
    }
  }

  render() {
    return (
      <div className="c-contact-profile-card stage">
        <h3 className="c-contact-profile-card__title">Stage</h3>
        <div className="c-contact-profile-card__body">
          <Stepper
            steps={STEPS}
            onChange={this.onChange}
            active={this.getStageIndex()}
            disableClick={this.state.isSaving}
          />
        </div>
      </div>
    )
  }
}
