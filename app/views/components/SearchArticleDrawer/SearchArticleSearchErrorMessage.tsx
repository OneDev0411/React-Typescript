import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { maxWidth: theme.spacing(68) },
    image: {
      display: 'block',
      marginBottom: theme.spacing(2)
    }
  }),
  { name: 'SearchArticleSearchErrorMessage' }
)

interface SearchArticleSearchErrorMessageProps {
  image: string
  message: string
}

function SearchArticleSearchErrorMessage({
  image,
  message
}: SearchArticleSearchErrorMessageProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <img className={classes.image} src={image} alt="Not found" />
      {message}
    </div>
  )
}

export default SearchArticleSearchErrorMessage
