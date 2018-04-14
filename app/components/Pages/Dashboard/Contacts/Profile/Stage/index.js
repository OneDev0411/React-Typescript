import React from 'react'
import Stepper from '../../../../../Partials/Stepper'
import { getContactStage } from '../../../../../../models/contacts/helpers/get-contact-stage'

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
    STEPS.map(s => s.replace(/\s/g, '')).indexOf(
      getContactStage(this.props.contact).text
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
