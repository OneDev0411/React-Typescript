import React from 'react'
import { Field } from 'redux-form'

import SwitchToggle from '../components/SwitchToggle'

const name = 'master_bedroom_in_first_floor'

export default function MasterBedroomOnFirstFloor() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '-1.5em 0 1.5em'
      }}
    >
      <span style={{ marginRight: '0.5em' }}>
        Master bedroom on first floor
      </span>
      <Field
        name={name}
        component={props => {
          const {
            input: { value, onChange }
          } = props

          return (
            <SwitchToggle
              name={name}
              value={value}
              onChangeHandler={() => onChange(value ? null : 'YES')}
            />
          )
        }}
      />
    </div>
  )
}
