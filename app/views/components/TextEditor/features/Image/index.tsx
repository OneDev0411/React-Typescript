import React, { useContext } from 'react'

import 'draft-js-image-plugin/lib/plugin.css'
import 'draft-js-alignment-plugin/lib/plugin.css'

import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createImagePlugin from 'draft-js-image-plugin'
import { composeDecorators } from 'draft-js-plugins-editor'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import { useDispatch } from 'react-redux'

import { addNotification } from 'components/notification'
import { removeBlock } from 'components/TextEditor/modifiers/remove-block'
import { doesContainBlock } from 'components/TextEditor/utils/does-contain-block'
import { getLastAddedImageBlock } from 'components/TextEditor/utils/get-last-added-image-block'
import { useLatestValueRef } from 'hooks/use-latest-value-ref'
import { getLocalFileType } from 'utils/file-utils/get-file-type'
import { isImageFile } from 'utils/file-utils/is-image-file'
import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

import { atomicBlockLinkDecorator } from '../../block-decorators/atomic-block-link-decorator'
import { resizableBugFixDecorator } from '../../block-decorators/resizable-bug-fix-decorator'
import { withUploadingIndicator } from '../../block-decorators/with-uploading-indicator'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { EditorContext } from '../../editor-context'
import { useDropzonePropsInterceptor } from '../../hooks/use-dropzone-props-interceptor'
import { useEditorPlugins } from '../../hooks/use-editor-plugins'
import { removeUnwantedEmptyLineBeforeAtomic } from '../../modifiers/remove-unwanted-empty-block-before-atomic'
import { updateEntityData } from '../../modifiers/update-entity-data'

import { AddGifButton } from './AddGifButton'
import { AddImageButton } from './AddImageButton'
import { InlineImageToolbar } from './ImageInlineToolbar'
import { getImageDimensions } from './utils/get-image-dimensions'
import { getImageSizeOptions } from './utils/get-image-size-options'

interface Props {
  /**
   * an optional function to be used when an image is
   * added to the editor. It should upload the image and return the promise
   * of the uploaded image url. The src of the image in the editor will be
   * uploaded to that uploaded image url.
   * @param file
   */
  uploadImage?: (file: File) => Promise<string>
  allowGif?: boolean
}

export function ImageFeature({ uploadImage, allowGif = true }: Props) {
  const dispatch = useDispatch()

  const { editorState, setEditorState, editorRef } = useContext(EditorContext)

  const { imagePlugin } = useEditorPlugins(() => {
    const resizeablePlugin = createResizeablePlugin()
    const blockDndPlugin = createBlockDndPlugin()
    const alignmentPlugin = createAlignmentPlugin()

    const focusPlugin = createFocusPlugin({
      theme: { focused: 'focused', unfocused: 'unfocused' }
    })

    const imagePlugin = createImagePlugin({
      decorator: composeDecorators(
        withUploadingIndicator,
        resizableBugFixDecorator,
        resizeablePlugin.decorator,
        atomicBlockLinkDecorator,
        alignmentPlugin.decorator,
        focusPlugin.decorator,
        blockDndPlugin.decorator
      )
    })

    return {
      blockDndPlugin,
      focusPlugin,
      alignmentPlugin,
      resizeablePlugin,
      imagePlugin
    }
  }, [])

  function showNotificationForUnsupportedImage(file: File): void {
    const fileType = getLocalFileType(file)

    dispatch(
      addNotification({
        message: `Please use Attachment feature to upload ${fileType}, You can only drag and drop JPG, JPEG, PNG, GIF, and SVG.`,
        status: 'error'
      })
    )
  }

  /**
   * Adds an image to the editor from a URL or dataURL. if it's a dataUrl
   * and `uploadImage` prop is provided, it will be called with a Blob
   * object to upload the image. `uploadImage` should return a promise
   * which is resolved to the url of the uploaded image. when it's resolved
   * the url of the image will be replaced with that.
   *
   * Note that it's not necessarily required to pass `uploadImage`, if
   * data urls in the output are accepted. It's not the case for emails
   * for example as data urls are not well supported in emails.
   *
   * This function can be called either when an image is dropped into the
   * editor or it's selected via an image picker UI (created by
   * AddImageButton)
   * @param file
   */
  const addImage = async (file: File) => {
    if (!isImageFile(file)) {
      return showNotificationForUnsupportedImage(file)
    }

    // We first convert image to data url and show it.
    const dataUrl = await readFileAsDataUrl(file)

    const { bestFit } = getImageSizeOptions(await getImageDimensions(dataUrl))

    const newEditorState = removeUnwantedEmptyLineBeforeAtomic(
      imagePlugin.addImage(
        editorState,
        dataUrl,
        uploadImage ? { uploading: true, ...bestFit } : bestFit
      )
    )
    const imageBlock = getLastAddedImageBlock(editorState, newEditorState)

    setEditorState(newEditorState)

    // Then we try to upload it if the uploadImage function is provided.
    // When the upload is finished, we replace the image src with the uploaded
    // file's url.
    if (uploadImage) {
      try {
        const uploadedImageUrl = await uploadImage(file)

        if (editorRef.current) {
          const latestState = editorRef.current.getEditorState()

          setEditorState(
            updateEntityData(
              imagePlugin,
              latestState,
              data => data.src === dataUrl,
              { src: uploadedImageUrl, uploading: false }
            )
          )
        }
      } catch (error) {
        console.error(error)

        if (editorRef.current && imageBlock) {
          const latestState = editorRef.current.getEditorState()
          const imageBlockKey = imageBlock.getKey()

          if (doesContainBlock(latestState, imageBlockKey, 'atomic')) {
            const message = error?.response?.body?.message

            if (message) {
              dispatch(
                addNotification({
                  message,
                  status: 'error'
                })
              )
            }

            setEditorState(removeBlock(latestState, imageBlockKey))
          }
        }
      }
    } else {
      console.warn(
        // eslint-disable-next-line max-len
        '[Editor]: dataURL image is inserted by no uploadImage passed. data urls will be preserved in the output'
      )
    }
  }

  const addImageRef = useLatestValueRef(addImage)

  useDropzonePropsInterceptor(props => ({
    disabled: false,
    accept: props.fileAccept,
    onDrop: (files: File[]) => {
      const file = files?.[0]

      if (file) {
        if (!isImageFile(file)) {
          return showNotificationForUnsupportedImage(file)
        }

        return addImageRef.current(file)
      }

      if (props.onDrop) {
        return props.onDrop(files)
      }
    }
  }))

  const addImageByUrl = (url: string, width?: number) =>
    setEditorState(imagePlugin.addImage(editorState, url, { width }))

  return (
    <>
      <ToolbarFragment group="image">
        <AddImageButton onImageSelected={addImage} />
        {allowGif && <AddGifButton onImageSelected={addImageByUrl} />}
      </ToolbarFragment>
      <InlineImageToolbar
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </>
  )
}
