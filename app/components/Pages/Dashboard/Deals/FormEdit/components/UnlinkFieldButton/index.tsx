import React from 'react'

import { ButtonBase, MenuItem, MenuList } from '@material-ui/core'
import { mdiDotsHorizontal, mdiPencilOutline } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  style: React.CSSProperties
  onClick: () => void
}

export function UnlinkFieldButton({ style, onClick }: Props) {
  return (
    <BaseDropdown
      placement="bottom-end"
      renderDropdownButton={renderProps => (
        <ButtonBase
          className="button-visible-on-hover"
          style={{
            position: 'absolute',
            cursor: 'pointer',
            width: '16px',
            color: '#fff',
            backgroundColor: 'rgb(33, 118, 203)',
            borderRadius: '0 4px 4px 0',
            ...style
          }}
          {...renderProps}
        >
          <SvgIcon path={mdiDotsHorizontal} size={muiIconSizes.xsmall} />
        </ButtonBase>
      )}
      renderMenu={({ close }) => (
        <MenuList>
          <MenuItem
            onClick={() => {
              onClick()
              close()
            }}
          >
            <SvgIcon
              path={mdiPencilOutline}
              color="rgb(161,161,161)"
              size={muiIconSizes.medium}
              rightMargined
            />
            Make Editable
          </MenuItem>
        </MenuList>
      )}
    />
  )
}
