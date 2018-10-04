import React from 'react'
import Flex from 'styled-flex-component'

import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'
import PageHeader from '../../../../../../views/components/PageHeader'

import { ViewSwitcher } from '../../components/ViewSwitcher'

export function Header(props) {
  const { subtitle } = props

  return (
    <PageHeader
      style={{
        margin: 0,
        width: '100%',
        minHeight: '6rem',
        borderBottom: '1px solid #d4d4d4',
        padding: subtitle ? '1.5em 1.5em 1em' : '1.5em'
      }}
    >
      <Flex>
        <MenuTrigger
          onClick={props.toggleSideMenu}
          isExpended={props.isSideMenuOpen}
          style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
        />
        <Flex column>
          <PageHeader.Heading style={{ fontSize: '1.5rem', lineHeight: 1 }}>
            {props.title}
          </PageHeader.Heading>
          {subtitle && (
            <PageHeader.Subtitle style={{ marginTop: '0.5em' }}>
              {subtitle}
            </PageHeader.Subtitle>
          )}
        </Flex>
      </Flex>

      <PageHeader.Menu>
        <ViewSwitcher
          activeView={props.activeView}
          onChange={props.onChangeView}
        />
      </PageHeader.Menu>
    </PageHeader>
  )
}
