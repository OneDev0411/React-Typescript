import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    image: {
      width: '100%',
      height: 'auto'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center'
    },
    bold: { fontWeight: theme.typography.fontWeightBold }
  }),
  { name: 'MatterportDrawer' }
)
