import React from 'react'
import { addDecorator } from '@storybook/react'
import { themes } from '@storybook/theming'

import { TestBed } from '../tests/unit/TestBed'

addDecorator((story) => (
    <TestBed>{story()}</TestBed>
))

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  darkMode: {
    dark: themes.dark,
    light: themes.normal
  }
}
