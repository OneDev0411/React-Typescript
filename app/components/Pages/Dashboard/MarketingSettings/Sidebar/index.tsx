import React from 'react'
import {
  Grid,
  Divider,
  TextField,
  FormControl,
  InputAdornment,
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
        borderLeft: `1px solid ${theme.palette.divider}`
      },
      scrollableArea: {
        maxHeight: '100vh',
        overflow: 'overlay'
      },
      colorPickerSquare: {
        width: theme.spacing(3),
        height: theme.spacing(3)
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
    if (settings[key] === value) {
      return
    }

    onUpdate({
      ...settings,
      [key]: value
    })
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.scrollableArea}>
        {sections.map((section, sectionIndex) => (
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
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <span
                                    className={classes.colorPickerSquare}
                                    style={{
                                      backgroundColor: settings[field.name]
                                    }}
                                  />
                                </InputAdornment>
                              )
                            }}
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
            {sectionIndex < sections.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
      <Divider />
    </div>
  )
}
