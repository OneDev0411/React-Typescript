import React from 'react'
import PdfViewer from '../../../../Partials/Pdf/Viewer'

function getExtensionName(file) {
  return file.name.split('.').pop()
}

export default ({ width, file, disableKeyboardShortcuts = false }) => {
  const { name, type, url, downloadUrl } = file

  return (
    <div
      style={{
        minWidth: width,
        maxWidth: width
      }}
      className="file-viewer"
    >
      {file &&
        type === 'pdf' && (
          <PdfViewer
            uri={url}
            downloadUrl={downloadUrl}
            defaultContainerHeight="85vh"
            disableKeyboardShortcuts={disableKeyboardShortcuts}
          />
        )}

      {file &&
        type === 'image' && <img className="image" src={url} alt={name} />}

      {file &&
        type === 'unknown' && (
          <div className="no-preview">
            Can not preview <strong>.{getExtensionName(file)}</strong> files
            <p className="file-name">{file.name}</p>
            <div>
              <a href={file.url}>Download</a>
            </div>
          </div>
        )}
    </div>
  )
}
