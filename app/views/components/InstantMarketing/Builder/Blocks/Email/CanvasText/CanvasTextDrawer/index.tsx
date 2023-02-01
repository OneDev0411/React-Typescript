import { useCallback, useEffect, useRef, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Typography
} from '@material-ui/core'
import type { Model } from 'backbone'
import cn from 'classnames'
import Pikaso, { Konva, LabelModel } from 'pikaso'

import { convertUrlToImageFile } from '@app/utils/file-utils/convert-url-to-image-file'
import { noop } from '@app/utils/helpers'
import OverlayDrawer from '@app/views/components/OverlayDrawer'
import { PageTabs, Tab } from '@app/views/components/PageTabs'

import type { TemplateOptions } from '../../../types'

import { AdvancedProperties } from './AdvancedProperties'
import { BasicProperties } from './BasicProperties'
import { DefaultCanvasTextProperties } from './constants'
import { Context } from './context'
import { FontExplorer } from './FontExplorer'
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
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)

  const label = editor ? (editor.board.activeShapes[0] as LabelModel) : null

  const handleDone = async () => {
    onClose()
    uploadResultImage()
  }

  const uploadResultImage = async () => {
    if (!label) {
      return
    }

    const data = JSON.stringify(editor?.export.toJson())

    model!.trigger('canvas-text:save-state', {
      data
    })

    const file = await convertUrlToImageFile(
      label.node.toDataURL({
        pixelRatio: 2
      })
    )

    onUploadComplete({
      model,
      file,
      json: data,
      rect: label.node.getClientRect()
    })
  }

  const preview = useCallback(() => {
    if (!label) {
      return
    }

    const image = label.node.toDataURL({
      pixelRatio: 2
    })

    const rect = label.node.getClientRect()

    model!.trigger('canvas-text:update', {
      image,
      width: rect.width,
      height: rect.height
    })
  }, [label, model])

  const setTextProperty = useCallback(
    (property: string, value: unknown) => {
      label?.textNode.setAttr(property, value)
    },
    [label]
  )

  const setTagProperty = useCallback(
    (property: string, value: unknown) => {
      label?.tagNode.setAttr(property, value)
    },
    [label]
  )

  const getTextProperty = useCallback(
    (property: string) => {
      return label?.textNode.getAttr(property)
    },
    [label]
  )

  const getTagProperty = useCallback(
    (property: string) => {
      return label?.tagNode.getAttr(property)
    },
    [label]
  )

  useEffect(() => {
    if (editor || !model || !editorRef.current) {
      return
    }

    Konva.Util.createCanvasElement = () => {
      const iframe = document.querySelector('.gjs-frame') as HTMLIFrameElement

      return iframe.contentDocument!.createElement('canvas')
    }

    const instance = new Pikaso({
      width: 50,
      height: 50,
      container: editorRef.current
    })

    const state = decodeURIComponent(model.get('canvas-json'))

    if (state) {
      instance.load(state)
    } else {
      instance.shapes.label.insert(DefaultCanvasTextProperties)
    }

    setEditor(instance)
  }, [editorRef, editor, model])

  console.log('>>>>', templateOptions)

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
                  label,
                  templateOptions,
                  setTextProperty,
                  setTagProperty,
                  getTextProperty,
                  getTagProperty,
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
