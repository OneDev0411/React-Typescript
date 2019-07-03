import React from 'react'
import { Link } from 'react-router'
import Flex from 'styled-flex-component'

import ToolTip from 'components/tooltip'
import IconCog from 'components/SvgIcons/Cog/IconCog'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
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
          <ToolTip caption="Manage your tags" placement="bottom">
            <IconCog />
          </ToolTip>
        </Link>
        <IconButton
          type="button"
          isFit
          iconSize="large"
          inverse
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </Flex>
    </HeaderContainer>
  )
}
