import { makeStyles } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { mdiFormatListCheckbox, mdiViewModule } from '@mdi/js'

import { useQueryParam } from '@app/hooks/use-query-param'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ViewType } from '../../../types'

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
  const [, setViewQueryParam, deleteViewQueryParam] = useQueryParam('view')

  return (
    <>
      <ToggleButton
        title="Card view"
        className={classes.toggleViewButton}
        value="check"
        size="small"
        color="primary"
        selected={viewType === 'cards'}
        onChange={() => {
          onToggleView('cards')
          deleteViewQueryParam()
        }}
      >
        <SvgIcon size={muiIconSizes.medium} path={mdiViewModule} />
      </ToggleButton>
      <ToggleButton
        title="Table view"
        className={classes.toggleViewButton}
        value="check"
        color="primary"
        size="small"
        selected={viewType === 'table'}
        onChange={() => {
          onToggleView('table')
          setViewQueryParam('table')
        }}
      >
        <SvgIcon size={muiIconSizes.medium} path={mdiFormatListCheckbox} />
      </ToggleButton>
    </>
  )
}

export default ViewSwitcher
