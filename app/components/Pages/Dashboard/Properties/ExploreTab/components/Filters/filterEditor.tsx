import { useState, MouseEvent } from 'react'

import {
  Button,
  Grid,
  Popover,
  Typography,
  PopoverOrigin
} from '@material-ui/core'

import { useStyles } from './styles'

export interface RenderButton {
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void
}

interface Props {
  resultCount?: number
  buttonLabel?: React.ReactNode
  buttonStartIcon?: React.ReactNode
  buttonEndIcon?: React.ReactNode
  filterEditorOptions?: {
    hasResetButton: boolean
    hasResultsCount: boolean
  }
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  renderButton?: (props: RenderButton) => React.ReactNode
  children: () => React.ReactNode
}

export function FilterEditor({
  resultCount,
  renderButton,
  children,
  buttonLabel = 'Filters',
  buttonStartIcon,
  buttonEndIcon,
  filterEditorOptions = {
    hasResetButton: true,
    hasResultsCount: true
  },
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center'
  },
  transformOrigin = {
    vertical: 'top',
    horizontal: 'center'
  }
}: Props) {
  const classes = useStyles()
  const [filterAnchor, setFilterAnchor] =
    useState<Nullable<HTMLButtonElement>>(null)

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    setFilterAnchor(event.currentTarget)
  }

  function handleClose() {
    setFilterAnchor(null)
  }

  const isOpen = Boolean(filterAnchor)

  const hasFooter =
    filterEditorOptions.hasResetButton || filterEditorOptions.hasResultsCount

  return (
    <>
      {renderButton ? (
        renderButton({ onOpen: handleOpen })
      ) : (
        <Button
          variant="outlined"
          color="default"
          onClick={handleOpen}
          startIcon={buttonStartIcon}
          endIcon={buttonEndIcon}
        >
          {buttonLabel}
        </Button>
      )}
      <Popover
        open={isOpen}
        anchorEl={filterAnchor}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        elevation={10}
      >
        {children()}
        {hasFooter && (
          <Grid item container className={classes.footer} alignItems="center">
            <Grid item xs={5}>
              {filterEditorOptions.hasResetButton && (
                <Button variant="text" color="primary">
                  Reset
                </Button>
              )}
            </Grid>
            <Grid item xs={7} container justifyContent="flex-end">
              {filterEditorOptions.hasResultsCount &&
                typeof resultCount === 'number' && (
                  <Typography align="right" variant="caption">
                    {resultCount} Results
                  </Typography>
                )}
            </Grid>
          </Grid>
        )}
      </Popover>
    </>
  )
}
