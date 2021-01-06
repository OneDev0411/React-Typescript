import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('background-color'),
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&:hover $actions': { opacity: 1 },
    '&:hover $image': { opacity: 0.9 }
  },
  footer: {
    color: theme.palette.action.disabled,
    '&:hover': { color: theme.palette.action.active }
  },
  link: {
    color: 'inherit',
    '&:hover': { color: 'inherit' }
  },
  actions: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    transition: theme.transitions.create('opacity')
  },
  image: { transition: theme.transitions.create('opacity') },
  busy: {
    opacity: 0.6,
    pointerEvents: 'none'
  }
}))
