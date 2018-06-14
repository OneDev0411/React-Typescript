import React, { Fragment } from 'react'

import YearMonthList from '../YearMonthList'
import MonthNavigator from '../MonthNavigator'

const Toolbar = props => (
  <Fragment>
    <YearMonthList {...props}>
      <MonthNavigator />
    </YearMonthList>
  </Fragment>
)

export default Toolbar
