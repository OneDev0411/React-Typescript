import React from 'react'

import MonthNavigator from '../MonthNavigator'
import YearMonthList from '../YearMonthList'

const Toolbar = props => (
  <YearMonthList {...props}>
    <MonthNavigator />
  </YearMonthList>
)

export default Toolbar
