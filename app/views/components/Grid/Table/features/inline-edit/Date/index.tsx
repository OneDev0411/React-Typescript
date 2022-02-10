import { useState, useEffect } from 'react'

import { makeStyles, TextField, Theme } from '@material-ui/core'
import fecha from 'fecha'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(0),
      top: 0,
      position: 'absolute',
      minWidth: '115%',
      background: theme.palette.background.paper,
      borderRadius: theme.spacing(0.5),
      zIndex: 10,
      boxShadow:
        '0px 0.3px 0.5px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)',
      border: 'none'
    },
    inputContainer: {
      background: theme.palette.background.paper,
      height: theme.spacing(5),
      border: `1px solid ${theme.palette.primary.main}`,
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5)
    },
    textField: {
      ...theme.typography.body2,
      letterSpacing: 0.15,
      paddingLeft: theme.spacing(2) - 1,
      lineHeight: 'inherit',
      borderRadius: theme.spacing(0.5)
    },
    pickerContainer: {
      background: theme.palette.background.paper,
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.primary.main}`,
      borderTop: 'none',

      '& > .footer': {
        borderTop: `1px solid ${theme.palette.action.disabledBackground}`,
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),

        '& > a': {
          ...theme.typography.body2,
          letterSpacing: '0.1px',
          lineHeight: `${theme.spacing(3)}px`,
          color: theme.palette.tertiary.dark
        }
      },

      '& .DayPicker': {
        padding: 0,

        '& > .DayPicker-wrapper': {
          paddingBottom: 0,

          '& > .DayPicker-NavBar': {
            top: 0,
            right: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 'auto',
            height: theme.spacing(7),
            gap: theme.spacing(3),
            padding: 0,
            left: 'auto',

            '& > .DayPicker-NavButton': {
              width: theme.spacing(1.5),
              height: theme.spacing(1.5),
              position: 'relative',
              top: 0,
              right: 0,
              marginTop: 0,

              '&:hover': {
                color: theme.palette.tertiary.dark
              },

              '&--prev ': {
                left: 0,
                marginRight: 0,
                backgroundImage: `
                  url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDggMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik03LjQxIDEwLjU4TDIuODMgNkw3LjQxIDEuNDFMNiAwTDAgNkw2IDEyTDcuNDEgMTAuNThaIiBmaWxsPSIjOTQ5NTk4Ii8+Cjwvc3ZnPgo=)
                `
              },
              '&--next ': {
                right: 0,
                backgroundImage: `
                  url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDggMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wLjU4OTk5NiAxMC41OEw1LjE3IDZMMC41ODk5OTYgMS40MUwyIDBMOCA2TDIgMTJMMC41ODk5OTYgMTAuNThaIiBmaWxsPSIjOTQ5NTk4Ii8+Cjwvc3ZnPgo=)
                `
              }
            }
          },
          '& .DayPicker-Month': {
            margin: theme.spacing(0, 1),

            '& > .DayPicker-Caption': {
              ...theme.typography.subtitle2,
              textAlign: 'left',
              height: 'auto',
              letterSpacing: '0.1px',
              border: 0,
              marginBottom: 0,
              padding: theme.spacing(2.25, 1),
              lineHeight: `${theme.spacing(2.5)}px`
            },

            '& > .DayPicker-Weekdays': {
              '& .DayPicker-WeekdaysRow': {
                background: theme.palette.grey['100'],
                color: theme.palette.grey['600'],

                '& .DayPicker-Weekday': {
                  ...theme.typography.caption,
                  padding: 0,
                  letterSpacing: '0.4px',
                  lineHeight: `${theme.spacing(3)}px`,
                  color: theme.palette.grey['500']
                }
              }
            },
            '& .DayPicker-Week': {
              ...theme.typography.body3,
              padding: 0,
              letterSpacing: '0.2px',

              '& .DayPicker-Day': {
                padding: '6.5px 8.5px',
                cursor: 'pointer',

                '&:hover': {
                  backgroundColor: `${theme.palette.primary.dark} !important`
                },

                '&--outside': {
                  color: theme.palette.grey['500']
                },
                '&--selected': {
                  backgroundColor: `${theme.palette.primary.dark} !important`
                }
              }
            }
          }
        }
      }
    },
    clearButton: {
      ...theme.typography.body2
    }
  }),
  {
    name: 'Date-inline-edit'
  }
)

interface Props {
  value?: Date
  readOnly?: boolean
  dateFormat?: string
}

export function DateInlineEdit({
  value,
  readOnly = false,
  dateFormat = 'MMM DD, YYYY'
}: Props) {
  const [fieldValue, setFieldValue] = useState<Nullable<string>>()
  const classes = useStyles()

  useEffect(() => {
    if (value) {
      setFieldValue(fecha.format(value, dateFormat))
    }
  }, [value, dateFormat])

  const onChange = e => {
    const input = e.target.value

    if (fecha.parse(dateFormat, input)) {
      setFieldValue(input)
    }
  }

  const handleDayClick = () => null

  return (
    <div className={classes.root}>
      <div className={classes.inputContainer}>
        <TextField
          value={fieldValue}
          size="small"
          disabled={readOnly}
          fullWidth
          onChange={onChange}
          style={{
            flexDirection: 'row',
            height: '100%'
          }}
          InputProps={{
            disableUnderline: true,
            className: classes.textField
          }}
        />
      </div>
      <div className={classes.pickerContainer}>
        <DayPicker
          showOutsideDays
          month={value}
          selectedDays={[value]}
          onDayClick={handleDayClick}
        />

        <div className="footer">
          <a>Clear</a>
        </div>
      </div>
    </div>
  )
}
