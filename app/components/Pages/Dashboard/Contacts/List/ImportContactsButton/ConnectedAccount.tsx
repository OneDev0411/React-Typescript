import timeago from 'timeago.js'

import React from 'react'
import Flex from 'styled-flex-component'

import styled from 'styled-components'

import ALink from 'components/ALink'
import Avatar from 'components/Avatar'
import { grey, primary } from 'views/utils/colors'

interface Props {
  account: IGoogleAccount
}

const AccountInfoWrapper = styled.div`
  line-height: 1.5;
  .header {
    font-weight: 600;
  }
  .secondary {
    color: ${grey.A900};
  }
  .dot {
    margin: 0 0.8rem;
  }
  ${ALink} {
    color: ${primary};
  }
`

export function ConnectedAccount({ account }: Props) {
  return (
    <Flex inline alignCenter style={{ verticalAlign: 'middle' }}>
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
