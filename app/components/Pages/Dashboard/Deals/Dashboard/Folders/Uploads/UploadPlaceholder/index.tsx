import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import copy from 'utils/copy-text-to-clipboard'

import UploadManager from '../../../../UploadManager'
import { Container, ItemLink } from './styled'

interface DispatchProps {
  notify: typeof notify
}

interface Props {
  deal: IDeal
}

function UploadPlaceholder(props: Props & DispatchProps) {
  const dropzoneRef = useRef<{
    open(): void
  } | null>(null)

  const handleCopyEmail = () => {
    copy(props.deal.email)
    props.notify({
      message: 'Link Copied',
      status: 'success'
    })
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
        <ItemLink onClick={handleCopyEmail}>{props.deal.email}</ItemLink>{' '}
      </Container>
    </UploadManager>
  )
}

export default connect(
  null,
  () => ({ notify })
)(UploadPlaceholder)
