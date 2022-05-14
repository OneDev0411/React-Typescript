import { useMemo } from 'react'

import { Typography, Chip, Theme, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      maxWidth: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'center',
      alignContent: 'space-between'
    },
    tags: {
      flexGrow: 1
    }
  }),
  { name: 'ContactListTagsString' }
)

const MAX_TAGS: number = 2

interface Props {
  contact: IContact
}

export function TagsCell({ contact }: Props) {
  const classes = useStyles()
  const tags = useMemo(() => contact?.tags || [], [contact?.tags])

  if (tags.length === 0) {
    return null
  }

  return (
    <div className={classes.container}>
      <Typography noWrap className={classes.tags}>
        {tags.slice(0, MAX_TAGS).join(', ')}
      </Typography>
      {tags.length > MAX_TAGS && (
        <Chip
          variant="outlined"
          size="small"
          label={`${tags.length - MAX_TAGS} more`}
        />
      )}
    </div>
  )
}
