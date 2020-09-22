import React from 'react'
import { ButtonBase } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { mdiFileEdit } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useDefaultValueContext } from 'deals/FormEdit/Editor/DefaultValues/use-default-value-content'
import { IAppState } from 'reducers'
import { getActiveTeam } from 'utils/user-teams'

interface Props {
  style: React.CSSProperties
  annotation: IFormAnnotation
  type: number
}

export function EditTemplateButton({ style, annotation, type }: Props) {
  const defaultValueContext = useDefaultValueContext()
  const activeTeam = useSelector<IAppState, IUserTeam | null>(({ user }) =>
    getActiveTeam(user)
  )

  if (!activeTeam?.acl.includes('BackOffice')) {
    return null
  }

  return (
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
  )
}
