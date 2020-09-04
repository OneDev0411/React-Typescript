import React from 'react'
import moment from 'moment'
import Lightbox from 'react-images'
import { mdiAttachment } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { PdfViewerModal } from 'components/PdfViewer/Modal'

import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

export default ({ comment, attachments, openFilesInNewTab }) => (
  <div className="attachment">
    <div>{comment}</div>

    <div className="list">
      <ImageAttachments attachments={attachments} />
      <PdfAttachments
        attachments={attachments}
        openFilesInNewTab={openFilesInNewTab}
      />
      <UnknownAttachments attachments={attachments} />
    </div>
  </div>
)

/**
 * render image attachments
 */
class ImageAttachments extends React.Component {
  state = {
    showLightbox: false,
    currentImage: 0
  }

  render() {
    const { attachments } = this.props
    const { showLightbox } = this.state

    const images = attachments
      .filter(file => file.mime.includes('image/'))
      .map(file => ({
        id: file.id,
        src: file.url,
        name: truncateTextFromMiddle(file.name),
        preview_url: file.preview_url,
        date: moment.unix(file.updated_at).format('MMM DD, YYYY')
      }))

    return (
      <div className="inline">
        <Lightbox
          images={images}
          isOpen={showLightbox}
          currentImage={this.state.currentImage}
          onClose={() => {
            this.setState({ showLightbox: false })
          }}
          onClickNext={() => {
            this.setState(state => ({ currentImage: state.currentImage + 1 }))
          }}
          onClickPrev={() => {
            this.setState(state => ({ currentImage: state.currentImage - 1 }))
          }}
        />

        {images.map((file, key) => (
          <div
            key={`FILE_${file.id}`}
            className="item"
            onClick={() => {
              this.setState({
                currentImage: key,
                showLightbox: true
              })
            }}
          >
            <img src={file.preview_url} alt="" />

            <div>
              <div className="file-title">{file.name}</div>
              <div className="file-date">{file.date}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

/**
 * render pdf attachments
 */
// eslint-disable-next-line react/no-multi-comp
class PdfAttachments extends React.Component {
  state = {
    selectedFile: {},
    showViewer: false
  }

  render() {
    const { attachments, openFilesInNewTab } = this.props
    const { showViewer, selectedFile } = this.state

    const pdfs = attachments
      .filter(file => file.mime === 'application/pdf')
      .map(file => ({
        id: file.id,
        src: file.url,
        name: truncateTextFromMiddle(file.name),
        date: moment.unix(file.updated_at).format('MMM DD, YYYY')
      }))

    if (openFilesInNewTab) {
      return (
        <div className="inline">
          {pdfs.map(file => (
            <a href={file.src} key={`PDF_FILE_${file.id}`} target="_blank">
              <div className="item">
                <div className="file-attach-icon">
                  <SvgIcon path={mdiAttachment} />
                </div>

                <div>
                  <div className="file-title">{file.name}</div>
                  <div className="file-date">{file.date}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )
    }

    return (
      <div className="inline">
        <PdfViewerModal
          title={truncateTextFromMiddle(selectedFile.name)}
          url={selectedFile.src}
          isOpen={showViewer}
          onClose={() => this.setState({ showViewer: false })}
        />

        {pdfs.map(file => (
          <div
            key={`PDF_FILE_${file.id}`}
            className="item"
            onClick={() => {
              this.setState({
                selectedFile: file,
                showViewer: true
              })
            }}
          >
            <div className="file-attach-icon">
              <SvgIcon path={mdiAttachment} />
            </div>

            <div>
              <div className="file-title">{file.name}</div>
              <div className="file-date">{file.date}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

/**
 * render unknown attachments
 */
const UnknownAttachments = ({ attachments }) => {
  const files = attachments
    .filter(
      file => file.mime !== 'application/pdf' && !file.mime.includes('image/')
    )
    .map(file => ({
      id: file.id,
      url: file.url,
      name: truncateTextFromMiddle(file.name),
      date: moment.unix(file.updated_at).format('MMM DD, YYYY')
    }))

  return (
    <div className="inline">
      {files.map(file => (
        <a href={file.url} key={`UNKNOWN_FILE_${file.id}`} target="_blank">
          <div className="item">
            <div className="file-attach-icon">
              <SvgIcon path={mdiAttachment} />
            </div>

            <div>
              <div className="file-title">{file.name}</div>
              <div className="file-date">{file.date}</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
