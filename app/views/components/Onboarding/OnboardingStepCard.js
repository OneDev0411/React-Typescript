import React from 'react'

import {
  Actions,
  Container,
  Section,
  Spacer,
  Title
} from 'components/Onboarding/styled'
import ActionButton from 'components/Button/ActionButton'

/**
 *
 * @param {TooltipRenderProps} props
 * @returns {*}
 * @constructor
 */
export function OnboardingStepCard(props) {
  return (
    <Container {...props.tooltipProps} style={props.step.tooltipStyle}>
      <Section>
        <Title>{props.step.title}</Title>
        {props.step.content}

        <Actions>
          {!props.isLastStep && (
            <ActionButton
              style={{ padding: 0 }}
              appearance="link"
              {...props.closeProps}
            >
              {props.index > 0 ? 'Finish Tour' : 'Skip'}
            </ActionButton>
          )}
          <Spacer />
          {props.step.actions.back && (
            <ActionButton onClick={props.backProps.onClick}>
              {props.step.actions.back || props.backProps.title}
            </ActionButton>
          )}

          {props.step.actions.primary && (
            <ActionButton
              onClick={props.primaryProps.onClick}
              style={{ marginLeft: '0.5rem' }}
            >
              {props.step.actions.primary || props.primaryProps.title}
            </ActionButton>
          )}
        </Actions>
      </Section>

      {props.step.image && (
        <Section>
          <img src={props.step.image} alt="" style={props.step.imageStyle} />
        </Section>
      )}
    </Container>
  )
}
