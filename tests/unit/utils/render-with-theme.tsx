import * as React from 'react'
import { render } from '@testing-library/react'
import { render as renderEnzyme } from 'enzyme'

import { AppTheme } from '../../../app/AppTheme'
import { TestBed } from '../TestBed'

export const renderWithTheme = (ui, ...otherArgs) =>
  render(
    <TestBed>
      <AppTheme>{ui}</AppTheme>
    </TestBed>,
    ...otherArgs
  )

export const renderWithThemeEnzyme: typeof renderEnzyme = (ui, ...otherArgs) =>
  renderEnzyme(
    <TestBed>
      <AppTheme>{ui}</AppTheme>
    </TestBed>,
    ...otherArgs
  )
