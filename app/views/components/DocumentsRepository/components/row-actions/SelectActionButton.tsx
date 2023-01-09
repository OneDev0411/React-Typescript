import { Button } from '@material-ui/core'

interface Props {
  form: IBrandForm
  onSelect: (form: IBrandForm) => void
}

export function SelectActionButton({ form, onSelect }: Props) {
  return (
    <Button size="small" variant="outlined" onClick={() => onSelect(form)}>
      Select
    </Button>
  )
}
