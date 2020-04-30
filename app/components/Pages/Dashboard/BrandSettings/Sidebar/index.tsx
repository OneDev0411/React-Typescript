import React from 'react'
import {
  Grid,
  Divider,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import { SidebarSection, ImageUploadHandler } from '../types'
import Field from './Field'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      wrapper: {
        borderLeft: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 0,
        right: 0,
        height: '100vh',
        overflow: 'overlay'
      },
      dividerContainer: {
        width: '100%'
      }
    }),
  { name: 'MarketingSettingsSidebar' }
)

interface Props {
  children: React.ReactNode
  defaultExpandedPanels?: boolean
  sections: SidebarSection[]
  settings: BrandSettingsPalette
  onImageUpload: ImageUploadHandler
  onUpdate: (newSettings: BrandSettingsPalette) => void
}

export default function Sidebar({
  children,
  defaultExpandedPanels,
  sections,
  settings,
  onImageUpload,
  onUpdate
}: Props) {
  const classes = useStyles()

  const handleUpdateSettings = (
    key: BrandSettingsPaletteKey | BrandSettingsPaletteKey[],
    value: string
  ) => {
    const keys = Array.isArray(key) ? key : [key]

    const changedSettings = {}

    keys.forEach(settingKey => {
      changedSettings[settingKey] = value
    })

    onUpdate({
      ...settings,
      ...changedSettings
    })
  }

  return (
    <Grid item md={3} className={classes.wrapper}>
      {sections.map(section => (
        <React.Fragment key={section.name}>
          <ExpansionPanel
            TransitionProps={{ unmountOnExit: true }}
            elevation={0}
            defaultExpanded={defaultExpandedPanels}
          >
            <ExpansionPanelSummary expandIcon={<IconKeyboardArrowDown />}>
              <Typography variant="subtitle2">{section.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={2}>
                {section.fields.map((field, index) => {
                  if (field === 'divider') {
                    return (
                      <Grid container item key={index}>
                        <div className={classes.dividerContainer}>
                          <Divider />
                        </div>
                      </Grid>
                    )
                  }

                  const value = settings[field.names[0]]

                  return (
                    <Field
                      key={field.label}
                      {...field}
                      value={value}
                      onChange={handleUpdateSettings}
                      onImageUpload={onImageUpload}
                    />
                  )
                })}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Divider />
        </React.Fragment>
      ))}
      {children}
    </Grid>
  )
}
