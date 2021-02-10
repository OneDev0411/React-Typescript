import React from 'react'

import YearMonthList from '../YearMonthList'
import MonthNavigator from '../MonthNavigator'

const Toolbar = props => (
  <YearMonthList {...props}>
    <MonthNavigator />
  </YearMonthList>
)

export default Toolbar
