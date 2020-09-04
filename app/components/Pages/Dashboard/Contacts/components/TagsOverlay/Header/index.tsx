import React from 'react'
import { Link } from 'react-router'
import Flex from 'styled-flex-component'

import { mdiCog, mdiClose } from '@mdi/js'

import ToolTip from 'components/tooltip'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { Title } from 'components/OverlayDrawer/Header/styled'
import IconButton from 'components/Button/IconButton'

import { HeaderContainer } from './styled'

interface Props {
  title: string
  onClose: () => any
}

export default function Header({ title, onClose }: Props) {
  return (
    <HeaderContainer>
      <Flex alignCenter>
        <Title
          style={{
            display: 'inline-block'
          }}
        >
          {title}
        </Title>
      </Flex>

      <Flex alignCenter>
        <Link
          style={{
            marginRight: '0.5rem',
            paddingTop: '0.3rem'
          }}
          to="/dashboard/account/manage-tags"
        >
          <ToolTip caption="Manage tags" placement="bottom">
            <SvgIcon path={mdiCog} size={muiIconSizes.small} />
          </ToolTip>
        </Link>
        <IconButton
          type="button"
          isFit
          iconSize="large"
          inverse
          onClick={onClose}
        >
          <SvgIcon path={mdiClose} />
        </IconButton>
      </Flex>
    </HeaderContainer>
  )
}
