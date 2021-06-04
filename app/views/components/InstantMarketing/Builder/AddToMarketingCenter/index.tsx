import React, { useState } from 'react'

import {
  Popover,
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { v4 as uuidv4 } from 'uuid'
import { connect } from 'react-redux'

import { addNotification, Notification } from 'components/notification'
import TeamTreeViewDrawer from 'components/TeamTreeView/Drawer'

import { useMarketingCenterCategories } from 'hooks/use-marketing-center-categories'
import { createTemplate } from 'models/instant-marketing/create-template'

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
  mjml: boolean
  getTemplateMarkup: () => string
  disabled?: boolean
}

interface ConnectedProps {
  notify: (notification: Notification) => any
}

export function AddToMarketingCenter({
  medium,
  mjml,
  getTemplateMarkup,
  notify,
  disabled = false
}: Props & ConnectedProps) {
  const [selectedTemplateType, setSelectedTemplateType] = useState<
    Optional<IMarketingTemplateType>
  >(undefined)
  const [
    isTeamsSelectorDrawerOpen,
    setIsTeamsSelectorDrawerOpen
  ] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const categories = useMarketingCenterCategories()
  const classes = useStyles()
  const name = uuidv4()

  const variant = SAVED_TEMPLATE_VARIANT

  const handleClickButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const handleCategoryClick = (selectedCategory: IMarketingTemplateType) => {
    setSelectedTemplateType(selectedCategory)
    setIsTeamsSelectorDrawerOpen(true)
    handleClosePopover()
  }

  async function handleSelectTeam(team: IBrand) {
    if (!selectedTemplateType) {
      return
    }

    const html = getTemplateMarkup()

    try {
      const templateData = {
        name,
        variant,
        templateType: selectedTemplateType,
        medium,
        html,
        brands: [team.id],
        mjml
      }

      await createTemplate(templateData)

      notify({
        status: 'success',
        message: 'Template saved successfully.'
      })

      setIsTeamsSelectorDrawerOpen(false)

      setTimeout(() => window.location.reload(), 1000)
    } catch (err) {
      notify({
        status: 'error',
        message:
          'Something went wrong while saving the template. Please try again.'
      })

      console.error(err)
    }
  }

  const open = Boolean(anchorEl)

  return (
    <>
      {isTeamsSelectorDrawerOpen && (
        <TeamTreeViewDrawer
          title="Save Template For ..."
          onClose={() => setIsTeamsSelectorDrawerOpen(false)}
          onSelectTeam={handleSelectTeam}
        />
      )}
      <div className={classes.container}>
        <Button
          variant="outlined"
          onClick={handleClickButton}
          disabled={disabled}
        >
          Add To Marketing Center
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <List>
            <ListSubheader>Please select a category to continue</ListSubheader>
            {categories.map(category => {
              if (!category.value) {
                return null
              }

              const value =
                typeof category.value === 'string'
                  ? category.value
                  : category.value[category.value.length - 1]

              return (
                <ListItem
                  button
                  onClick={() => handleCategoryClick(value)}
                  key={value}
                >
                  <ListItemText>{category.title}</ListItemText>
                </ListItem>
              )
            })}
          </List>
        </Popover>
      </div>
    </>
  )
}

export default connect(null, { notify: addNotification })(AddToMarketingCenter)
