import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      overflowX: 'scroll',
      overflowY: 'hidden',
      height: '64vh'
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      marginBottom: theme.spacing(1)
    }
  }),
  {
    name: 'Board'
  }
)

import { BoardColumn } from './Column'

interface Props {
  contacts: IContact[]
}

export function Board({ contacts }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <BoardColumn title="All Contacts" list={contacts} />
        <BoardColumn title="Warm List" list={[]} />
        <BoardColumn title="Hot List" list={[]} />
        <BoardColumn title="Passed List" list={[]} />
        <BoardColumn title="Closed List" list={[]} />
      </div>
    </div>
  )
}
