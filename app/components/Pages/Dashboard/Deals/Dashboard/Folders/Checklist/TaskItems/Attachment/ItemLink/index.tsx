import React from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'
import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'

import { ItemLink as Link } from '../../styled'

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
    <Link to={`/dashboard/deals/${deal.id}/view/${taskId}/${link}`}>
      {children}
    </Link>
  )
}

function getFileType(file: IFile): string {
  if (file.mime === 'application/pdf') {
    return 'pdf'
  }

  if (file.mime.includes('image/')) {
    return 'image'
  }

  return 'unknown'
}
