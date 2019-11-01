import React from 'react'

import { Item } from '../../styled'

export function Loading() {
  return (
    <Item showBorder isSaving>
      Saving ...
    </Item>
  )
}
