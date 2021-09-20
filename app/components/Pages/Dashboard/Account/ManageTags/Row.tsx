import { Theme, makeStyles } from '@material-ui/core'

import Item from './Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    rowContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      background: ({ highlight }: { highlight: boolean }) =>
        highlight ? theme.palette.grey[50] : 'inherit',
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    rowTitle: {
      color: theme.palette.tertiary.dark,
      width: theme.spacing(5),
      marginTop: theme.spacing(2),
      ...theme.typography.subtitle1
    },
    itemContainer: {
      flexGrow: 1
    }
  }),
  { name: 'ManageTagsRow' }
)

type TagWithHighlight = IContactTag & { highlight: boolean }

export interface Props {
  title: string
  items: TagWithHighlight[]
  onChange: (payload: {
    oldText: string
    newText: string
    touchDate: Nullable<number>
  }) => void
  onDelete: (tag: IContactTag) => void
}

export default function ManageTagsRow({
  title,
  items,
  onChange,
  onDelete
}: Props) {
  const highlight = items.some(item => item.highlight)
  const classes = useStyles({ highlight })

  return (
    <div className={classes.rowContainer}>
      <div className={classes.rowTitle}>{title}</div>
      <div className={classes.itemContainer}>
        {items.map(tag => (
          <Item
            onChange={onChange}
            onDelete={onDelete}
            key={tag.id}
            tag={tag}
          />
        ))}
      </div>
    </div>
  )
}
