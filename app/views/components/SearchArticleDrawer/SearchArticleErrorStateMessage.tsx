import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { maxWidth: theme.spacing(68) },
    image: {
      display: 'block',
      marginBottom: theme.spacing(2)
    }
  }),
  { name: 'SearchArticleErrorStateMessage' }
)

interface SearchArticleErrorStateMessageProps {
  image: string
  message: string
}

function SearchArticleErrorStateMessage({
  image,
  message
}: SearchArticleErrorStateMessageProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <img className={classes.image} src={image} alt="Not found" />
      {message}
    </div>
  )
}

export default SearchArticleErrorStateMessage
