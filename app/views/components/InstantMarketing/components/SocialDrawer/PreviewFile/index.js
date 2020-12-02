import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'components/notification'

import { getFileType } from 'utils/file-utils/get-file-type'

import Spinner from 'components/Spinner'
import { PdfThumbnail } from 'components/PdfThumbnail'

import { Container, Image, Video, Error } from './styled'

function preview(instance) {
  const fileType = getFileType(instance.file)

  if (fileType === 'pdf') {
    return (
      <PdfThumbnail
        url={instance.file.url}
        style={{
          height: '100%'
        }}
      />
    )
  }

  if (fileType === 'image') {
    return <Image src={instance.file.url} alt="" />
  }

  return (
    <Video
      muted
      autoPlay="true"
      loop="true"
      type="video/mp4"
      src={instance.file.url}
    />
  )
}

function PreviewFile(props) {
  return (
    <Container>
      {props.error && <Error>{props.error}</Error>}

      {!props.instance && !props.error && (
        <Fragment>
          <Spinner />
          Looking good! We are prepping your design to share, this could take a
          minute...
        </Fragment>
      )}

      {props.instance && preview(props.instance)}
    </Container>
  )
}

export default connect(null, { notify })(PreviewFile)
