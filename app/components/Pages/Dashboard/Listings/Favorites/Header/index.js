import React from 'react'
import Flex from 'styled-flex-component'

import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'
import { H1 } from '../../../../../../views/components/Typography/headings'

import { ViewSwitcher } from '../../components/ViewSwitcher'

export function Header(props) {
  return (
    <Flex
      alignCenter
      justifyBetween
      style={{ padding: '1.5em', borderBottom: '1px solid #d4d4d4' }}
    >
      <Flex alignCenter>
        {props.user && (
          <MenuTrigger
            onClick={props.toggleSideMenu}
            isExpended={props.isSideMenuOpen}
          />
        )}
        <H1 style={{ marginLeft: '0.5rem' }}>Following</H1>
      </Flex>

      <ViewSwitcher
        activeView={props.activeView}
        onChange={props.onChangeView}
      />
    </Flex>
  )
}
