import { Box, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined'
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined'
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined'
import HotelOutlinedIcon from '@material-ui/icons/HotelOutlined'
import { makeStyles } from '@material-ui/styles'
import cn from 'classnames'

const useStyles = makeStyles(
  () => ({
    badge: {
      borderRadius: '50%',
      width: 25,
      height: 25,
      padding: 2,
      background: '#009B6F',
      color: '#fff',
      textAlign: 'center',
      fontSize: 12,
      marginLeft: 5
    }
  }),
  { name: 'FiltersBadge' }
)

const FilterButton = withStyles(() => ({
  root: {
    padding: 0,
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 4,
    border: '1px solid #e4e4e4',
    marginRight: 10,
    '&.active': {
      borderColor: '#009B6F',
      backgroundColor: '#edfff2',
      color: '#000',
      '&:hover': {
        backgroundColor: '#009B6F'
      }
    },
    '&:hover': {
      backgroundColor: '#e4e4e4'
    }
  },
  label: {
    padding: '6px 15px',
    fontSize: 16,
    textTransform: 'Capitalize',
    fontWeight: 'normal',
    '& svg': {
      marginRight: 5,
      height: 30
    }
  }
}))(Button)

const SaveSearchButton = withStyles(() => ({
  root: {
    backgroundColor: '#009B6F',
    '&:hover': {
      backgroundColor: '#000'
    }
  },
  label: {
    color: '#fff'
  }
}))(FilterButton)

const ResetButton = withStyles(() => ({
  root: {
    border: 'none'
  }
}))(FilterButton)

export const Filters = () => {
  const classes = useStyles()

  return (
    <Box>
      <FilterButton
        className={cn({
          active: true
        })}
      >
        <FiberManualRecordOutlinedIcon fontSize="small" />
        For Sale
      </FilterButton>
      <FilterButton
        className={cn({
          active: true
        })}
      >
        <AttachMoneyOutlinedIcon fontSize="small" />
        Any Price
        <Box className={classes.badge}>2</Box>
      </FilterButton>
      <FilterButton>
        <HotelOutlinedIcon fontSize="small" />
      </FilterButton>
      <FilterButton>
        <BathtubOutlinedIcon fontSize="small" />
      </FilterButton>
      <FilterButton>
        <AddIcon fontSize="small" />
        More
      </FilterButton>
      <ResetButton>Reset All</ResetButton>

      <SaveSearchButton>Save Search</SaveSearchButton>
    </Box>
  )
}
