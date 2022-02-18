import { Box, Typography, Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    drawingModeBar: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 3,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 50,
      color: '#fff',
      '& .alpha': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        opacity: 0.5,
        zIndex: -1
      }
    },
    text: {
      padding: theme.spacing(0, 2)
    },
    button: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'DrawingModeBar' }
)

interface Props {
  onCancel: () => void
}

export const DrawingModeBar = ({ onCancel }: Props) => {
  const classes = useStyles()

  return (
    <Box className={classes.drawingModeBar}>
      <Box className="alpha" />
      <Typography className={classes.text} variant="body2">
        You're now in drawing mode. Please click on the map to define an area
        for searching.
      </Typography>
      <Button className={classes.button} variant="contained" onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  )
}
