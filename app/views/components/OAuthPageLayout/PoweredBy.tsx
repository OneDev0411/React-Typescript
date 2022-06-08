import { makeStyles, Theme, Typography } from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'absolute',
      bottom: 20,
      width: '100%',
      textAlign: 'center'
    },
    text: {
      color: theme.palette.grey[600]
    },
    logo: {
      opacity: 0.8,
      marginLeft: theme.spacing(0.5),
      marginTop: theme.spacing(-0.5),
      width: 48,
      '&:hover': {
        opacity: 1
      }
    }
  }),
  { name: 'PoweredBy' }
)

export interface Props {
  className?: string
}

export function PoweredBy({ className }: Props) {
  const classes = useStyles()

  return (
    <div className={cn(classes.container, className)}>
      <Typography variant="caption">
        Powered by
        <a target="_blank" href="https://rechat.com">
          <img
            alt="Rechat &#8482;"
            src="/static/images/logo--type.svg"
            className={classes.logo}
          />
        </a>
      </Typography>
    </div>
  )
}
