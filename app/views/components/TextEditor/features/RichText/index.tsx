import React, { useRef, useState, useContext } from 'react'

import { Tooltip } from '@material-ui/core'
import {
  mdiLink,
  mdiFormatListNumbered,
  mdiFormatListBulleted,
  mdiFormatUnderline,
  mdiFormatItalic,
  mdiFormatBold
} from '@mdi/js'
import { ContentBlock, Editor as DraftEditor } from 'draft-js'
import createAnchorPlugin from 'draft-js-anchor-plugin'
import { DraftJsPlugin } from 'draft-js-plugins-editor'
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'

import { getShortcutTooltip } from 'utils/get-shortcut-tooltip'

import { SvgIcon } from '../../../SvgIcons/SvgIcon'
import {
  DraftJsSelectionPopover,
  SelectionPopoverRenderProps
} from '../../components/DraftJsSelectionPopover'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { ToolbarIconButton } from '../../components/ToolbarIconButton'
import { ToolbarToggleButton } from '../../components/ToolbarToggleButton'
import { EditorContext } from '../../editor-context'
import { useEditorPlugins } from '../../hooks/use-editor-plugins'
import { getSelectedAtomicBlock } from '../../utils/get-selected-atomic-block'
import { linkKeyBinding } from '../../utils/link-key-binding'

import createPasteLinkPlugin from './draft-js-paste-link-plugin'
import HeadingButtons from './HeadingButtons'
import { LinkEditorPopover } from './LinkEditorPopover'
import { LinkPreview } from './LinkPreview'

interface Props {
  /**
   * Support for bold, italic and underline.
   * Defaults to true
   */
  inlineFormatting?: boolean
  /**
   * Support for links
   * Defaults to true
   */
  link?: boolean
  /**
   * Support for ordered and unordered lists
   * Defaults to true
   */
  lists?: boolean

  /**
   * Support for text size options
   * Default to true
   */
  textSize?: boolean
}

export function RichTextFeature({
  inlineFormatting = true,
  link = true,
  lists = true,
  textSize = true
}: Props) {
  const { editorState, setEditorState, editorRef } = useContext(EditorContext)
  const originalEditorRef = useRef<DraftEditor | null>(null)

  if (editorRef.current) {
    originalEditorRef.current = editorRef.current.editor
  }

  const { richButtonsPlugin } = useEditorPlugins(() => {
    const linkPlugins: { [key: string]: DraftJsPlugin } = link
      ? {
          anchorPlugin: createAnchorPlugin({}),
          pasteLinkPlugin: createPasteLinkPlugin(),
          // Can be extracted into a separate plugin file
          linkShortcutsPlugin: {
            handleKeyCommand: command => {
              if (command === 'link' && setLinkEditorOpen(true)) {
                return 'handled'
              }
            },
            keyBindingFn: linkKeyBinding
          } as DraftJsPlugin
        }
      : {}

    return {
      richButtonsPlugin: createRichButtonsPlugin(),
      ...linkPlugins
    }
  }, [link])

  const [linkEditorOpen, setLinkEditorOpen] = useState(false)

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

  return (
    <>
      {inlineFormatting && (
        <ToolbarFragment group="inlineFormatting">
          <BoldButton>
            <ToolbarToggleButton
              tooltip={getShortcutTooltip('Bold', 'B')}
              edge="start"
            >
              <SvgIcon path={mdiFormatBold} />
            </ToolbarToggleButton>
          </BoldButton>

          <ItalicButton>
            <ToolbarToggleButton tooltip={getShortcutTooltip('Italic', 'I')}>
              <SvgIcon path={mdiFormatItalic} />
            </ToolbarToggleButton>
          </ItalicButton>

          <UnderlineButton>
            <ToolbarToggleButton tooltip={getShortcutTooltip('Underline', 'U')}>
              <SvgIcon path={mdiFormatUnderline} />
            </ToolbarToggleButton>
          </UnderlineButton>
        </ToolbarFragment>
      )}
      {lists && (
        <ToolbarFragment group="lists">
          <ULButton>
            <ToolbarToggleButton tooltip="Bulleted List" isBlockButton>
              <SvgIcon path={mdiFormatListBulleted} />
            </ToolbarToggleButton>
          </ULButton>

          <OLButton>
            <ToolbarToggleButton tooltip="Numbered List" isBlockButton>
              <SvgIcon path={mdiFormatListNumbered} />
            </ToolbarToggleButton>
          </OLButton>
        </ToolbarFragment>
      )}
      {textSize && (
        <ToolbarFragment group="textSize">
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
        </ToolbarFragment>
      )}
      {link && (
        <ToolbarFragment group="link">
          <Tooltip title={getShortcutTooltip('Insert Link', 'K')}>
            <ToolbarIconButton
              onClick={event => {
                setLinkEditorOpen(true)
                event.preventDefault()
                event.stopPropagation()
              }}
            >
              <SvgIcon path={mdiLink} />
            </ToolbarIconButton>
          </Tooltip>
        </ToolbarFragment>
      )}
      <LinkEditorPopover
        editorRef={originalEditorRef}
        editorState={editorState}
        setEditorState={setEditorState}
        open={linkEditorOpen}
        onClose={() => {
          setLinkEditorOpen(false)

          const selectedBlock = getSelectedAtomicBlock(editorState)

          if (!selectedBlock || selectedBlock.getType() !== 'atomic') {
            // atomic block selection is not preserved after focus
            // so we don't focus if an atomic block is selected
            setTimeout(() => {
              editorRef.current!.focus()
            })
          }
        }}
      />
      {!linkEditorOpen && (
        <DraftJsSelectionPopover
          editorState={editorState}
          inlineEntityFilter="LINK"
          blockFilter={isBlockLinked}
        >
          {({ entity, close, block }: SelectionPopoverRenderProps) => (
            <LinkPreview
              editorState={editorState}
              setEditorState={setEditorState}
              onClose={close}
              url={
                (entity && entity.getData().url) ||
                (block && block.getData().get('href')) ||
                ''
              }
              onEdit={() => setLinkEditorOpen(true)}
            />
          )}
        </DraftJsSelectionPopover>
      )}
    </>
  )
}

const isBlockLinked = (block: ContentBlock) => !!block.getData().get('href')
