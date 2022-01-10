import { MouseEvent } from 'react'

import { Button, Grid } from '@material-ui/core'

import { noop } from '@app/utils/helpers'

import { useStyles } from './styles'

export interface RenderButton {
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void
}

interface Props {
  disabledReset?: boolean
  onClickReset?: () => void
}

export function FilterEditorFooter({
  disabledReset = false,
  onClickReset = noop
}: Props) {
  const classes = useStyles()

  return (
    <Grid item container className={classes.footer} alignItems="center">
      <Grid item xs={12}>
        <Button
          className={classes.footerResetButton}
          disabled={disabledReset}
          onClick={onClickReset}
          variant="text"
          color="secondary"
        >
          Reset
        </Button>
      </Grid>
    </Grid>
  )
}
