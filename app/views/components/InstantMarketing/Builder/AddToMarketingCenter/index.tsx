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

import { useMarketingCenterCategories } from 'hooks/use-marketing-center-categories'
import { createTemplate } from 'models/instant-marketing/create-template'

import ActionButton from 'components/Button/ActionButton'
import { Icon } from 'components/Dropdown'
import { BaseDropdown } from 'components/BaseDropdown'
import UserTeams from 'components/UserTeams'

import { SAVED_TEMPLATE_VARIANT } from './constants'

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
  mjml: boolean
  getTemplateMarkup: () => string
}

interface ConnectedProps {
  notify: (notification: Notification) => any
}

export function AddToMarketingCenter({
  medium,
  user,
  mjml,
  getTemplateMarkup,
  notify
}: Props & ConnectedProps) {
  const [selectedTemplateType, setSelectedTemplateType] = useState('none')
  const categories = useMarketingCenterCategories()
  const classes = useStyles()
  const name = uuidv4()
  const variant = SAVED_TEMPLATE_VARIANT
  const [isUserTeamsDrawerOpen, setIsUserTeamsDrawerOpen] = useState(false)

  async function handleSelectTeams(teams: UUID[]) {
    setIsUserTeamsDrawerOpen(false)

    const html = getTemplateMarkup()

    try {
      const templateData = {
        name,
        variant,
        templateType: selectedTemplateType,
        medium,
        html,
        brands: teams,
        mjml
      }

      await createTemplate(templateData)

      notify({
        status: 'success',
        message: 'Template saved successfully.'
      })

      setTimeout(window.location.reload, 100)
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
    <>
      {isUserTeamsDrawerOpen && (
        <UserTeams
          title="Save Template For ..."
          user={user}
          onClose={() => setIsUserTeamsDrawerOpen(false)}
          onSelectTeams={handleSelectTeams}
        />
      )}
      <div className={classes.container}>
        <BaseDropdown
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
                          <MenuItem value="none">Select a Category</MenuItem>
                          {categories.map(cat => {
                            if (!cat.value) {
                              return null
                            }

                            const value =
                              typeof cat.value === 'string'
                                ? cat.value
                                : cat.value[cat.value.length - 1]

                            return (
                              <MenuItem key={value} value={value}>
                                {cat.title}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid container item xs={12} justify="flex-end">
                      <ActionButton
                        appearance="primary"
                        onClick={() => setIsUserTeamsDrawerOpen(true)}
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
    </>
  )
}

export default connect(
  null,
  { notify: addNotification }
)(AddToMarketingCenter)
