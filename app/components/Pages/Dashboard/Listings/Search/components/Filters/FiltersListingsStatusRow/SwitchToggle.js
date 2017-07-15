import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'
// import compose from 'recompose/compose'
// import { connect } from 'react-redux'
// import { formValueSelector } from 'redux-form'
// import { obiectPropsValueToArray } from '../../../../../../../../store_actions/listings/search/filters/submit-filters-form'

// const formName = 'filters'
// const selector = formValueSelector(formName)

const SwitchToggle = ({
  name,
  value,
  isField,
  disabled,
  className,
  onChangeHandler
}) =>
  <div className={`c-switch-toggle ${className}`}>
    {isField
      ? <Field
        name={name}
        type="checkbox"
        component="input"
        disabled={disabled}
        id={`${name}_checkbox`}
        normalize={v => (v ? value : null)}
        onChange={(event, newValue, previousValue) =>
            onChangeHandler(event, newValue)}
      />
      : <input
        type="checkbox"
        checked={value}
        id={`${name}_checkbox`}
        onChange={event => onChangeHandler(event)}
      />}
    <label htmlFor={`${name}_checkbox`}>
      <span />
    </label>
  </div>

export default pure(SwitchToggle)

// export default compose(
//   pure,
//   connect(({ search }, { name }) => {
//     if (name === 'open_house') {
//       const formState = search.filters
//       const anyStatusIsNotSelected =
//         obiectPropsValueToArray(selector(formState, 'listing_statuses'))
//           .length === 0

//       return { disabled: anyStatusIsNotSelected }
//     }
//     return null
//   })
// )(SwitchToggle)
