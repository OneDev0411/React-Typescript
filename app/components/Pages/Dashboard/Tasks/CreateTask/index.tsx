import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons'

export function CreateTask() {
  return (
    <Button
      size="medium"
      color="primary"
      variant="contained"
      startIcon={<SvgIcon path={mdiPlus} />}
      onClick={() => {}}
    >
      Add Task
    </Button>
  )
}
