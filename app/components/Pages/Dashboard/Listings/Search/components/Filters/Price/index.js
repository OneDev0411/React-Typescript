import React from 'react'
import { change as updateField, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import MinMaxInputs from '../components/MinMaxInputs'
import { toNumber } from '../../../../../../../../utils/helpers'

const FORM_NAME = 'filters'
const selector = formValueSelector(FORM_NAME)

const Price = ({
  dispatch,
  userIsAgent = false,
  priceZeroCleanerIsChecked = false
}) => (
  <div style={{ position: 'relative' }}>
    {userIsAgent && (
      <label
        htmlFor="zero-reducer-checkbox"
        style={{
          position: 'absolute',
          right: 0,
          top: 0
        }}
      >
        <input
          type="checkbox"
          id="zero-reducer-checkbox"
          className="c-filters__tag__input"
          checked={priceZeroCleanerIsChecked}
          onChange={event =>
            dispatch(
              updateField(FORM_NAME, 'priceZeroCleaner', event.target.checked)
            )
          }
        />
        <span className="c-filters__tag__text">(000s)</span>
      </label>
    )}
    <MinMaxInputs
      name="price"
      label="Price"
      placeholder="$Any"
      formatHandler={value => {
        if (!value || value == null) {
          return ''
        }

        return typeof value === 'number'
          ? value.toLocaleString()
          : toNumber(value, true)
      }}
    />
  </div>
)

export default connect(state => {
  const { user } = state
  const userIsAgent = user && user.user_type === 'Agent'

  if (userIsAgent) {
    const priceZeroCleanerIsChecked = selector(state, 'priceZeroCleaner')

    return {
      userIsAgent,
      priceZeroCleanerIsChecked
    }
  }

  return {}
})(Price)
