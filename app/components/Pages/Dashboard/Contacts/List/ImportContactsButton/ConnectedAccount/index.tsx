import React from 'react'
import Flex from 'styled-flex-component'

import ALink from 'components/ALink'
import Avatar from 'components/Avatar/index'

import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'

import { AccountInfoWrapper } from './styled'

interface Props {
  account: IOAuthAccount
}

export function ConnectedAccount({ account }: Props) {
  return (
    <Flex inline alignCenter style={{ verticalAlign: 'middle' }}>
      {/*
      // @ts-ignore props are detected mandatory from js file */}
      <Avatar
        size={32}
        style={{ marginRight: '1rem' }}
        title={account.display_name}
        image={account.photo}
      />
      <AccountInfoWrapper>
        <div className="header">{account.email}</div>
        <div className="secondary">
          <ConnectedAccountSyncStatus account={account} />{' '}
          <span className="dot">.</span>
          <ALink>Settings</ALink>
        </div>
      </AccountInfoWrapper>
    </Flex>
  )
}
