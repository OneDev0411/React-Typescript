import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tabs,
  Tab,
  Button,
  makeStyles,
  useMediaQuery,
  Theme,
  Box
} from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { closeIcon } from 'components/SvgIcons/icons'

import { TemplateVariable, TemplateVariableType } from '../types'

import Field from './Field'

const useStyles = makeStyles(
  (theme: Theme) => ({
    tabs: {
      width: '100%',
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  }),
  {
    name: 'MarketingWizardEditVariablesDialog'
  }
)

interface Props {
  variables: TemplateVariable<TemplateVariableType>[]
  onClose: () => void
  onUpload: (file: File) => Promise<ITemplateAsset>
  onSave: (updatedVariables: TemplateVariable<TemplateVariableType>[]) => void
}

export default function EditVariablesDialog({
  variables,
  onClose,
  onUpload,
  onSave
}: Props) {
  const classes = useStyles()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'))

  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [updatedVariables, setUpdatedVariables] = useState<
    TemplateVariable<TemplateVariableType>[]
  >([])

  const sections = [...new Set(variables.map(item => item.section))]

  const handleChangeTab = (event: unknown, newValue: number) => {
    setSelectedTab(newValue)
  }

  const handleChangeIndex = (newIndex: number) => {
    setSelectedTab(newIndex)
  }

  const handleChangeVariableValue = (
    variable: TemplateVariable<TemplateVariableType>
  ) => {
    setUpdatedVariables([
      ...updatedVariables.filter(item => item.name !== variable.name),
      variable
    ])
  }

  const handleSave = () => {
    onSave(updatedVariables)
  }

  return (
    <Dialog
      open
      fullWidth
      fullScreen={isMobile}
      maxWidth="sm"
      onClose={onClose}
    >
      <DialogTitle>
        <Grid container direction="column">
          <Grid container item alignItems="center" justify="space-between">
            <Grid item>
              <IconButton onClick={onClose}>
                <SvgIcon path={closeIcon} />
              </IconButton>
            </Grid>
            <Grid item>Edit Info</Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
          <Grid container item>
            <Tabs
              value={selectedTab}
              onChange={handleChangeTab}
              indicatorColor="primary"
              variant="fullWidth"
              className={classes.tabs}
            >
              {sections.map(section => (
                <Tab key={section} label={section} />
              ))}
            </Tabs>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <SwipeableViews
          axis="x"
          index={selectedTab}
          onChangeIndex={handleChangeIndex}
          style={{
            height: '100%'
          }}
        >
          {sections.map(section => (
            <Grid key={section} container direction="column">
              <Box overflow="hidden">
                {variables
                  .filter(item => item.section === section)
                  .map(variable => {
                    const possiblyUpdatedVariable =
                      updatedVariables.find(
                        item => item.name === variable.name
                      ) ?? variable

                    return (
                      <Field
                        key={variable.name}
                        variable={possiblyUpdatedVariable}
                        onUpload={onUpload}
                        onChange={handleChangeVariableValue}
                      />
                    )
                  })}
              </Box>
            </Grid>
          ))}
        </SwipeableViews>
      </DialogContent>
    </Dialog>
  )
}
