import React from 'react'
import {
  ClickAwayListener,
  Paper,
  Box,
  Popper,
  InputBase,
  FormControl,
  Select,
  MenuItem
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ActionButton from 'components/Button/ActionButton'
import { Icon } from 'components/Dropdown'

import { saveTemplate } from 'models/instant-marketing/save-template'
import { getActiveTeamId } from 'utils/user-teams'

const CATEGORIES = [
  {
    name: 'Select Category',
    value: 'none'
  },
  {
    name: 'Occasions',
    value: 'Birthday'
  },
  {
    name: 'Brand Campaigns',
    value: 'Brand'
  },
  {
    name: 'Holiday',
    value: 'OtherHoliday'
  },
  {
    name: 'New Agent',
    value: 'NewAgent'
  }
]

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  input: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[100]
  },
  saveAsContainer: {
    // zIndex: 1111,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  modalContainer: {
    zIndex: theme.zIndex.modal
  }
}))

interface SaveTemplateProps {
  medium: string
  inputs: string[]
  user: any
}

function SaveTemplateDropdown(props: SaveTemplateProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState('none')
  const [templateName, setTemplateName] = React.useState('')
  const classes = useStyles()
  const activeTeamId = getActiveTeamId(props.user)
  const isOpen = Boolean(anchorEl)
  const save = () => {
    saveTemplate({
      name: templateName,
      brandId: activeTeamId,
      medium: props.medium,
      inputs: props.inputs,
      type: selectedCategory
    })
  }

  return (
    <div className={classes.saveAsContainer}>
      <ActionButton
        appearance="outline"
        size="medium"
        inverse
        onClick={event => setAnchorEl(anchorEl ? null : event.currentTarget)}
      >
        <span>Save As</span>
        <Icon isOpen={isOpen} />
      </ActionButton>
      <Popper
        open={isOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
        className={classes.modalContainer}
      >
        <ClickAwayListener
          onClickAway={e => {
            const target = e.target as HTMLElement

            if (target && target.id && target.id.startsWith('cat-')) {
              return
            }

            setAnchorEl(null)
          }}
        >
          <Paper>
            <Box p={2}>
              <InputBase
                placeholder="Template Name"
                classes={{ root: classes.root, input: classes.input }}
                fullWidth
                value={templateName}
                onChange={e => {
                  setTemplateName(e.target.value)
                }}
              />
              <FormControl classes={{ root: classes.root }} fullWidth>
                <Select
                  classes={{ select: classes.input }}
                  value={selectedCategory}
                  onChange={e => {
                    setSelectedCategory(e.target.value as string)
                  }}
                >
                  {CATEGORIES.map((cat, index) => (
                    <MenuItem
                      key={cat.value}
                      value={cat.value}
                      id={`cat-${index}`}
                    >
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div>
                <ActionButton
                  appearance="primary"
                  onClick={save}
                  disabled={selectedCategory === 'none' || !templateName}
                >
                  Save
                </ActionButton>
              </div>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  )
}

export default SaveTemplateDropdown
