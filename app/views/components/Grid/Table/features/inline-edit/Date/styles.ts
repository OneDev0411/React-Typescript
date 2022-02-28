import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      background: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      zIndex: 10,
      boxShadow:
        '0px 0.3px 0.5px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)',
      border: 'none'
    },
    inputContainer: ({ rowSize }: { rowSize: number }) => ({
      background: theme.palette.background.paper,
      height: rowSize,
      border: `1px solid ${theme.palette.primary.main}`,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius
    }),
    textField: {
      ...theme.typography.body2,
      paddingLeft: theme.spacing(2) - 1,
      lineHeight: 'inherit',
      borderRadius: theme.shape.borderRadius
    },
    footerContainer: {
      borderTop: `1px solid ${theme.palette.action.disabledBackground}`,
      marginTop: theme.spacing(2),
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(2)
    },
    footerAction: {
      ...theme.typography.body2,
      lineHeight: `${theme.spacing(3)}px`,
      cursor: 'pointer',
      color: theme.palette.tertiary.dark
    },
    pickerContainer: {
      background: theme.palette.background.paper,
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.primary.main}`,
      borderTop: 'none',

      '& .DayPicker': {
        padding: 0,

        '& > *': {
          outline: 'none !important'
        },

        '& > .DayPicker-wrapper': {
          paddingBottom: 0,

          '& > .DayPicker-NavBar': {
            top: 0,
            right: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 'auto',
            height: '56px',
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
          '& .DayPicker-Months': {
            '& > .DayPicker-Month': {
              margin: theme.spacing(0, 1),

              '& > .DayPicker-Caption': {
                ...theme.typography.subtitle2,
                textAlign: 'left',
                height: 'auto',
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
                    lineHeight: `${theme.spacing(3)}px`,
                    color: theme.palette.grey['500'],

                    '&:first-child': {
                      borderTopLeftRadius: theme.shape.borderRadius,
                      borderBottomLeftRadius: theme.shape.borderRadius
                    },
                    '&:last-child': {
                      borderTopRightRadius: theme.shape.borderRadius,
                      borderBottomRightRadius: theme.shape.borderRadius
                    }
                  }
                }
              },
              '& .DayPicker-Week': {
                ...theme.typography.body3,
                padding: 0,

                '& .DayPicker-Day': {
                  height: '32px',
                  width: '32px',
                  padding: 0,
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
      }
    },
    clearButton: {
      ...theme.typography.body2
    }
  })

export const useStyles = makeStyles(styles, {
  name: 'DateInlineEdit'
})
