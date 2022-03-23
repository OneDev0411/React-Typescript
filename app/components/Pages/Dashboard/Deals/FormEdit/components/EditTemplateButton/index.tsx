import React from 'react'

import { ButtonBase, MenuItem, MenuList } from '@material-ui/core'
import { mdiCogOutline, mdiDotsHorizontal } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import Acl from 'components/Acl'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useDefaultValueContext } from 'deals/FormEdit/Editor/DefaultValues/use-default-value-content'

interface Props {
  style: React.CSSProperties
  annotation: IFormAnnotation
  type: number
}

export function EditTemplateButton({ style, annotation, type }: Props) {
  const defaultValueContext = useDefaultValueContext()

  return (
    <Acl.BackOffice>
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
                defaultValueContext.setAnnotation(annotation, type)
                close()
              }}
            >
              <SvgIcon
                path={mdiCogOutline}
                color="rgb(161,161,161)"
                size={muiIconSizes.medium}
                rightMargined
              />
              Set Default Value
            </MenuItem>
          </MenuList>
        )}
      />
    </Acl.BackOffice>
  )
}
