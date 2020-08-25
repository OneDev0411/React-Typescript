import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'
import { composeDecorators } from 'draft-js-plugins-editor'
import createImagePlugin from 'draft-js-image-plugin'
import 'draft-js-image-plugin/lib/plugin.css'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import 'draft-js-alignment-plugin/lib/plugin.css'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'

import { getLastAddedImageBlock } from 'components/TextEditor/utils/get-last-added-image-block'
import { filterBlocks } from 'components/TextEditor/utils/filter-blocks'
import { blockEquals } from 'components/TextEditor/utils/block-equals'
import { isImageFile } from 'utils/file-utils/is-image-file'
import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'
import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import { useEditorPlugins } from '../../hooks/use-editor-plugins'
import { withUploadingIndicator } from '../../block-decorators/with-uploading-indicator'
import { resizableBugFixDecorator } from '../../block-decorators/resizable-bug-fix-decorator'
import { atomicBlockLinkDecorator } from '../../block-decorators/atomic-block-link-decorator'
import { resizablePluginOptions } from '../../config'
import { getImageSizeOptions } from './utils/get-image-size-options'
import { getImageDimensions } from './utils/get-image-dimensions'
import { removeUnwantedEmptyLineBeforeAtomic } from '../../modifiers/remove-unwanted-empty-block-before-atomic'
import { updateEntityData } from '../../modifiers/update-entity-data'
import { EditorContext } from '../../editor-context'
import { InlineImageToolbar } from './ImageInlineToolbar'
import { AddImageButton } from './AddImageButton'
import { AddGifButton } from './AddGifButton'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { useDropzonePropsInterceptor } from '../../hooks/use-dropzone-props-interceptor'

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
    const resizeablePlugin = createResizeablePlugin(resizablePluginOptions)
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

  function showNotificationForUnsupportedImage(
    unsupportedImageFile: File
  ): void {
    dispatch(
      addNotification({
        message: `Unable to load the file '${unsupportedImageFile.name}'. File type ${unsupportedImageFile.type} is not a supported image.`,
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
        const message = error?.response?.body?.message

        if (message) {
          dispatch(
            addNotification({
              message,
              status: 'error'
            })
          )
        }

        if (editorRef.current) {
          const latestState = editorRef.current.getEditorState()

          setEditorState(
            filterBlocks(latestState, block => !blockEquals(block, imageBlock))
          )
        }

        console.error(error)
      }
    } else {
      console.warn(
        '[Editor]: dataURL image is inserted by no uploadImage passed. data urls will be preserved in the output'
      )
    }
  }

  const addImageRef = useLatestValueRef(addImage)

  useDropzonePropsInterceptor(props => ({
    disabled: false,
    accept: props.fileAccept || 'image/*',
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
