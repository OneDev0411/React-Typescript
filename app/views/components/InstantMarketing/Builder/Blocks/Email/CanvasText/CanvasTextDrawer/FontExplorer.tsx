import { useMemo, useRef, useState } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import { DefaultCanvasTextProperties } from './constants'
import { FontPreview } from './FontPreview'
import { useCanvasTextContext } from './hooks/use-canvas-text-context'
import { useEditor } from './hooks/use-editor'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      margin: theme.spacing(2, 0)
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing(2)
    },
    block: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      fontSize: 20,
      padding: theme.spacing(2),
      '& img': {
        maxWidth: '90%',
        height: theme.spacing(4)
      },
      '&.active': {
        backgroundColor: theme.palette.grey[200]
      },
      '&:hover': {
        backgroundColor: theme.palette.grey['100'],
        cursor: 'pointer'
      }
    },
    activeFont: {
      display: 'block',
      width: '100%',
      textAlign: 'center',
      fontSize: 25,
      color: theme.palette.info.main
    }
  }),
  {
    name: 'MarketingCenterBlocksCanvasTextFontExplorer'
  }
)

export function FontExplorer() {
  const classes = useStyles()

  const fontsPreviewRef = useRef<Nullable<HTMLDivElement>>(null)
  const { editor, getLabelNode } = useEditor({
    editorRef: fontsPreviewRef,
    labelConfig: {
      ...DefaultCanvasTextProperties,
      text: {
        fontSize: 35,
        lineHeight: 1,
        padding: 3
      }
    }
  })

  const textPreviewLabel = useMemo(
    () => getLabelNode(editor),
    [editor, getLabelNode]
  )

  const { templateOptions, setTextProperty, getTextProperty, preview } =
    useCanvasTextContext()
  const [activeFont, setActiveFont] = useState<Nullable<string>>(
    getTextProperty<string>('fontFamily') ?? null
  )
  const fonts = templateOptions?.textEditor?.extraFonts ?? []

  const handleSelectFont = (fontName: string) => {
    setActiveFont(fontName)
    setTextProperty('fontFamily', fontName)
    preview()
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {fonts.map(font => (
          <div
            key={font.name}
            className={cn(classes.block, {
              active: font.name === activeFont
            })}
            onClick={() => handleSelectFont(font.name)}
          >
            <FontPreview font={font} textPreviewLabel={textPreviewLabel} />
          </div>
        ))}
      </div>

      <div
        ref={fontsPreviewRef}
        style={{
          position: 'absolute',
          left: -500,
          top: -500,
          visibility: 'hidden'
        }}
      />
    </div>
  )
}
