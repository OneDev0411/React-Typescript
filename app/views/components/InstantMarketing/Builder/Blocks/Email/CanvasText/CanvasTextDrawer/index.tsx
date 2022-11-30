import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, CircularProgress, makeStyles } from '@material-ui/core'
import type { Model } from 'backbone'
import cn from 'classnames'
import Pikaso, { LabelModel } from 'pikaso'

import OverlayDrawer from '@app/views/components/OverlayDrawer'
import { PageTabs, Tab } from '@app/views/components/PageTabs'

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

interface Props {
  model: Nullable<Model>
  onUpdate: (data: { image: string; text: string }) => void
  onClose: () => void
}

export function CanvasTextDrawer({ model, onUpdate, onClose }: Props) {
  const classes = useStyles()

  const [activeTab, setActiveTab] = useState<Tabs>('fonts')

  const editorRef = useRef<Nullable<HTMLDivElement>>(null)
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)

  const label = editor ? (editor.board.activeShapes[0] as LabelModel) : null

  const preview = useCallback(() => {
    if (!label) {
      return
    }

    const image = label.node.toDataURL({
      pixelRatio: 2
    })

    model!.trigger('canvas-text:update', {
      image,
      width: label.width(),
      height: label.height()
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

  useEffect(() => {
    if (editor || !editorRef.current) {
      return
    }

    const instance = new Pikaso({
      width: 50,
      height: 50,
      container: editorRef.current
    })

    instance.shapes.label.insert(DefaultCanvasTextProperties)

    setEditor(instance)
  }, [editorRef, editor])

  return (
    <>
      <OverlayDrawer open hideBackdrop width={400} onClose={onClose}>
        <OverlayDrawer.Header title="Fancy Test" />
        <OverlayDrawer.Body className={classes.drawerBodyRoot}>
          {editor ? (
            <div>
              <Context.Provider
                value={{
                  editor,
                  label,
                  setTextProperty,
                  setTagProperty,
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
