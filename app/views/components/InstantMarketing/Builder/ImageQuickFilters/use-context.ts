import React from 'react'

import { Context, FilterContext } from './context'

export function useContext() {
  return React.useContext(Context) as FilterContext
}
