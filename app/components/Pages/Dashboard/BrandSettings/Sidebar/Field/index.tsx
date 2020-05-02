import React from 'react'
import { Grid, FormControl } from '@material-ui/core'

import { ImageUploadHandler } from '../../types'
import { FieldProps } from './types'
import TextField from './Text'
import ColorField from './Color'
import ImageField from './Image'
import FontField from './Font'
import PixelField from './Pixel'
import WeightField from './Weight'
import BorderField from './Border'

interface Props extends FieldProps {
  onImageUpload: ImageUploadHandler
}

export default function Field({ onImageUpload, ...props }: Props) {
  return (
    <Grid container item>
      <FormControl fullWidth>
        {props.type === 'text' && <TextField {...props} />}
        {props.type === 'color' && <ColorField {...props} />}
        {props.type === 'image' && (
          <ImageField {...props} onImageUpload={onImageUpload} />
        )}
        {props.type === 'font-family' && <FontField {...props} />}
        {props.type === 'pixel' && <PixelField {...props} />}
        {props.type === 'font-weight' && <WeightField {...props} />}
        {props.type === 'border' && <BorderField {...props} />}
      </FormControl>
    </Grid>
  )
}
