import React from 'react'

import Flex from 'styled-flex-component'
import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import IconButton from 'components/Button/IconButton'
import { H1 } from 'views/components/Typography/headings'

export function Header(props) {
  return (
    <Flex justifyBetween alignCenter style={{ margin: '2.5rem 0 2rem 0' }}>
      <H1>Split PDF</H1>
      <IconButton isFit iconSize="large" inverse onClick={props.onClose}>
        <SvgIcon path={mdiClose} />
      </IconButton>
    </Flex>
  )
}
