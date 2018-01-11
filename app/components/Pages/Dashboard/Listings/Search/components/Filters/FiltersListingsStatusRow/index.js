import React from 'react'
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

const checkFieldsStatus = (state, fields) => {
  let statusIndex = 0
  let statusIsActive = false

  if (typeof fields === 'string') {
    return selector(state, fields) || false
  }

  const statuses = Object.keys(fields)

  while (!statusIsActive && statusIndex < statuses.length) {
    const status = selector(state, `listing_statuses.${statuses[statusIndex]}`)

    if (status) {
      statusIsActive = true
    }

    statusIndex++
  }

  return statusIsActive
}

const FiltersListingsStatus = ({
  name,
  icon,
  title,
  color,
  fields,
  isField,
  children,
  hasAccordion,
  statusIsActive,
  hasSwitchToggle,
  accordionIsActive,
  onChangeSwitchToggle = () => {},
  onClickAccordionTriggger = () => {}
}) => {
  accordionIsActive = hasSwitchToggle
    ? accordionIsActive && statusIsActive
    : accordionIsActive

  const AccordionTriggerIsActive = hasSwitchToggle ? statusIsActive : true

  return (
    <div>
      <div className="c-filters-status">
        <div className="c-filters-status__left-side">
          <Flag icon={icon} color={color} />
          <span className="c-filters-status__title">{title}</span>
        </div>

        <div
          className={`c-filters-status__right-side ${
            statusIsActive ? 'is-active' : ''
          }`}
        >
          {hasAccordion && (
            <AccordionTrigger
              onClick={onClickAccordionTriggger}
              active={accordionIsActive}
            />
          )}

          {hasAccordion &&
            hasSwitchToggle && <span className="c-filters-status__separator" />}

          {hasSwitchToggle && (
            <SwitchToggle
              name={name}
              isField={isField}
              value={isField ? title : statusIsActive}
              onChangeHandler={onChangeSwitchToggle}
              className="c-filters-status__switch-toggle"
            />
          )}
        </div>
      </div>

      {hasAccordion && <Accordion active={accordionIsActive}>{children}</Accordion>}
    </div>
  )
}

export default compose(
  connect((state, { name, fields }) => {
    const statusIsActive = checkFieldsStatus(state, fields || name) || false

    return { statusIsActive }
  }),
  withState(
    'accordionIsActive',
    'triggerAccordion',
    ({ hasSwitchToggle }) => hasSwitchToggle
  ),
  withHandlers({
    onClickAccordionTriggger: ({ accordionIsActive, triggerAccordion }) => () => {
      triggerAccordion(!accordionIsActive)
    }
  })
)(FiltersListingsStatus)
