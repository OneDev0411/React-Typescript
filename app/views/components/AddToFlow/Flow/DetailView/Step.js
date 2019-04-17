import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import idx from 'idx'

import { grey } from 'views/utils/colors'
import { Checkbox } from 'components/Checkbox'
import { eventTypesIcons } from 'views/utils/event-types-icons'

import { StepContainer } from './styled'

export class Step extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    step: PropTypes.shape().isRequired
  }

  onChange = () => {
    const index = this.props.selected ? -1 : this.props.index

    this.props.onChange(this.props.step.id, index)
  }

  render() {
    const { step } = this.props
    const days = Math.floor(step.due_in / (24 * 3600)) + 1
    let Icon = idx(eventTypesIcons, icons => icons[step.event.task_type].icon)

    if (!Icon && step.email) {
      Icon = eventTypesIcons.Email.icon
    }

    return (
      <StepContainer alignCenter justifyBetween>
        <Flex alignCenter>
          <Checkbox
            checked={this.props.selected}
            id={step.id}
            onChange={this.onChange}
            margin="0"
            size={12}
          />
          {Icon && (
            <Icon
              style={{
                width: '1rem',
                height: '1rem',
                fill: grey.A550,
                margin: '0 0.5rem 0 0.25rem'
              }}
            />
          )}
          <div>{step.title}</div>
        </Flex>
        <div>{`Day ${days}`}</div>
      </StepContainer>
    )
  }
}
