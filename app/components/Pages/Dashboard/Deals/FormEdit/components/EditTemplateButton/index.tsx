import React from 'react'
import { ButtonBase } from '@material-ui/core'

import { mdiFileEdit } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useDefaultValueContext } from 'deals/FormEdit/Editor/DefaultValues/use-default-value-content'
import Acl from 'components/Acl'

interface Props {
  style: React.CSSProperties
  annotation: IFormAnnotation
  type: number
}

export function EditTemplateButton({ style, annotation, type }: Props) {
  const defaultValueContext = useDefaultValueContext()

  return (
    <Acl.BackOffice accessControlPolicy="ActiveTeamAndParents">
      <ButtonBase
        className="button-default-value"
        style={{
          position: 'absolute',
          cursor: 'pointer',
          ...style
        }}
        onClick={() => defaultValueContext.setAnnotation(annotation, type)}
      >
        <SvgIcon size={0.6} path={mdiFileEdit} />
      </ButtonBase>
    </Acl.BackOffice>
  )
}
