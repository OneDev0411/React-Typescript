import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import Draft, { convertToRaw, EditorState } from 'draft-js'
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import createImagePlugin from 'draft-js-image-plugin'
import 'draft-js-image-plugin/lib/plugin.css'

import createAlignmentPlugin from 'draft-js-alignment-plugin'
import 'draft-js-alignment-plugin/lib/plugin.css'

import createFocusPlugin from 'draft-js-focus-plugin'
import 'draft-js-focus-plugin/lib/plugin.css'

import createResizeablePlugin from 'draft-js-resizeable-plugin'

import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
// import createDragNDropUploadPlugin from '@mikeljames/draft-js-drag-n-drop-upload-plugin'

import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'
import cn from 'classnames'

import { FieldProps } from 'react-final-form'

import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

import IconBold from '../SvgIcons/Bold/IconBold'
import IconUnderline from '../SvgIcons/Underline/IconUnderline'
import IconItalic from '../SvgIcons/Italic/IconItalic'
import IconList from '../SvgIcons/List/ListIcon'
import IconNumberedList from '../SvgIcons/NumberedList/IconNumberedList'

import { EditorWrapper, Separator, Toolbar } from './styled'

import IconButton from './buttons/IconButton'
import HeadingButtons from './buttons/HeadingButtons'
import { FieldError } from '../final-form-fields/FieldError'
import { AddImageButton } from './buttons/AddImageButton'
import { getBlocksWhereEntityData } from './utils/get-block-where-entity-data'

const richButtonsPlugin = createRichButtonsPlugin()

const focusPlugin = createFocusPlugin()
const resizeablePlugin = createResizeablePlugin()
const blockDndPlugin = createBlockDndPlugin()
const alignmentPlugin = createAlignmentPlugin()
const { AlignmentTool } = alignmentPlugin

const imagePlugin = createImagePlugin({
  decorator: composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
  )
})

// const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
//   handleUpload: (...args) => {
//   },
//   addImage: (...args) => {
//     // return imagePlugin.addImage(...args)
//   }
// })

const {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  OLButton,
  ULButton,
  H1Button,
  H3Button,
  H4Button,
  H6Button
} = richButtonsPlugin

const defaultPlugins = [
  richButtonsPlugin,
  // dragNDropFileUploadPlugin,
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin
]

interface Props {
  defaultValue?: string
  input?: FieldProps<any>['input']
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
  plugins?: any[]
  settings?: any
  uploadImage?: (blob: File) => Promise<string>
}

interface EditorComponent {
  getEditorState: () => EditorState
  focus: () => void
}

/**
 * Html wysiwyg editor.
 *
 * NOTE: this is an uncontrolled (stateful) component, and `onChange`
 * prop is only for being notified of changes. However it's possible
 * to reset html content imperatively via ref.
 */
export const TextEditor = forwardRef(
  (
    {
      defaultValue = '',
      disabled = false,
      input = null,
      onChange = () => {},
      placeholder = 'Type something…',
      plugins = [],
      settings = {},
      uploadImage
    }: Props,
    ref
  ) => {
    const editorRef = useRef<EditorComponent>(null)
    const [editorState, setEditorState] = useState(
      EditorState.createWithContent(stateFromHTML(defaultValue))
    )

    useImperativeHandle(
      ref,
      () => ({
        // convenient method for resetting editor html content
        reset: (html = '') => {
          setEditorState(EditorState.createWithContent(stateFromHTML(html)))
        },
        // convenient method for getting plain text of the editor content
        getPlainText: () => {
          if (editorRef.current) {
            return editorRef.current
              .getEditorState()
              .getCurrentContent()
              .getPlainText()
          }

          return ''
        },
        // convenient method for getting html content of the editor
        getHtml: () => {
          if (editorRef.current) {
            return stateToHTML(
              editorRef.current.getEditorState().getCurrentContent()
            )
          }
        },
        /**
         * returns true if the content includes an image which is being uploaded
         */
        hasUploadingImage: () => {
          if (editorRef.current) {
            const entities = Object.values(
              convertToRaw(
                editorRef.current.getEditorState().getCurrentContent()
              ).entityMap
            )

            return entities.some(
              entity => entity.type === 'IMAGE' && entity.data.uploading
            )
          }
        },
        editorRef
      }),
      []
    )

    const handleChange = newState => {
      if (!newState) {
        return false
      }

      setEditorState(newState)

      const html = stateToHTML(newState.getCurrentContent())

      setTimeout(() => (input ? input.onChange(html) : onChange(html)))
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
      // We first convert image to data url and show it.
      const dataUrl = await readFileAsDataUrl(file)

      handleChange(
        imagePlugin.addImage(
          editorState,
          dataUrl,
          uploadImage ? { uploading: true } : {}
        )
      )

      // Then we try to upload it if the uploadImage function is provided.
      // When the upload is finished, we replace the image src with the uploaded
      // file's url.
      if (uploadImage) {
        const uploadedImageUrl = await uploadImage(file)

        if (editorRef.current) {
          const latestState = editorRef.current.getEditorState()

          setEditorState(replaceImage(latestState, dataUrl, uploadedImageUrl))
        }
      } else {
        console.warn(
          '[Editor]: dataURL image is inserted by no uploadImage passed. data urls will be preserved in the output'
        )
      }
    }

    const allPlugins = [...defaultPlugins, ...plugins]

    return (
      <Fragment>
        <Toolbar>
          <BoldButton>
            <IconButton>
              <IconBold />
            </IconButton>
          </BoldButton>

          <ItalicButton>
            <IconButton>
              <IconItalic />
            </IconButton>
          </ItalicButton>

          <UnderlineButton>
            <IconButton>
              <IconUnderline />
            </IconButton>
          </UnderlineButton>

          <Separator />

          <ULButton>
            <IconButton isBlockButton>
              <IconList />
            </IconButton>
          </ULButton>

          <OLButton>
            <IconButton isBlockButton>
              <IconNumberedList />
            </IconButton>
          </OLButton>

          <Separator />

          <HeadingButtons
            options={[
              {
                title: 'Small',
                component: H6Button
              },
              {
                title: 'Medium',
                component: H4Button
              },
              {
                title: 'Large',
                component: H3Button
              },
              {
                title: 'Huge',
                component: H1Button
              }
            ]}
          />

          <Separator />

          <AddImageButton
            onImageSelected={addImage}
            editorState={editorState}
          />
        </Toolbar>

        <EditorWrapper
          className={cn({
            'hide-placeholder': shouldHidePlaceholder(editorState)
          })}
          onClick={() => editorRef.current && editorRef.current.focus()}
          style={{
            minHeight: '10rem'
          }}
        >
          <Editor
            spellCheck
            readOnly={disabled}
            editorState={editorState}
            onChange={handleChange}
            plugins={allPlugins}
            placeholder={placeholder}
            ref={editorRef}
            {...settings}
          />
          <AlignmentTool />
        </EditorWrapper>

        {input && <FieldError name={input.name} />}
      </Fragment>
    )
  }
)

function shouldHidePlaceholder(editorState) {
  const contentState = editorState.getCurrentContent()

  if (!contentState.hasText()) {
    if (
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled'
    ) {
      return true
    }
  }

  return false
}

/**
 * Returns a new editorState in which the image with src `oldUrl` is replaced
 * with a new images with src `newUrl`.
 *
 */
function replaceImage(
  editorState: EditorState,
  oldUrl: string,
  newUrl: string
): EditorState {
  // find image blocks with src equal to `oldUrl`
  const blocks = getBlocksWhereEntityData(
    editorState,
    data => data.src === oldUrl
  )

  const key = blocks.first().get('key')

  // select the image to make the subsequent imagePlugin.addImage replace it.
  const newState = EditorState.acceptSelection(
    editorState,
    Draft.SelectionState.createEmpty(key)
  )

  // This adds an image with src equal to newUrl
  return imagePlugin.addImage(newState, newUrl)
}
