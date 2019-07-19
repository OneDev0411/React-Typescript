import timeago from 'timeago.js'

import React from 'react'
import Flex from 'styled-flex-component'

import ALink from 'components/ALink'
import Avatar from 'components/Avatar/index'

import { AccountInfoWrapper } from './styled'

interface Props {
  account: IGoogleAccount
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
          Synced {timeago().format(account.last_sync_at)}{' '}
          <span className="dot">.</span>
          <ALink>Settings</ALink>
        </div>
      </AccountInfoWrapper>
    </Flex>
  )
}
