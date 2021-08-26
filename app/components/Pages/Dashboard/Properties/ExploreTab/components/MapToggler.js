import { Switch } from '@material-ui/core'

export const MapToggler = ({ checked, onChange }) => {
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
