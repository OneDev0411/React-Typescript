import * as React from 'react'
import { render } from '@testing-library/react'
import { render as renderEnzyme } from 'enzyme'

import { AppTheme } from '../../../app/AppTheme'

export const renderWithTheme = (ui, ...otherArgs) =>
  render(<AppTheme>{ui}</AppTheme>, ...otherArgs)

export const renderWithThemeEnzyme: typeof renderEnzyme = (ui, ...otherArgs) =>
  renderEnzyme(<AppTheme>{ui}</AppTheme>, ...otherArgs)
