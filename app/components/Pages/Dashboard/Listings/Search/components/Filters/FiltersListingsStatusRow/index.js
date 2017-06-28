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
  active,
  children,
  hasAccordion,
  statusIsActive,
  hasSwitchToggle,
  accordionIsActive,
  onChangeSwitchToggle = () => {},
  onClickAccordionTriggger
}) => {
  accordionIsActive = accordionIsActive && statusIsActive

  const getTitleStyle = () => {
    if (hasAccordion) {
      if (hasSwitchToggle) {
        return { width: '200px' }
      }
      return { width: '340px' }
    }

    return { width: '288px' }
  }
  return (
    <div>
      <div
        className={`c-filters-listings-status ${statusIsActive
          ? 'is-active'
          : ''}`}>
        <Flag icon={icon} color={color} />
        <span
          className="c-filters-listings-status__title"
          style={getTitleStyle()}>
          {title}
        </span>
        {hasAccordion &&
          <AccordionTrigger
            onClick={statusIsActive && onClickAccordionTriggger}
            active={accordionIsActive}
          />}
        {hasSwitchToggle &&
          <SwitchToggle
            name={name}
            onChangeHandler={onChangeSwitchToggle}
            className="c-filters-listings-status__switch-toggle"
          />}
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
  withState('accordionIsActive', 'triggerAccordion', true),
  withHandlers({
    onClickAccordionTriggger: ({
      accordionIsActive,
      triggerAccordion
    }) => () => {
      triggerAccordion(!accordionIsActive)
    }
  })
)(FiltersListingsStatus)
