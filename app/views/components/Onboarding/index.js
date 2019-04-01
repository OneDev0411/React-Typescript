import React from 'react'
import PropTypes from 'prop-types'

import Cookie from 'js-cookie'
import Joyride from 'react-joyride'

import ActionButton from 'components/Button/ActionButton'

import { Container, Title, Section, Actions } from './styled'

export default class Onboarding extends React.Component {
  getDisplay() {
    if (this.props.display === true) {
      return true
    }

    if (this.props.cookie) {
      return Cookie.get(this.props.cookie) === undefined
    }

    return false
  }

  getNormalizedSteps() {
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
    if (data.type === 'tour:end' && this.props.cookie) {
      Cookie.set(this.props.cookie, '', {
        path: '/',
        expires: 10000
      })

      this.props.onFinishIntro()
    }

    this.props.callback(data)
  }

  render() {
    if (this.getDisplay() === false) {
      return false
    }

    return (
      <div>
        <Joyride
          autoStart
          steps={this.getNormalizedSteps()}
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
  onFinishIntro: PropTypes.func,
  display: PropTypes.bool,
  cookie: PropTypes.string
}

Onboarding.defaultProps = {
  callback: () => null,
  onFinishIntro: () => null,
  display: false
}
