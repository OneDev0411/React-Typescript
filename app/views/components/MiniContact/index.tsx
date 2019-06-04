import React, { useEffect } from 'react'

import Popover from 'components/Popover'

import MiniProfile from './MiniProfile'

export type MiniContactType = 'contact' | 'user' | 'insight'

interface MiniContactPropsType {
  type: MiniContactType
  data: {}
  children: React.ReactNode
}

function MiniContact(props: MiniContactPropsType) {
  return (
    <Popover
      popoverClasses={['white--popover-noPadding']}
      placement={'bottom'}
      caption={<MiniProfile initData={props.data} type={props.type} />}
    >
      {props.children}
    </Popover>
  )
}

export default MiniContact
