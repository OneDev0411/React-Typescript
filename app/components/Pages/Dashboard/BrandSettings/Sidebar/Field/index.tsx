import React from 'react'
import { Grid, FormControl } from '@material-ui/core'

import { ImageUploadHandler } from '../../types'
import { FieldProps } from './types'
import ColorField from './Color'
import ImageField from './Image'
import FontField from './Font'
import PixelField from './Pixel'
import WeightField from './Weight'

interface Props extends FieldProps {
  onImageUpload: ImageUploadHandler
}

export default function Field({ onImageUpload, ...props }: Props) {
  return (
    <Grid container item>
      <FormControl fullWidth>
        {props.type === 'color' && <ColorField {...props} />}
        {props.type === 'image' && (
          <ImageField {...props} onImageUpload={onImageUpload} />
        )}
        {props.type === 'font-family' && <FontField {...props} />}
        {props.type === 'pixel' && <PixelField {...props} />}
        {props.type === 'font-weight' && <WeightField {...props} />}
      </FormControl>
    </Grid>
  )
}
