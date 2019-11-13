import React from 'react'
import {
  Box,
  InputBase,
  FormControl,
  Select,
  MenuItem
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ActionButton from 'components/Button/ActionButton'
import { Icon } from 'components/Dropdown'
import { BaseDropdown } from 'components/BaseDropdown'

import { saveTemplate } from 'models/instant-marketing/save-template'
import { getActiveTeamId } from 'utils/user-teams'

import { CATEGORIES } from './constants'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  input: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[100]
  },
  saveAsContainer: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  modalContainer: {
    zIndex: theme.zIndex.modal
  }
}))

interface Props {
  medium: string
  inputs: string[]
  user: IUser
}

function SaveTemplateDropdown(props: Props) {
  const [selectedCategory, setSelectedCategory] = React.useState('none')
  const [templateName, setTemplateName] = React.useState('')
  const classes = useStyles()
  const activeTeamId = getActiveTeamId(props.user)
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
      <BaseDropdown
        PopperProps={{ keepMounted: true }}
        renderDropdownButton={buttonProps => (
          <ActionButton
            appearance="outline"
            size="medium"
            inverse
            {...buttonProps}
          >
            <span>Save As</span>
            <Icon isOpen={buttonProps.isActive} />
          </ActionButton>
        )}
        renderMenu={() => (
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
                    onClick={e => e.stopPropagation()}
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
        )}
      />
    </div>
  )
}

export default SaveTemplateDropdown
