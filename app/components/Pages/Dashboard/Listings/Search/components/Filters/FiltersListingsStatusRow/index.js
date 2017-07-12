import React from 'react'
import pure from 'recompose/pure'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import { formValueSelector } from 'redux-form'
import withHandlers from 'recompose/withHandlers'

import Flag from './Flag'
import Accordion from './Accordion'
import SwitchToggle from './SwitchToggle'
import AccordionTrigger from './AccordionTrigger'

const selector = formValueSelector('filters')

const FiltersListingsStatus = ({
  name,
  icon,
  title,
  color,
  children,
  hasAccordion,
  statusIsActive,
  hasSwitchToggle,
  accordionIsActive,
  onChangeSwitchToggle = () => {},
  onClickAccordionTriggger
}) => {
  accordionIsActive = hasSwitchToggle
    ? accordionIsActive && statusIsActive
    : accordionIsActive

  const AccordionTriggerIsActive = hasSwitchToggle ? statusIsActive : true

  return (
    <div>
      <div className="c-filters-listings-status">
        <div className="c-filters-listings-status__left-side">
          <Flag icon={icon} color={color} />
          <span className="c-filters-listings-status__title">
            {title}
          </span>
        </div>

        <div
          className={`c-filters-listings-status__right-side ${statusIsActive
            ? 'is-active'
            : ''}`}
        >
          {hasAccordion &&
            <AccordionTrigger
              onClick={AccordionTriggerIsActive && onClickAccordionTriggger}
              active={accordionIsActive}
            />}

          {hasAccordion &&
            hasSwitchToggle &&
            <span className="c-filters-listings-status__separator" />}

          {hasSwitchToggle &&
            <SwitchToggle
              name={name}
              value={title}
              onChangeHandler={onChangeSwitchToggle}
              className="c-filters-listings-status__switch-toggle"
            />}
        </div>
      </div>

      {hasAccordion &&
        <Accordion active={accordionIsActive}>
          {children}
        </Accordion>}
    </div>
  )
}

export default compose(
  pure,
  connect(({ search }, { name }) => {
    const formState = search.filters
    return {
      statusIsActive: selector(formState, name)
    }
  }),
  withState(
    'accordionIsActive',
    'triggerAccordion',
    ({ hasSwitchToggle }) => hasSwitchToggle
  ),
  withHandlers({
    onClickAccordionTriggger: ({
      accordionIsActive,
      triggerAccordion
    }) => () => {
      triggerAccordion(!accordionIsActive)
    }
  })
)(FiltersListingsStatus)
