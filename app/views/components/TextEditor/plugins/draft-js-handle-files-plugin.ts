import Draft, { DraftHandleValue } from 'draft-js'

import { isImageFile } from 'utils/file-utils/is-image-file'

interface CreateFilePluginOptions {
  handleImage: (file: File) => any
  handleOtherFiles?: (file: File) => any
}

export function createFilePlugin({
  handleImage,
  handleOtherFiles
}: CreateFilePluginOptions) {
  // NOTE: draft-js-drag-n-drop-upload-plugin is crap! I know it exists!

  function handleFile(file: File): DraftHandleValue {
    if (file) {
      if (isImageFile(file)) {
        handleImage(file)

        return 'handled'
      }

      if (handleOtherFiles) {
        handleOtherFiles(file)

        return 'handled'
      }
    }

    return 'not-handled'
  }

  return {
    handleDroppedFiles: (
      selection: Draft.SelectionState,
      files: Array<File>
    ): DraftHandleValue => {
      return handleFile(files[0])
    },
    handlePastedFiles: (files: Array<File>): DraftHandleValue => {
      return handleFile(files[0])
    }
  }
}
