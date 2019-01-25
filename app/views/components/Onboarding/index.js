import React from 'react'
import PropTypes from 'prop-types'

import Cookie from 'js-cookie'
import Joyride from 'react-joyride'

import ActionButton from 'components/Button/ActionButton'

import { Container, Title, Section, Actions } from './styled'

export default class Onboarding extends React.Component {
  get Display() {
    if (this.props.onTimeDisplay) {
      return Cookie.get(this.props.onTimeDisplay) === undefined
    }

    return this.props.display
  }

  get NormalizedSteps() {
    return this.props.steps.map(step => ({
      ...step,
      disableBeacon: true,
      tooltipComponent: props => (
        <Container {...props.tooltipProps} style={step.tooltipStyle}>
          <Section>
            <Title>{step.title}</Title>
            {step.text}

            <Actions>
              {step.actions.back && (
                <ActionButton onClick={props.backProps.onClick}>
                  {step.actions.back || props.backProps.title}
                </ActionButton>
              )}

              {step.actions.primary && (
                <ActionButton
                  onClick={props.primaryProps.onClick}
                  style={{ marginLeft: '0.5rem' }}
                >
                  {step.actions.primary || props.primaryProps.title}
                </ActionButton>
              )}
            </Actions>
          </Section>

          {step.image && (
            <Section>
              <img src={step.image} alt="" style={step.imageStyle} />
            </Section>
          )}
        </Container>
      )
    }))
  }

  onCallback = data => {
    if (data.type === 'tour:end' && this.props.onTimeDisplay) {
      Cookie.set(this.props.onTimeDisplay, '', {
        path: '/',
        expires: 10000
      })
    }

    this.props.callback(data)
  }

  render() {
    if (this.Display === false) {
      return false
    }

    return (
      <div>
        <Joyride
          steps={this.NormalizedSteps}
          run={this.props.run}
          scrollToFirstStep
          continuous
          spotlightPadding={5}
          floaterProps={{
            hideArrow: true
          }}
          styles={{
            options: {
              overlayColor: 'rgba(0, 0, 0, 0.8)'
            }
          }}
          callback={this.onCallback}
        />
      </div>
    )
  }
}

Onboarding.propTypes = {
  steps: PropTypes.array.isRequired,
  callback: PropTypes.func,
  display: PropTypes.bool,
  onTimeDisplay: PropTypes.string
}

Onboarding.defaultProps = {
  callback: () => null,
  display: true
}
