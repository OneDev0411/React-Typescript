import React from 'react'

import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'

import { Input } from '../styled'

export default class ManualEntry extends React.Component {
  state = {
    showManualInput: false,
    manualValue: this.DefaultManualValue
  }

  get DefaultManualValue() {
    const { selectedAnnotation } = this.props

    return selectedAnnotation.data.annotations
      .reduce((acc, ann) => `${acc}${this.props.formValues[ann.fieldName]}`, '')
      .trim()
  }

  toggleManualInput = () =>
    this.setState(state => ({
      showManualInput: !state.showManualInput
    }))

  handleSave = () => {
    this.props.onSave(this.state.manualValue)
  }

  handleChangeManualValue = e => this.setState({ manualValue: e.target.value })

  render() {
    if (this.state.showManualInput) {
      return (
        <Flex full justifyBetween>
          <Input
            style={{ width: '85%', marginRight: '0.25rem' }}
            value={this.state.manualValue}
            onChange={this.handleChangeManualValue}
          />
          <ActionButton onClick={this.handleSave}>Save</ActionButton>
        </Flex>
      )
    }

    return (
      <React.Fragment>
        <div>
          <strong>Overwrite with manual entry</strong>
        </div>
        <p>
          This will not be added to your deal or pre-populate in other forms.
        </p>

        <ActionButton
          appearance="outline"
          onClick={this.toggleManualInput}
          style={{
            margin: '1rem 0'
          }}
        >
          Overwrite input
        </ActionButton>
      </React.Fragment>
    )
  }
}
