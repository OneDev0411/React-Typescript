import { makeStyles } from '@material-ui/core'

import LoadingContainer from '@app/views/components/LoadingContainer'

const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 0
    }
  },
  { name: 'ListingsLoading' }
)

function ListingsLoading() {
  const classes = useStyles()

  return <LoadingContainer className={classes.root} noPaddings />
}

export default ListingsLoading
