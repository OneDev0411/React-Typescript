import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Box,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
  DialogTitle
} from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { closeIcon } from 'components/SvgIcons/icons'

import { TemplateVariableSectionWithItems, TemplateVariable } from './types'

interface Props {
  sections: TemplateVariableSectionWithItems[]
  onClose: () => void
  onSave: (updatedVariables: TemplateVariable[]) => void
}

export default function EditVariablesDialog({
  sections,
  onClose,
  onSave
}: Props) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [updatedVariables, setUpdatedVariables] = useState<TemplateVariable[]>(
    []
  )

  const handleChangeTab = (event: unknown, newValue: number) => {
    setSelectedTab(newValue)
  }

  const handleChangeIndex = (newIndex: number) => {
    setSelectedTab(newIndex)
  }

  const handleChangeVariableValue = (variable: TemplateVariable) => {
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
        <Grid container alignItems="center" justify="space-between">
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
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          variant="fullWidth"
        >
          {sections.map(section => (
            <Tab key={section.label} label={section.label} />
          ))}
        </Tabs>
        <SwipeableViews
          axis="x"
          index={selectedTab}
          onChangeIndex={handleChangeIndex}
          style={{
            height: '100%'
          }}
        >
          {sections.map(section => (
            <Grid key={section.label} container direction="column">
              {section.items.map(variable => {
                const possiblyUpdatedVariable =
                  updatedVariables.find(item => item.name === variable.name) ??
                  variable

                return (
                  <Grid key={possiblyUpdatedVariable.name} container item>
                    <Box width="100%" py={2}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label={possiblyUpdatedVariable.label}
                        value={possiblyUpdatedVariable.value ?? ''}
                        onChange={e =>
                          handleChangeVariableValue({
                            ...possiblyUpdatedVariable,
                            value: e.target.value
                          })
                        }
                      />
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          ))}
        </SwipeableViews>
      </DialogContent>
    </Dialog>
  )
}
