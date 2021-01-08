import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    image: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      objectFit: 'cover',
      borderRadius: theme.shape.borderRadius
    }
  }),
  { name: 'WebsiteCardImage' }
)
