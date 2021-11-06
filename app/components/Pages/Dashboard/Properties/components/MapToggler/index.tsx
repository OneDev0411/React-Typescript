import { Switch } from '@material-ui/core'

import { noop } from '@app/utils/helpers'

interface Props {
  checked: boolean
  onChange?: () => void
}

export const MapToggler = ({ checked, onChange = noop }: Props) => {
  return (
    <>
      Show Map
      <Switch
        checked={checked}
        onChange={onChange}
        name="map-switcher"
        color="primary"
        size="small"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    </>
  )
}
