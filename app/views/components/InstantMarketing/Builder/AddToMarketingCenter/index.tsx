import React, { useState } from 'react'
import { addNotification, Notification } from 'reapop'
import {
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import uuidv4 from 'uuid/v4'

import { connect } from 'react-redux'

import ActionButton from 'components/Button/ActionButton'
import { Icon } from 'components/Dropdown'
import { BaseDropdown } from 'components/BaseDropdown'

import { createTemplate } from 'models/instant-marketing/create-template'
import { getActiveTeamId } from 'utils/user-teams'

import { CATEGORIES, SAVED_TEMPLATE_VARIANT } from './constants'

const useStyles = makeStyles(theme => ({
  grid: {
    width: '200px'
  },
  formControl: {
    marginBottom: theme.spacing(2)
  },
  input: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[100]
  },
  container: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  modalContainer: {
    zIndex: theme.zIndex.modal
  }
}))

interface Props {
  medium: string
  user: IUser
  getTemplate: () => string
}

interface ConnectedProps {
  notify: (notification: Notification) => any
}

export function AddToMarketingCenter({
  medium,
  user,
  getTemplate,
  notify
}: Props & ConnectedProps) {
  const [selectedTemplateType, setSelectedTemplateType] = useState('none')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const classes = useStyles()
  const name = uuidv4()
  const variant = SAVED_TEMPLATE_VARIANT
  const activeTeamId = getActiveTeamId(user)
  const brands = activeTeamId ? [activeTeamId] : []
  const html = getTemplate()

  async function save() {
    try {
      const templateData = {
        name,
        variant,
        templateType: selectedTemplateType,
        medium,
        html,
        brands
      }

      const result = await createTemplate(templateData)

      console.log(result)

      notify({
        status: 'success',
        message: 'Template saved successfully.'
      })
      setIsDropdownOpen(false)
    } catch (err) {
      notify({
        status: 'error',
        message:
          'Something went wrong while saving the template. Please try again.'
      })

      console.error(err)
    }
  }

  return (
    <div className={classes.container}>
      <BaseDropdown
        onIsOpenChange={isOpen => isOpen && setIsDropdownOpen(isOpen)}
        isOpen={isDropdownOpen}
        PopperProps={{ keepMounted: true }}
        renderDropdownButton={buttonProps => (
          <ActionButton
            appearance="outline"
            size="medium"
            inverse
            {...buttonProps}
          >
            <span>Add To Marketing Center</span>
            <Icon isOpen={buttonProps.isActive} />
          </ActionButton>
        )}
        renderMenu={() => (
          <Card>
            <CardContent>
              <Box p={2}>
                <Grid container>
                  <Grid item xs={12} classes={{ root: classes.grid }}>
                    <FormControl
                      classes={{ root: classes.formControl }}
                      fullWidth
                    >
                      <Select
                        disableUnderline
                        classes={{ select: classes.input }}
                        value={selectedTemplateType}
                        onChange={e => {
                          setSelectedTemplateType(e.target.value as string)
                        }}
                        onClick={e => {
                          e.preventDefault()
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
                  </Grid>
                  <Grid container item xs={12} justify="flex-end">
                    <ActionButton
                      appearance="primary"
                      onClick={save}
                      disabled={selectedTemplateType === 'none' || !name}
                    >
                      Next
                    </ActionButton>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        )}
      />
    </div>
  )
}

export default connect(
  null,
  { notify: addNotification }
)(AddToMarketingCenter)
