import React from 'react'
import { useSelector } from 'react-redux'

import { Link } from 'react-router'

import { IAppState } from 'reducers'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'
import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'
import { getFileType } from 'utils/file-utils/get-file-type'

import { useStyles } from '../../styles'

interface Props {
  deal: IDeal
  file: IFile
  taskId: UUID
  isBackOffice: boolean
  children: React.ReactNode
}

export function ItemLink({
  deal,
  file,
  taskId,
  isBackOffice,
  children
}: Props) {
  const classes = useStyles()

  const envelopes = useSelector<IAppState, IDealEnvelope[]>(({ deals }) =>
    selectDealEnvelopes(deal, deals.envelopes)
  )

  const documentEnvelopes = getDocumentEnvelopes(envelopes, file)

  if (
    isBackOffice === false &&
    getFileType(file) === 'pdf' &&
    documentEnvelopes.length === 0
  ) {
    return (
      <Link to={file.url} target="_blank">
        {children}
      </Link>
    )
  }

  const link =
    documentEnvelopes.length > 0
      ? `envelope/${documentEnvelopes[0].id}`
      : `attachment/${file.id}`

  return (
    <Link
      className={classes.link}
      to={`/dashboard/deals/${deal.id}/view/${taskId}/${link}`}
    >
      {children}
    </Link>
  )
}
