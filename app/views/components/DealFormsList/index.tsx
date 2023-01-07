import { makeStyles, Theme, Typography } from '@material-ui/core'

import { TextWithHighlights } from '../TextWithHighlights'

import { DealFormSelection } from './Selection'

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
      height: theme.spacing(7.5),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
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

interface SingleSelection {
  selectionType?: 'single'
}

interface MultipleSelection {
  selectionType?: 'multiple'
  selectionList: Record<string, boolean>
  onChangeSelection: (formId: UUID, checked: boolean) => void
}

type SelectionType = SingleSelection | MultipleSelection

interface Props {
  forms: IBrandForm[]
  textHighlight?: string
}

export function DealFormsList({
  textHighlight,
  forms = [],
  selectionType = 'multiple',
  ...restProps
}: Props & SelectionType) {
  const classes = useStyles()

  const handleSelectionChange = (formId: UUID, checked: boolean) => {
    ;(restProps as MultipleSelection)?.onChangeSelection?.(formId, checked)
  }

  return (
    <div className={classes.root}>
      {forms.map(form => (
        <div key={form.id} className={classes.row}>
          {selectionType === 'multiple' && (
            <div className={classes.checkboxContainer}>
              <DealFormSelection
                checked={
                  (restProps as MultipleSelection).selectionList[form.id] ??
                  false
                }
                onChange={checked => handleSelectionChange(form.id, checked)}
              />
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
