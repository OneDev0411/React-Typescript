import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import { Divider } from 'components/Divider'
import { primary } from 'views/utils/colors'
import Icon from 'components/SvgIcons/AutoEmail/IconAutoEmail'

export function MetaInfo({ scheduledFor }) {
  return (
    <Flex alignCenter style={{ marginBottom: '2em' }}>
      <Icon style={{ marginRight: '0.5em', fill: primary }} />
      <span>Auto Email</span>
      <Divider margin="0 0.5em" width="1px" height="16px" />
      <span style={{ color: primary, fontWeight: 500 }}>
        Send on{' '}
        {fecha.format(new Date(scheduledFor * 1000), 'MMM D, YYYY hh:mm A')}
      </span>
    </Flex>
  )
}
