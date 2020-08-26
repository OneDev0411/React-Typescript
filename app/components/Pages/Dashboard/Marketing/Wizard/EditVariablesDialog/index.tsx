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
  useTheme,
  useMediaQuery,
  makeStyles,
  Theme
} from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { closeIcon } from 'components/SvgIcons/icons'

import { TemplateVariable, TemplateVariableType } from '../types'

import Field from './Field'

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    width: '100%',
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

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
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

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
    <Dialog open scroll="paper" fullScreen={fullScreen} onClose={onClose}>
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
              <Button variant="text" color="primary" onClick={handleSave}>
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
            </Grid>
          ))}
        </SwipeableViews>
      </DialogContent>
    </Dialog>
  )
}
