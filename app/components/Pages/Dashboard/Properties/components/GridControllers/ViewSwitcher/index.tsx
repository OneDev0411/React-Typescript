import { makeStyles } from '@material-ui/core'
import ListRoundedIcon from '@material-ui/icons/ListRounded'
import ViewModuleRoundedIcon from '@material-ui/icons/ViewModuleRounded'
import ToggleButton from '@material-ui/lab/ToggleButton'

import { ViewType } from '../../../ExploreTab/components/ExplorePage'

const useStyles = makeStyles(
  theme => ({
    toggleViewButton: {
      margin: theme.spacing(0, 0.5),
      '&.Mui-selected': {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        backgroundColor: 'unset'
      }
    }
  }),
  { name: 'PropertiesViewSwitcher' }
)

interface Props {
  viewType: ViewType
  onToggleView: (to: ViewType) => void
}

const ViewSwitcher = ({ onToggleView, viewType }: Props) => {
  const classes = useStyles()

  return (
    <>
      <ToggleButton
        className={classes.toggleViewButton}
        value="check"
        color="primary"
        selected={viewType === 'cards'}
        onChange={() => {
          onToggleView('cards')
        }}
      >
        <ViewModuleRoundedIcon />
      </ToggleButton>
      <ToggleButton
        className={classes.toggleViewButton}
        value="check"
        color="primary"
        selected={viewType === 'table'}
        onChange={() => {
          onToggleView('table')
        }}
      >
        <ListRoundedIcon />
      </ToggleButton>
    </>
  )
}

export default ViewSwitcher
