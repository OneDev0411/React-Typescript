import { Switch } from '@material-ui/core'

export const MapToggler = ({ checked }) => {
  return (
    <>
      Show Map
      <Switch
        checked={checked}
        name="map-switcher"
        color="primary"
        size="small"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    </>
  )
}
