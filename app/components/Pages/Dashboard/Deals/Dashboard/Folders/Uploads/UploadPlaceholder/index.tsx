import React, { useRef, useState } from 'react'

import { Tooltip } from '@material-ui/core'

import copy from 'utils/copy-text-to-clipboard'

import UploadManager from '../../../../UploadManager'
import { Container, ItemLink } from './styled'

interface Props {
  deal: IDeal
}

function UploadPlaceholder(props: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  const dropzoneRef = useRef<{
    open(): void
  } | null>(null)

  const handleCopyEmail = () => {
    copy(props.deal.email)
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 2000)
  }

  const handleSelectFile = () =>
    dropzoneRef.current && dropzoneRef.current.open()

  return (
    // @ts-ignore js component
    <UploadManager
      deal={props.deal}
      disableClick
      onRef={ref => (dropzoneRef.current = ref)}
    >
      <Container>
        Drag & drop, <ItemLink onClick={handleSelectFile}>upload</ItemLink> or
        email files to{' '}
        <Tooltip open={showTooltip} title="Email Address Copied">
          <ItemLink onClick={handleCopyEmail}>{props.deal.email}</ItemLink>
        </Tooltip>{' '}
      </Container>
    </UploadManager>
  )
}

export default UploadPlaceholder
