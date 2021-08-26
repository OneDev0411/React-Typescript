import React from 'react'

import {
  Button,
  Popper,
  ClickAwayListener,
  Paper,
  MenuItem,
  Checkbox,
  Box,
  ButtonGroup,
  Typography,
  Divider,
  makeStyles
} from '@material-ui/core'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

const useStyles = makeStyles(
  () => ({
    active: {
      '&, &:hover': {
        boxShadow: 'inset 0px 0px 11px -7px #000000',
        backgroundColor: '#00B286',
        color: '#fff'
      }
    }
  }),
  { name: 'ListingsSort' }
)

export const Sort = () => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        Price <ArrowUpwardIcon />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-end"
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <Box>
              <Box p={2}>
                <ButtonGroup
                  size="large"
                  aria-label="large outlined primary button group"
                >
                  <Button className={classes.active}>Ascending</Button>
                  <Button>Descending</Button>
                </ButtonGroup>
              </Box>
              <Divider />
              <MenuItem onClick={handleClose}>Listed Date</MenuItem>
              <MenuItem onClick={handleClose} selected>
                {/* TODO: check out our global theme definition and make sure selected
              state for MenuItem has the right color: #00B286  */}
                Price
              </MenuItem>
              <MenuItem onClick={handleClose}>Bedrooms</MenuItem>
              <MenuItem onClick={handleClose}>Bathsrooms</MenuItem>
              <MenuItem onClick={handleClose}>Square Feet</MenuItem>
              <MenuItem onClick={handleClose}>Lot Size</MenuItem>
              <MenuItem onClick={handleClose}>Year Built</MenuItem>
              <Divider />
              <Typography>
                <Checkbox color="primary" defaultChecked />
                Our listings first
              </Typography>
            </Box>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  )
}
