import { Checkbox, makeStyles, Theme, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '& :last-child': {
        borderBottom: 'none'
      }
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1.5, 2),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    },
    checkboxContainer: {
      marginRight: theme.spacing(1)
    }
  }),
  {
    name: 'DealFormsList'
  }
)

interface Props {
  selectionType?: 'single' | 'multiple'
  forms: IBrandForm[]
}

export function DealFormsList({
  forms = [],
  selectionType = 'multiple'
}: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {forms.map(form => (
        <div key={form.id} className={classes.row}>
          {selectionType === 'multiple' && (
            <div className={classes.checkboxContainer}>
              <Checkbox color="primary" />
            </div>
          )}
          <Typography variant="subtitle2">{form.name}</Typography>
        </div>
      ))}
    </div>
  )
}
