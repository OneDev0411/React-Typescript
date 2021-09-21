import { Button, Grid, Typography } from '@material-ui/core'

import { noop } from '@app/utils/helpers'

import { useStyles } from '../styles'

interface Props {
  title?: string
  hasSelectAll?: boolean
  isSelectAll?: boolean
  onToggleSelectAll?: (allSelected: boolean) => void
  children: React.ReactNode
}

export const EditorGroup = ({
  title,
  hasSelectAll,
  isSelectAll,
  onToggleSelectAll = noop,
  children
}: Props) => {
  const classes = useStyles()

  return (
    <>
      <Grid item container className={classes.editorGroup}>
        {title && (
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className={classes.subheader}
          >
            <Grid item>
              <Typography className={classes.subtitle}>{title}</Typography>
            </Grid>
            {hasSelectAll && (
              <Grid item>
                <Button
                  className={classes.selectAllButton}
                  onClick={() => {
                    onToggleSelectAll(!isSelectAll)
                  }}
                  size="small"
                  variant="text"
                  color="inherit"
                >
                  {isSelectAll ? 'Deselect All' : 'Select All'}
                </Button>
              </Grid>
            )}
          </Grid>
        )}

        <Grid container>{children}</Grid>
      </Grid>
    </>
  )
}
