import Downshift from 'downshift'
import Flex from 'styled-flex-component'

import * as PropTypes from 'prop-types'
import React from 'react'

import Link from '../../../../../../views/components/Button/LinkButton'

import { UserMenuWrapper } from '../../styled'
import { DropdownButton } from './DropdownButton'
import { UserMenuContent } from './UserMenuContent'

UserMenu.propTypes = {
  user: PropTypes.any,
  open: PropTypes.any,
  onToggle: PropTypes.any,
  brandLogoSrc: PropTypes.string
}

export function UserMenu(props) {
  return props.user ? (
    <Downshift
      isOpen={props.open}
      onOuterClick={props.onToggle}
      onToggle={props.onToggle}
    >
      {({ isOpen }) => (
        <div>
          <UserMenuWrapper>
            <DropdownButton
              user={props.user}
              bsRole="toggle"
              onClick={props.onToggle}
              isDropDownOpen={props.open}
            />
            {isOpen && (
              <UserMenuContent user={props.user} onClose={props.onToggle} />
            )}
          </UserMenuWrapper>
        </div>
      )}
    </Downshift>
  ) : (
    <Flex center style={{ padding: '0.75em 0' }}>
      <Link to="/">
        <img src={props.brandLogoSrc} alt="Rechat" width="32" height="32" />
      </Link>
    </Flex>
  )
}
