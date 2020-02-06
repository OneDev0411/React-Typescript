import React from 'react'

import Flex from 'styled-flex-component'

import { Year } from './components/Year'
import { Month } from './components/Month'
import { Week } from './components/Week'

export function DatePicker() {
  return (
    <Flex>
      <Month />
      <Year />
      <Week />
    </Flex>
  )
}
