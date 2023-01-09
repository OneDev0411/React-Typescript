import { Box, makeStyles, Theme, Typography } from '@material-ui/core'

import { TextWithHighlights } from '../TextWithHighlights'

import { DealFormSelection } from './Selection'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '$row:last-child': {
        borderBottom: 'none'
      }
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1.5, 2),
      height: theme.spacing(7.5),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      '& $actions': {
        display: 'none'
      },
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '&:hover $actions': {
        display: 'block'
      }
    },
    checkboxContainer: {
      marginRight: theme.spacing(1)
    },
    textHighlight: {
      display: 'inline'
    },
    actions: {
      '& button': {
        marginLeft: theme.spacing(1)
      }
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
  RowActionsBuilder?: (data: { form: IBrandForm }) => JSX.Element
}

export function DealFormsList({
  textHighlight,
  forms = [],
  selectionType = 'multiple',
  RowActionsBuilder,
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
          <Box display="flex" alignItems="center">
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
          </Box>

          <Box className={classes.actions}>
            {RowActionsBuilder && <RowActionsBuilder form={form} />}
          </Box>
        </div>
      ))}
    </div>
  )
}
