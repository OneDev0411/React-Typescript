import React from 'react'

import { ButtonBase, Tooltip } from '@material-ui/core'
import { mdiDotsHorizontal } from '@mdi/js'

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
    <Acl.BackOffice accessControlPolicy="ActiveTeamAndParents">
      <Tooltip title="Set Default Value">
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
          onClick={() => defaultValueContext.setAnnotation(annotation, type)}
        >
          <SvgIcon path={mdiDotsHorizontal} size={muiIconSizes.xsmall} />
        </ButtonBase>
      </Tooltip>
    </Acl.BackOffice>
  )
}
