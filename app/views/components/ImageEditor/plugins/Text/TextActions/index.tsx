import React, { useState } from 'react'
import { Box, Theme, Divider, IconButton, makeStyles } from '@material-ui/core'
import debounce from 'lodash/debounce'
import pick from 'lodash/pick'
import Icon from '@mdi/react'
import { mdiFormatBold, mdiFormatItalic, mdiFormatUnderline } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { ColorResult } from 'react-color'

import { Slider } from '../../../components/Slider'
import { ColorPicker } from '../../../components/ColorPicker'

import { Actions, ImageEditor } from '../../../types'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(0.5, 0)
  },
  divider: {
    height: '50%',
    margin: theme.spacing(0, 2)
  }
}))

const InitialStyle = {
  fontSize: 30,
  fill: '#262626',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textAlign: 'left',
  textDecoration: 'none'
}

interface TextObjectProps extends tuiImageEditor.IObjectProps {
  fontFamily: string
  fontWeight: string
  fontSize: number
  fontStyle: string
  text: string
  textAlign: string
  textDecoration: string
}

interface Props {
  editor: ImageEditor
  onChangeActiveAction: (action: Actions | null) => void
}

export function TextActions({ editor }: Props) {
  const classes = useStyles()
  const [object, setObject] = useState<Partial<TextObjectProps>>(InitialStyle)

  useEffectOnce(() => {
    const onObjectScaled = debounce(
      ({ type, fontSize }: { type: string; fontSize: number }) => {
        if (type.includes('text')) {
          setObject(state => ({
            ...state,
            fontSize
          }))
        }
      },
      100
    )

    editor.on('addText', async pos => {
      const text = await editor.addText('Text', {
        position: pos.originPosition,
        styles: {
          ...InitialStyle,
          fontSize: Number(InitialStyle.fontSize)
        }
      })

      setObject({
        ...text,
        fontSize: Number(text.fontSize)
      })
    })

    editor.on('objectActivated', (data: tuiImageEditor.ITextObjectProps) => {
      if (data.type.includes('text')) {
        setObject({
          ...data,
          fontSize: Number(data.fontSize)
        })
      }
    })

    editor.on('objectScaled', onObjectScaled)

    return () => {
      editor.off('objectScaled')
      editor.off('objectActivated')
      editor.off('addText')
    }
  })

  const onChangeFontSize = (value: number | null) => {
    if (!value) {
      return
    }

    updateTextStyles({
      fontSize: value
    })
  }

  const toggleBold = () => {
    updateTextStyles({
      fontWeight: object.fontWeight === 'bold' ? 'normal' : 'bold'
    })
  }

  const toggleItalic = () => {
    updateTextStyles({
      fontStyle: object.fontStyle === 'italic' ? 'normal' : 'italic'
    })
  }

  const toggleUnderline = () => {
    updateTextStyles({
      textDecoration:
        object.textDecoration === 'underline' ? 'normal' : 'underline'
    })
  }

  const setTextColor = (color: ColorResult) => {
    updateTextStyles({
      fill: color.hex
    })
  }

  const updateTextStyles = (data: Partial<typeof object>) => {
    if (!object.id) {
      return
    }

    setObject(state => ({
      ...state,
      ...data
    }))

    editor.changeTextStyle(
      object.id,
      pick(data, [
        'fill',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'textAlign',
        'textDecoration'
      ])
    )
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      className={classes.root}
    >
      <IconButton
        disabled={!object.id}
        size="small"
        color={object.fontWeight === 'bold' ? 'secondary' : 'default'}
        onClick={toggleBold}
      >
        <Icon path={mdiFormatBold} size={0.9} />
      </IconButton>
      <IconButton
        disabled={!object.id}
        size="small"
        color={object.fontStyle === 'italic' ? 'secondary' : 'default'}
        onClick={toggleItalic}
      >
        <Icon path={mdiFormatItalic} size={0.9} />
      </IconButton>
      <IconButton
        disabled={!object.id}
        size="small"
        color={object.textDecoration === 'underline' ? 'secondary' : 'default'}
        onClick={toggleUnderline}
      >
        <Icon path={mdiFormatUnderline} size={0.9} />
      </IconButton>
      <Divider orientation="vertical" className={classes.divider} />
      <ColorPicker color={object.fill} onChange={setTextColor} />
      <Divider orientation="vertical" className={classes.divider} />
      <Slider
        min={10}
        max={200}
        disabled={!object.id}
        caption="Size"
        value={Number(object.fontSize) || 10}
        onChange={onChangeFontSize}
      />
    </Box>
  )
}
