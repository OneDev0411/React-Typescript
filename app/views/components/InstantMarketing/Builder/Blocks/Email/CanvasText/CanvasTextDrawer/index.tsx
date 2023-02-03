import { useCallback, useRef, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Typography
} from '@material-ui/core'
import type { Model } from 'backbone'
import cn from 'classnames'

import { convertUrlToImageFile } from '@app/utils/file-utils/convert-url-to-image-file'
import { noop } from '@app/utils/helpers'
import OverlayDrawer from '@app/views/components/OverlayDrawer'
import { PageTabs, Tab } from '@app/views/components/PageTabs'

import type { TemplateOptions } from '../../../types'

import { AdvancedProperties } from './AdvancedProperties'
import { BasicProperties } from './BasicProperties'
import { Context } from './context'
import { FontExplorer } from './FontExplorer'
import { useEditor } from './hooks/use-editor'
import { TextEditor } from './TextEditor'

const useStyles = makeStyles(
  () => ({
    drawerBodyRoot: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100vh',
      overflow: 'auto'
    },
    tab: {
      display: 'none',
      '&.active': {
        display: 'block'
      }
    }
  }),
  {
    name: 'MarketingCenterBlocksCanvasTextDrawer'
  }
)

type Tabs = 'fonts' | 'basic-properties' | 'advanced-properties'

interface IRect {
  x: number
  y: number
  width: number
  height: number
}

interface Props {
  model: Nullable<Model>
  templateOptions: Nullable<TemplateOptions>
  onClose: () => void
  onUploadComplete: (data: {
    file: File
    rect: IRect
    json: string
    model: Nullable<Model>
  }) => void
}

export function CanvasTextDrawer({
  model,
  templateOptions,
  onClose,
  onUploadComplete
}: Props) {
  const classes = useStyles()

  const [activeTab, setActiveTab] = useState<Tabs>('fonts')

  const editorRef = useRef<Nullable<HTMLDivElement>>(null)
  const { editor, textPreviewLabel, fontPreviewLabel } = useEditor(
    editorRef,
    model
  )

  const handleDone = async () => {
    onClose()
    uploadResultImage()
  }

  const uploadResultImage = async () => {
    if (!textPreviewLabel) {
      return
    }

    const json = editor?.export.toJson()

    // only keep label preview shape
    const data = JSON.stringify({
      ...json,
      shapes: [json?.shapes[0]]
    })

    model?.trigger('canvas-text:save-state', {
      data
    })

    const file = await convertUrlToImageFile(
      textPreviewLabel.node.toDataURL({
        pixelRatio: 2
      })
    )

    onUploadComplete({
      model,
      file,
      json: data,
      rect: textPreviewLabel.node.getClientRect()
    })
  }

  const preview = useCallback(() => {
    if (!textPreviewLabel) {
      return
    }

    const image = textPreviewLabel.node.toDataURL({
      pixelRatio: 2
    })

    const rect = textPreviewLabel.node.getClientRect()

    model!.trigger('canvas-text:update', {
      image,
      width: rect.width,
      height: rect.height
    })
  }, [textPreviewLabel, model])

  const setTextProperty = useCallback(
    (property: string, value: unknown) => {
      textPreviewLabel?.textNode.setAttr(property, value)
    },
    [textPreviewLabel]
  )

  const setTagProperty = useCallback(
    (property: string, value: unknown) => {
      textPreviewLabel?.tagNode.setAttr(property, value)
    },
    [textPreviewLabel]
  )

  const getTextProperty = useCallback(
    (property: string) => {
      return textPreviewLabel?.textNode.getAttr(property)
    },
    [textPreviewLabel]
  )

  const getTagProperty = useCallback(
    (property: string) => {
      return textPreviewLabel?.tagNode.getAttr(property)
    },
    [textPreviewLabel]
  )

  const getFontPreview = useCallback(
    (fontName: string) => {
      if (!fontPreviewLabel) {
        return ''
      }

      const normalizedName = fontName
        .replaceAll('-', ' ')
        .replace(/\B([A-Z])\B/g, ' $1')

      fontPreviewLabel.textNode.setAttrs({
        fontFamily: fontName,
        text: normalizedName
      })

      return fontPreviewLabel.node.toDataURL({
        pixelRatio: 2
      })
    },
    [fontPreviewLabel]
  )

  return (
    <>
      <OverlayDrawer open hideBackdrop width={400} onClose={noop}>
        <OverlayDrawer.Header title="Fancy Test">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1}
          >
            <Typography variant="h6">Fancy Text</Typography>

            <Button variant="contained" color="primary" onClick={handleDone}>
              Done
            </Button>
          </Box>
        </OverlayDrawer.Header>
        <OverlayDrawer.Body className={classes.drawerBodyRoot}>
          {editor ? (
            <div>
              <Context.Provider
                value={{
                  editor,
                  textPreviewLabel,
                  templateOptions,
                  setTextProperty,
                  setTagProperty,
                  getTextProperty,
                  getTagProperty,
                  getFontPreview,
                  preview
                }}
              >
                <div>
                  <TextEditor />
                </div>

                <div>
                  <PageTabs
                    defaultValue={activeTab}
                    value={activeTab}
                    tabs={[
                      <Tab key={0} label="Font" value="fonts" />,
                      <Tab
                        key={1}
                        label="Properties"
                        value="basic-properties"
                      />,
                      <Tab
                        key={2}
                        label="Advanced"
                        value="advanced-properties"
                      />
                    ]}
                    onChange={tab => setActiveTab(tab as Tabs)}
                  />

                  <Box
                    className={cn(classes.tab, {
                      active: activeTab === 'fonts'
                    })}
                  >
                    <FontExplorer />
                  </Box>

                  <Box
                    className={cn(classes.tab, {
                      active: activeTab === 'basic-properties'
                    })}
                  >
                    <BasicProperties />
                  </Box>

                  <Box
                    className={cn(classes.tab, {
                      active: activeTab === 'advanced-properties'
                    })}
                  >
                    <AdvancedProperties />
                  </Box>
                </div>
              </Context.Provider>
            </div>
          ) : (
            <CircularProgress />
          )}
        </OverlayDrawer.Body>
      </OverlayDrawer>

      <div
        id="editor"
        ref={editorRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          left: -9999,
          top: -9999
        }}
      />
    </>
  )
}
