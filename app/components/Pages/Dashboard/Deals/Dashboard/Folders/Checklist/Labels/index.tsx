import { Typography, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      color: theme.palette.grey['500']
    }
  }),
  {
    name: 'Checklists-Labels'
  }
)

interface Props {
  checklist: IDealChecklist | null
}

export function ChecklistLabels({ checklist }: Props) {
  const classes = useStyles()

  if (!checklist) {
    return null
  }

  let labels: string[] = []

  if (checklist.is_deactivated) {
    labels = ['Backup']
  }

  if (checklist.checklist_type === 'Buying' && !checklist.is_deactivated) {
    labels = [...labels, 'Primary']
  }

  if (checklist.is_terminated) {
    labels = [...labels, 'Terminated']
  }

  return (
    <Typography variant="subtitle2" className={classes.title}>
      {labels.join(' - ')}
    </Typography>
  )
}
