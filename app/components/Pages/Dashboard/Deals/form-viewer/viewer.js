import React from 'react'
import PdfViewer from '../../../../Partials/Pdf/Viewer'

export default ({
  width,
  file,
  enableKeyboardShortcuts = true
}) => {
  const { name, type, url, downloadUrl } = file

  return (
    <div
      style={{
        minWidth: width,
        maxWidth: width
      }}
      className="file-viewer"
    >
      {
        file && type === 'pdf' &&
        <PdfViewer
          uri={url}
          enableKeyboardShortcuts={enableKeyboardShortcuts}
          downloadUrl={downloadUrl}
          defaultContainerHeight="85vh"
        />
      }

      {
        file && type === 'image' &&
        <img
          className="image"
          src={url}
          alt={name}
        />
      }
    </div>
  )
}
