import { useMemo, useState } from 'react'

import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  Popover,
  Theme
} from '@material-ui/core'
import { useDispatch, batch } from 'react-redux'

import { resetActiveFilters } from 'actions/filter-segments/active-filters'
import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'
import { DropdownToggleButton } from 'components/DropdownToggleButton'

import { CONTACTS_SEGMENT_NAME } from '../../constants'
import SavedSegments from '../SavedSegments/List'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: { marginBottom: theme.spacing(2) },
    list: {
      width: 250
    },
    listSubheader: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.h6.fontWeight,
      color: theme.palette.tertiary.light
    }
  }),
  { name: 'ContactsSegments' }
)

export interface Props {
  activeSegment: any
  tagListProps: {
    onClick: (props: unknown) => void
    isActive: boolean
  }
  savedListProps: {
    name: string
    associations: string
    getPredefinedLists: () => void
    onChange: (segment: unknown) => void
  }
  handleResetShortcutFilter: () => void
  handleFilterChange: (newFilters: object, resetLoadedRanges: boolean) => void
}
export const ContactsSegments = ({
  activeSegment,
  savedListProps,
  handleFilterChange,
  handleResetShortcutFilter
}: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const isOpen = Boolean(anchorEl)
  const handleToggleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (anchorEl) {
      setAnchorEl(null)

      return
    }

    event && setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const isAllContactsActive = useMemo(() => {
    return !activeSegment || activeSegment.id === 'default'
  }, [activeSegment])

  const buttonText = isAllContactsActive
    ? 'All Contacts'
    : `List: ${activeSegment.name}`

  const handleSelect = async (type: string) => {
    batch(() => {
      dispatch(resetActiveFilters(CONTACTS_SEGMENT_NAME))
      dispatch(changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, type))
    })

    handleFilterChange({ filters: [], flows: [] }, true)
    handleResetShortcutFilter()
  }

  return (
    <div className={classes.root}>
      <DropdownToggleButton
        variant="outlined"
        color="default"
        isActive={isOpen}
        onClick={handleToggleMenu}
      >
        {buttonText}
      </DropdownToggleButton>
      <Popover
        id={isOpen ? 'contacts-segments-popover' : undefined}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <List disablePadding className={classes.list}>
          <ListItem
            button
            selected={isAllContactsActive}
            onClick={() => {
              handleSelect('default')
              handleCloseMenu()
            }}
          >
            <ListItemText>All Contacts</ListItemText>
          </ListItem>
          <Divider />
          <ListSubheader className={classes.listSubheader} disableSticky>
            Lists
          </ListSubheader>
          <SavedSegments onClose={handleCloseMenu} {...savedListProps} />
        </List>
      </Popover>
    </div>
  )
}

export default ContactsSegments
