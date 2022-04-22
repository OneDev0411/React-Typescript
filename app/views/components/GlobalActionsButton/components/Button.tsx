import React, { MouseEvent } from 'react'

import { makeStyles, createStyles, Theme, Button } from '@material-ui/core'

import { CustomButtonRenderProps } from '../types'

interface Props {
  renderButton?: (renderProps: CustomButtonRenderProps) => React.ReactNode
  onClick: (event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(0, 2.5),
      marginBottom: theme.spacing(3)
    },
    root: {
      borderRadius: '50px'
    }
  })
)

export default function GlobalActionsMenu({ onClick, renderButton }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {renderButton ? (
        renderButton({
          onClick
        })
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          onClick={onClick}
          classes={{
            root: classes.root
          }}
        >
          Create
        </Button>
      )}
    </div>
  )
}
