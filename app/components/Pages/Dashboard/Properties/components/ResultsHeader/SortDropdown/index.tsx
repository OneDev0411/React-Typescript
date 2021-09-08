import React from 'react'

import {
  Button,
  Popper,
  ClickAwayListener,
  Paper,
  ButtonGroup,
  Divider,
  makeStyles,
  MenuItem,
  MenuList
} from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import {
  createSortString,
  sortOptions,
  SortIndex,
  SortString,
  SORT_FIELD_DEFAULT
} from '@app/components/Pages/Dashboard/Properties/helpers/sort-utils'

const useStyles = makeStyles(
  theme => ({
    button: {
      marginLeft: theme.spacing(0.5)
    },
    menu: {
      zIndex: theme.zIndex.modal
    },
    sortedBy: {
      color: theme.palette.grey[600],
      marginRight: theme.spacing(0.5)
    },
    buttonGroup: {
      margin: theme.spacing(2)
    },
    footer: {
      margin: theme.spacing(1, 2, 0)
    },
    menuItemSelected: {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: theme.palette.primary.contrastText
    }
  }),
  { name: 'ListingsSortDropdown' }
)

interface Props {
  onChangeSort: (sort: SortString) => void
  activeSort: { index: SortIndex; ascending: boolean }
}

export function SortDropdown({ onChangeSort, activeSort }: Props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<Nullable<HTMLButtonElement>>(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const onChangeIndex = (event, option: SortIndex) => {
    handleClose(event)
    onChangeSort(createSortString(option, activeSort.ascending))
  }

  const onChangeAscending = (ascending: boolean) => {
    onChangeSort(createSortString(activeSort.index, ascending))
  }

  /* Reset sort item if current active selected item is removed.
   * `Distance` option was removed from the dropdown menu on MLS v2
   *  https://gitlab.com/rechat/web/-/issues/5472
   */
  useEffectOnce(() => {
    if (!sortOptions[activeSort.index]) {
      onChangeSort(SORT_FIELD_DEFAULT)
    }
  })

  return (
    <>
      <Button
        className={classes.button}
        variant="outlined"
        size="small"
        color="primary"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        endIcon={
          activeSort.ascending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
        }
      >
        <span className={classes.sortedBy}>Sorted by: </span>
        <span>{sortOptions[activeSort.index]}</span>
      </Button>
      <Popper
        className={classes.menu}
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        placement="bottom-end"
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList>
              <ButtonGroup
                className={classes.buttonGroup}
                size="large"
                aria-label="ascending"
              >
                <Button
                  color={activeSort.ascending ? 'primary' : 'default'}
                  variant={activeSort.ascending ? 'contained' : 'outlined'}
                  onClick={() => onChangeAscending(true)}
                >
                  Ascending
                </Button>
                <Button
                  color={!activeSort.ascending ? 'primary' : 'default'}
                  variant={!activeSort.ascending ? 'contained' : 'outlined'}
                  onClick={() => onChangeAscending(false)}
                >
                  Descending
                </Button>
              </ButtonGroup>
              <Divider />
              {Object.keys(sortOptions).map((option: SortIndex) => (
                <MenuItem
                  classes={{
                    selected: classes.menuItemSelected
                  }}
                  selected={activeSort.index === option}
                  key={option}
                  onClick={e => onChangeIndex(e, option)}
                >
                  {sortOptions[option]}
                </MenuItem>
              ))}
              {/* <Divider /> */}
              {/* TODO: When https://gitlab.com/rechat/server/-/issues/1828 is resolved, 
                this checkbox will become actionable */}
              {/* <Grid className={classes.footer}>
                <FormControlLabel
                  disabled
                  control={<Checkbox name="agentOwnListings" />}
                  label="Our listings first"
                />
              </Grid> */}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  )
}
