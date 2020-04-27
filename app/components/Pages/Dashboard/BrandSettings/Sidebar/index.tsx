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
  sections: SidebarSection[]
  settings: BrandSettingsPalette
  onImageUpload: ImageUploadHandler
  onUpdate: (newSettings: BrandSettingsPalette) => void
}

export default function Sidebar({
  sections,
  settings,
  onImageUpload,
  onUpdate
}: Props) {
  const classes = useStyles()

  const handleUpdateSettings = (
    key: BrandSettingsPaletteKey,
    value: string
  ) => {
    if (settings[key] === value) {
      return
    }

    onUpdate({
      ...settings,
      [key]: value
    })
  }

  return (
    <Grid item md={3} className={classes.wrapper}>
      {sections.map((section, sectionIndex) => (
        <React.Fragment key={section.name}>
          <ExpansionPanel elevation={0}>
            <ExpansionPanelSummary expandIcon={<IconKeyboardArrowDown />}>
              <Typography variant="subtitle2">{section.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={2}>
                {section.fields.map((field, index) =>
                  field === 'divider' ? (
                    <Grid container item key={index}>
                      <div className={classes.dividerContainer}>
                        <Divider />
                      </div>
                    </Grid>
                  ) : (
                    <Field
                      key={field.name}
                      {...field}
                      value={settings[field.name]}
                      onChange={handleUpdateSettings}
                      onImageUpload={onImageUpload}
                    />
                  )
                )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {sectionIndex < sections.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      <Divider />
    </Grid>
  )
}
