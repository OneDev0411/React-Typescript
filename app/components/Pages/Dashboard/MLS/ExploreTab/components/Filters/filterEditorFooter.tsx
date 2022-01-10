import { MouseEvent } from 'react'

import { Button, Grid, Typography } from '@material-ui/core'

import { noop } from '@app/utils/helpers'

import { useStyles } from './styles'

export interface RenderButton {
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void
}

interface Props {
  resultCount?: number
  disabledReset?: boolean
  onClickReset?: () => void
}

export function FilterEditorFooter({
  resultCount = 0,
  disabledReset = false,
  onClickReset = noop
}: Props) {
  const classes = useStyles()

  return (
    <Grid item container className={classes.footer} alignItems="center">
      <Grid item xs={5}>
        <Button
          className={classes.footerResetButton}
          disabled={disabledReset}
          onClick={onClickReset}
          variant="text"
          color="primary"
        >
          Reset
        </Button>
      </Grid>
      <Grid item xs={7} container justifyContent="flex-end">
        <Typography align="right" variant="caption">
          {resultCount} Results
        </Typography>
      </Grid>
    </Grid>
  )
}
