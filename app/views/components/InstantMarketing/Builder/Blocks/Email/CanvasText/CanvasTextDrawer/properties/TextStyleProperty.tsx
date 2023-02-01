import { useEffect, useState } from 'react'

import {
  Box,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import {
  mdiFormatAlignCenter,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatStrikethrough,
  mdiFormatUnderline
} from '@mdi/js'
import cn from 'classnames'
import FontFaceObserver from 'fontfaceobserver'

import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { useCanvasTextContext } from '../hooks/get-canvas-text-context'

type Alignment = 'left' | 'center' | 'right'
type TextDecoration = 'line-through' | 'underline' | ''

const useStyles = makeStyles(
  (theme: Theme) => ({
    icon: {
      '&.selected': {
        color: theme.palette.primary.main
      }
    }
  }),
  {
    name: 'CanvasTextDrawerTextStyleProperty'
  }
)

export function TextStyleProperty() {
  const classes = useStyles()
  const { getTextProperty, setTextProperty, preview } = useCanvasTextContext()
  const [fontStyle, setFontStyle] = useState({
    bold: getTextProperty<string>('fontStyle')?.includes('bold') ?? false,
    italic: getTextProperty<string>('fontStyle')?.includes('italic') ?? false
  })

  const [alignment, setAlignment] = useState<Alignment>(
    getTextProperty<Alignment>('align') ?? 'left'
  )

  const [textDecoration, setTextDecoration] = useState<TextDecoration>(
    getTextProperty<TextDecoration>('textDecoration') ?? ''
  )

  useEffect(() => {
    const fontFamily = getTextProperty<string>('fontFamily')
    const fontStyleString = Object.entries(fontStyle)
      .filter(([_, value]) => !!value)
      .map(([key]) => key)
      .join(' ')
      .trim()

    new FontFaceObserver(fontFamily, {
      style: fontStyleString
    })
      .load()
      .then(() => {
        setTextProperty('fontStyle', fontStyleString || 'normal')
        preview()
      })
      .catch((e: ErrorEvent) => {})
  }, [fontStyle, setTextProperty, getTextProperty, preview])

  useEffect(() => {
    setTextProperty('align', alignment)
    preview()
  }, [alignment, setTextProperty, preview])

  useEffect(() => {
    setTextProperty('textDecoration', textDecoration)
    preview()
  }, [textDecoration, setTextProperty, preview])

  const toggleBold = () => {
    setFontStyle(current => ({
      ...current,
      bold: !current.bold
    }))
  }

  const toggleItalic = () => {
    setFontStyle(current => ({
      ...current,
      italic: !current.italic
    }))
  }

  const toggleTextDecoration = (value: typeof textDecoration) => {
    setTextDecoration(current => (current === value ? '' : value))
  }

  return (
    <Box my={2}>
      <Typography variant="body1" color="textSecondary">
        Text Styles
      </Typography>

      <Box mt={2} display="flex" alignItems="center">
        <Box mr={2}>
          <IconButton size="small" onClick={toggleBold}>
            <SvgIcon
              size={muiIconSizes.medium}
              path={mdiFormatBold}
              className={cn(classes.icon, {
                selected: fontStyle.bold === true
              })}
            />
          </IconButton>

          <IconButton size="small" onClick={toggleItalic}>
            <SvgIcon
              size={muiIconSizes.medium}
              path={mdiFormatItalic}
              className={cn(classes.icon, {
                selected: fontStyle.italic === true
              })}
            />
          </IconButton>
        </Box>

        <Box mr={2}>
          <IconButton size="small" onClick={() => setAlignment('left')}>
            <SvgIcon
              size={muiIconSizes.medium}
              path={mdiFormatAlignLeft}
              className={cn(classes.icon, {
                selected: alignment === 'left'
              })}
            />
          </IconButton>

          <IconButton size="small" onClick={() => setAlignment('center')}>
            <SvgIcon
              size={muiIconSizes.medium}
              path={mdiFormatAlignCenter}
              className={cn(classes.icon, {
                selected: alignment === 'center'
              })}
            />
          </IconButton>

          <IconButton size="small" onClick={() => setAlignment('right')}>
            <SvgIcon
              size={muiIconSizes.medium}
              path={mdiFormatAlignRight}
              className={cn(classes.icon, {
                selected: alignment === 'right'
              })}
            />
          </IconButton>
        </Box>

        <Box mr={2}>
          <IconButton
            size="small"
            onClick={() => toggleTextDecoration('line-through')}
          >
            <SvgIcon
              size={muiIconSizes.medium}
              path={mdiFormatStrikethrough}
              className={cn(classes.icon, {
                selected: textDecoration === 'line-through'
              })}
            />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => toggleTextDecoration('underline')}
          >
            <SvgIcon
              size={muiIconSizes.medium}
              path={mdiFormatUnderline}
              className={cn(classes.icon, {
                selected: textDecoration === 'underline'
              })}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
