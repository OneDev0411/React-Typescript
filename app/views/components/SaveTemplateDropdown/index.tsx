import React from 'react'
import {
  ClickAwayListener,
  Paper,
  Box,
  Popper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'

import ActionButton from 'components/Button/ActionButton'
import { Icon } from 'components/Dropdown'

function SaveTemplateDropdown() {
  const [isOpen, setOpen] = React.useState(false)

  return (
    <div style={{ position: 'relative', zIndex: 1111 }}>
      <ActionButton
        appearance="outline"
        size="large"
        inverse
        onClick={() => setOpen(true)}
      >
        <span>Save As</span>
        <Icon isOpen={isOpen} />
      </ActionButton>
      <Popper open={isOpen} disablePortal placement="bottom-end">
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper>
            <Box p={2}>
              <TextField
                label="Template Name"
                margin="normal"
                variant="filled"
                fullWidth
              />
              <FormControl variant="filled" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                // value={selectedCategory}
                // onChange={handleChange}
                >
                  <MenuItem value="Occasions">Occasions</MenuItem>
                  <MenuItem value="Occasions2">Folan</MenuItem>
                  <MenuItem value="Occasions3">Bisar</MenuItem>
                </Select>
              </FormControl>
              <div>
                <ActionButton appearance="primary">Save</ActionButton>
              </div>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  )
}

export default SaveTemplateDropdown
