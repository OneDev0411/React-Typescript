import { Grid, FormControl } from '@material-ui/core'

import { FieldType, ImageUploadHandler } from '../../types'

import AddressField from './Address'
import BorderField from './Border'
import ColorField from './Color'
import FontField from './Font'
import ImageField from './Image'
import PixelField from './Pixel'
import TextField from './Text'
import { FieldProps } from './types'
import WeightField from './Weight'

export interface Props<T extends BrandMarketingPaletteValue>
  extends FieldProps<T> {
  onImageUpload: ImageUploadHandler
}

function isAddressField(
  props: FieldProps<BrandMarketingPaletteValue>
): props is FieldProps<BrandMarketingPaletteAddressValue> {
  return props.type === 'address'
}

function isStringValueField(
  props: FieldProps<BrandMarketingPaletteValue>,
  type: Exclude<FieldType, 'address'>
): props is FieldProps<string> {
  return props.type === type
}

export default function Field<T extends BrandMarketingPaletteValue>({
  onImageUpload,
  ...props
}: Props<T>) {
  return (
    <Grid container item>
      <FormControl fullWidth>
        {isStringValueField(props, 'text') && <TextField {...props} />}
        {isAddressField(props) && <AddressField {...props} />}
        {isStringValueField(props, 'color') && <ColorField {...props} />}
        {isStringValueField(props, 'image') && (
          <ImageField {...props} onImageUpload={onImageUpload} />
        )}
        {isStringValueField(props, 'font-family') && <FontField {...props} />}
        {isStringValueField(props, 'pixel') && <PixelField {...props} />}
        {isStringValueField(props, 'font-weight') && <WeightField {...props} />}
        {isStringValueField(props, 'border') && <BorderField {...props} />}
      </FormControl>
    </Grid>
  )
}
