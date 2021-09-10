import { Button, Grid, Typography } from '@material-ui/core'

import { useStyles } from '../styles'

interface Props {
  title?: string
  hasSelectAll?: boolean
  children: React.ReactNode
}

export const EditorGroup = ({ title, hasSelectAll, children }: Props) => {
  const classes = useStyles()

  return (
    <>
      <Grid item container>
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
                <Button variant="text" color="secondary">
                  Select All
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
