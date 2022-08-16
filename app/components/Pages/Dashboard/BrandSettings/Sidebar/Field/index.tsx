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

export interface Props<T extends string | Partial<IStdAddr>>
  extends FieldProps<T> {
  onImageUpload: ImageUploadHandler
}

function isAddress(
  props: FieldProps<string | Partial<IStdAddr>>
): props is FieldProps<Partial<IStdAddr>> {
  return props.type === 'address'
}

function isNoneAddressElement(
  props: FieldProps<string | Partial<IStdAddr>>,
  type: Exclude<FieldType, 'address'>
): props is FieldProps<string> {
  return props.type === type
}

export default function Field<T extends string | Partial<IStdAddr>>({
  onImageUpload,
  ...props
}: Props<T>) {
  return (
    <Grid container item>
      <FormControl fullWidth>
        {isNoneAddressElement(props, 'text') && <TextField {...props} />}
        {isAddress(props) && <AddressField {...props} />}
        {isNoneAddressElement(props, 'color') && <ColorField {...props} />}
        {isNoneAddressElement(props, 'image') && (
          <ImageField {...props} onImageUpload={onImageUpload} />
        )}
        {isNoneAddressElement(props, 'font-family') && <FontField {...props} />}
        {isNoneAddressElement(props, 'pixel') && <PixelField {...props} />}
        {isNoneAddressElement(props, 'font-weight') && (
          <WeightField {...props} />
        )}
        {isNoneAddressElement(props, 'border') && <BorderField {...props} />}
      </FormControl>
    </Grid>
  )
}
