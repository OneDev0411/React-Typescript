import Draft, { DraftHandleValue } from 'draft-js'

import { isImageFile } from 'utils/file-utils/is-image-file'

interface CreateFilePluginOptions {
  handleImage: (file: File) => any
  handleOtherFiles?: (file: File[]) => any
}

export function createFilePlugin({
  handleImage,
  handleOtherFiles
}: CreateFilePluginOptions) {
  // NOTE: draft-js-drag-n-drop-upload-plugin is crap! I know it exists!

  function handleFiles(files: File[]): DraftHandleValue {
    if (files) {
      if (isImageFile(files[0] && files[0])) {
        handleImage(files[0])

        return 'handled'
      }

      if (handleOtherFiles) {
        handleOtherFiles(files)

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
      return handleFiles(files)
    },
    handlePastedFiles: (files: Array<File>): DraftHandleValue => {
      return handleFiles(files)
    }
  }
}
