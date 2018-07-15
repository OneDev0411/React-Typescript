import React from 'react'
import Lightbox from 'react-images'

import PdfModal from '../../../../../Partials/Pdf/Modal'

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
        preview_url: file.preview_url,
        src: file.url
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
            this.setState({ currentImage: this.state.currentImage + 1 })
          }}
          onClickPrev={() => {
            this.setState({ currentImage: this.state.currentImage - 1 })
          }}
        />

        {images.map((file, key) => (
          <div key={`FILE_${file.id}`} className="item">
            <img
              onClick={() => {
                this.setState({
                  currentImage: key,
                  showLightbox: true
                })
              }}
              src={file.preview_url}
              alt=""
            />
          </div>
        ))}
      </div>
    )
  }
}

/**
 * render pdf attachments
 */
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
        preview_url: file.preview_url,
        src: file.url
      }))

    if (openFilesInNewTab) {
      return (
        <div className="inline">
          {pdfs.map((file, key) => (
            <div key={`PDF_FILE_${file.id}`} className="item">
              <a href={file.src} target="_blank">
                <img src={file.preview_url} />
              </a>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="inline">
        <PdfModal
          file={{
            type: 'pdf',
            name: selectedFile.name,
            src: selectedFile.src
          }}
          isActive={showViewer}
          onCloseHandler={() => this.setState({ showViewer: false })}
        />

        {pdfs.map((file, key) => (
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
            <img src={file.preview_url} />
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
      preview_url: file.preview_url,
      url: file.url
    }))

  return (
    <div className="inline">
      {files.map((file, key) => (
        <div key={`UNKNOWN_FILE_${file.id}`} className="item">
          <a href={file.url} target="_blank">
            <img src={file.preview_url} alt="" />
          </a>
        </div>
      ))}
    </div>
  )
}
