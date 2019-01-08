import React from 'react'

import { DealItem } from './DealItem'
import { MlsItem } from './MlsItem'

export default props => {
  if (props.item.type === 'deal') {
    return <DealItem {...props} />
  }

  return <MlsItem {...props} />
}
