import * as React from 'react'
import { render } from '@testing-library/react'

import { AppTheme } from '../../../app/AppTheme'

export const renderWithTheme: typeof render = (ui, ...otherArgs) =>
  render(<AppTheme>{ui}</AppTheme>, ...otherArgs)
