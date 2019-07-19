import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { change } from 'redux-form'

import SwitchToggle from '../components/SwitchToggle'

const name = 'master_bedroom_in_first_floor'

const MasterBedroomOnFirstFloor = props => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '-1.5em 0 1.5em'
    }}
  >
    <span style={{ marginRight: '0.5em' }}>Master bedroom on first floor</span>
    <SwitchToggle isField name={name} onChangeHandler={props.onChange} />
  </div>
)

export default compose(
  connect(),
  withHandlers({
    onChange: ({ dispatch }) => (event, value) => {
      dispatch(change('filters', name, value == null ? 'YES' : null))
    }
  })
)(MasterBedroomOnFirstFloor)
