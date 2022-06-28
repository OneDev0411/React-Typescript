import { makeStyles, Theme } from '@material-ui/core'
import { mdiAccountArrowLeft } from '@mdi/js'

import FilterButton from '@app/views/components/Filters/FilterButton'

import { AssigneesList } from '../components/AssigneesList'

import { Button } from './components/Button'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      minWidth: '200px',
      maxHeight: '300px',
      overflow: 'scroll'
    }
  }),
  {
    name: 'Tasks-AssigneeFilter'
  }
)

export function AssigneeFilter() {
  const classes = useStyles()

  return (
    <FilterButton
      renderButton={({ onClick }) => (
        <Button
          title="Assignee"
          startIconPath={mdiAccountArrowLeft}
          isActive={false}
          onClick={onClick}
        />
      )}
      renderDropdown={() => (
        <div className={classes.root}>
          <AssigneesList defaultAssignees={[]} onChange={console.log} />
        </div>
      )}
    />
  )
}
