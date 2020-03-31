import React from 'react'
import {
  Grid,
  Divider,
  TextField,
  FormControl,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import ColorPicker from 'material-ui-color-picker'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import { SidebarSection } from '../types'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      wrapper: {
        borderLeft: `1px solid ${theme.palette.divider}`,
        height: '100%'
      }
    }),
  { name: 'MarketingSettingsSidebar' }
)

interface Props {
  sections: SidebarSection[]
  settings: BrandSettingsPalette
  // onImageUpload: () => void
  onUpdate: (newSettings: BrandSettingsPalette) => void
}

export default function Sidebar({ sections, settings, onUpdate }: Props) {
  const classes = useStyles()

  const handleUpdateSettings = (
    key: BrandSettingsPaletteKey,
    value: string
  ) => {
    console.log({ key, value })
    onUpdate({
      ...settings,
      [key]: value
    })
  }

  return (
    <div className={classes.wrapper}>
      {sections.map(section => (
        <React.Fragment key={section.name}>
          <ExpansionPanel elevation={0}>
            <ExpansionPanelSummary expandIcon={<IconKeyboardArrowDown />}>
              <Typography variant="subtitle2">{section.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={2}>
                {section.fields.map(field => (
                  <Grid container item key={field.name}>
                    <FormControl fullWidth>
                      {field.type === 'color' && (
                        <ColorPicker
                          size="small"
                          variant="outlined"
                          label={field.label}
                          value={settings[field.name]}
                          TextFieldProps={{ value: settings[field.name] }}
                          onChange={(color?: string) => {
                            if (!color) {
                              return
                            }

                            handleUpdateSettings(field.name, color)
                          }}
                        />
                      )}
                      {field.type !== 'color' && (
                        <TextField
                          size="small"
                          variant="outlined"
                          label={field.label}
                          value={settings[field.name]}
                          onChange={e =>
                            handleUpdateSettings(field.name, e.target.value)
                          }
                        />
                      )}
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Divider />
        </React.Fragment>
      ))}
    </div>
  )
}
