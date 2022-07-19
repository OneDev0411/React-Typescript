import { useEffect, useState } from 'react'

import {
  Box,
  Theme,
  makeStyles,
  Divider,
  IconButton,
  useTheme
} from '@material-ui/core'
import { mdiFormatBold, mdiFormatItalic, mdiFormatUnderline } from '@mdi/js'
import FontFaceObserver from 'fontfaceobserver'
import type { LabelModel } from 'pikaso'
import { ColorState } from 'react-color'
import { useSelector } from 'react-redux'

import FontField from '@app/components/Pages/Dashboard/BrandSettings/Sidebar/Field/Font'
import { IAppState } from '@app/reducers'
import { getBrandColors } from '@app/utils/get-brand-colors'
import { getBrandFontFamilies } from '@app/utils/get-brand-fonts'
import { getBrandByType } from '@app/utils/user-teams'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { ColorPicker } from '../../../components/ColorPicker'
import { Slider } from '../../../components/Slider'
import { useImageEditor } from '../../../hooks/use-image-editor'

const useStyles = makeStyles(
  (theme: Theme) => ({
    divider: {
      height: '50%',
      margin: theme.spacing(0, 2)
    },
    container: {
      width: '100%'
    },
    options: {
      height: theme.spacing(5)
    },
    fontFamily: {
      width: '150px'
    }
  }),
  {
    name: 'ImageEditorTextActions'
  }
)

interface FontStyle {
  bold: boolean
  italic: boolean
}

interface TextProperties {
  fontStyle: string
  textDecoration: string
  color: string
  backgroundColor: string
  fontSize: number
  fontFamily: string
}

const DefaultFontSize = 50

export function TextMenu() {
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const { editor, activeAction } = useImageEditor()
  const [selectedLabel, setSelectedLabel] = useState<Nullable<LabelModel>>(null)
  const [textProperties, setTextProperties] = useState<TextProperties>({
    fontStyle: '',
    textDecoration: '',
    color: '#fff',
    backgroundColor: '#000',
    fontSize: DefaultFontSize,
    fontFamily: ''
  })

  const brand = useSelector<IAppState, Nullable<IBrand>>(({ activeTeam }) =>
    getBrandByType(activeTeam, 'Brokerage')
  )

  const object = {
    fontFamily: 'Tahoma',
    fontSize: 12,
    fill: 'red'
  }

  useEffect(() => {
    const handleClick = () => {
      if (!editor || selectedLabel) {
        return
      }

      const { x, y } = editor.board.stage.getPointerPosition()!

      const label = editor.shapes.label.insert({
        container: {
          x,
          y
        },
        tag: {
          fill: '#000'
        },
        text: {
          text: 'Untitled Text',
          fill: '#fff',
          fontSize: DefaultFontSize,
          fontFamily: 'Tahoma',
          padding: 5,
          fontStyle: ''
        }
      })

      setSelectedLabel(label)
      label.select()
    }

    editor?.board.stage.on('click', handleClick)

    return () => {
      editor?.board.stage.off('click', handleClick)
    }
  }, [editor, selectedLabel])

  const isBold = textProperties.fontStyle.includes('bold')
  const isItalic = textProperties.fontStyle.includes('italic')
  const hasUnderline = textProperties.textDecoration.includes('underline')

  const toggleBold = () => {
    const fontStyle: FontStyle = {
      bold: !isBold,
      italic: isItalic
    }

    const nextFontStyle = updateFontStyle(fontStyle)

    selectedLabel?.textNode.fontStyle(nextFontStyle)

    editor?.board.selection.transformer.forceUpdate()
  }

  const toggleItalic = () => {
    const fontStyle: FontStyle = {
      bold: isBold,
      italic: !isItalic
    }

    const nextFontStyle = updateFontStyle(fontStyle)

    selectedLabel?.textNode.fontStyle(nextFontStyle)
  }

  const toggleUnderline = () => {
    const nextTextProperties: typeof textProperties = {
      ...textProperties,
      textDecoration: hasUnderline ? '' : 'underline'
    }

    selectedLabel?.textNode.textDecoration(nextTextProperties.textDecoration)
    setTextProperties(nextTextProperties)
  }

  const onChangeFontFamily = (_: unknown, value: string) => {
    new FontFaceObserver(value).load().then(() => {
      setTextProperties(properties => ({
        ...properties,
        fontFamily: value
      }))

      selectedLabel?.textNode.fontFamily(value)
      editor?.board.selection.transformer.forceUpdate()
    })
  }

  const onChangeFontSize = (value: number | null) => {
    if (!value) {
      return
    }

    setTextProperties(properties => ({
      ...properties,
      fontSize: value
    }))

    selectedLabel?.textNode.fontSize(value)
    editor?.board.selection.transformer.forceUpdate()
  }

  const onChangeTextColor = (color: ColorState) => {
    setTextProperties(properties => ({
      ...properties,
      color: color.hex
    }))

    selectedLabel?.textNode.setAttr('fill', color.hex)
  }

  const onChangeBackgroundColor = (color: ColorState) => {
    setTextProperties(properties => ({
      ...properties,
      backgroundColor: color.hex
    }))

    selectedLabel?.tagNode.setAttr('fill', color.hex)
  }

  const updateFontStyle = (fontStyle: FontStyle) => {
    const nextFontStyle: string[] = []

    if (fontStyle.bold) {
      nextFontStyle.push('bold')
    }

    if (fontStyle.italic) {
      nextFontStyle.push('italic')
    }

    const nextTextProperties: typeof textProperties = {
      ...textProperties,
      fontStyle: nextFontStyle.join(' ')
    }

    setTextProperties(nextTextProperties)

    return nextTextProperties.fontStyle
  }

  return (
    <Box display="flex" alignItems="center" className={classes.container}>
      <IconButton
        disabled={!selectedLabel}
        size="small"
        color="primary"
        onClick={toggleBold}
      >
        <SvgIcon
          path={mdiFormatBold}
          size={muiIconSizes.medium}
          color={isBold ? theme.palette.secondary.main : '#000'}
        />
      </IconButton>
      <IconButton disabled={!selectedLabel} size="small" onClick={toggleItalic}>
        <SvgIcon
          path={mdiFormatItalic}
          size={muiIconSizes.medium}
          color={isItalic ? theme.palette.secondary.main : '#000'}
        />
      </IconButton>
      <IconButton
        disabled={!selectedLabel}
        size="small"
        onClick={toggleUnderline}
      >
        <SvgIcon
          path={mdiFormatUnderline}
          size={muiIconSizes.medium}
          color={hasUnderline ? theme.palette.secondary.main : '#000'}
        />
      </IconButton>

      <Divider orientation="vertical" className={classes.divider} />

      {brand && (
        <div className={classes.fontFamily}>
          <FontField
            type="font-family"
            label="Font Family"
            names={[]}
            brandFonts={getBrandFontFamilies(brand)}
            value={object.fontFamily}
            onChange={onChangeFontFamily}
          />
        </div>
      )}

      <Divider orientation="vertical" className={classes.divider} />

      {brand && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="60px"
        >
          <ColorPicker
            tooltip="Text Color"
            color={textProperties.color}
            colors={getBrandColors(brand)}
            onChange={onChangeTextColor}
          />

          <ColorPicker
            tooltip="Background Color"
            color={textProperties.backgroundColor}
            colors={[...getBrandColors(brand), 'transparent']}
            onChange={onChangeBackgroundColor}
          />
        </Box>
      )}
      <Divider orientation="vertical" className={classes.divider} />

      <Slider
        min={10}
        max={200}
        disabled={!selectedLabel}
        caption="Size"
        value={Number(textProperties.fontSize) || DefaultFontSize}
        onChange={onChangeFontSize}
      />
    </Box>
  )
}
