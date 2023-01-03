import { Checkbox, makeStyles, Theme, Typography } from '@material-ui/core'

import { TextWithHighlights } from '../TextWithHighlights'

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
    },
    textHighlight: {
      display: 'inline'
    }
  }),
  {
    name: 'DealFormsList'
  }
)

interface Props {
  selectionType?: 'single' | 'multiple'
  forms: IBrandForm[]
  textHighlight?: string
}

export function DealFormsList({
  textHighlight,
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
          <Typography variant="body2">
            {textHighlight ? (
              <TextWithHighlights
                HighlightComponent={Typography}
                highlightProps={{
                  variant: 'subtitle2',
                  className: classes.textHighlight
                }}
                search={textHighlight}
              >
                {form.name}
              </TextWithHighlights>
            ) : (
              <>{form.name}</>
            )}
          </Typography>
        </div>
      ))}
    </div>
  )
}
