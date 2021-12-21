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
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import {
  createSortString,
  sortOptions,
  SORT_FIELD_DEFAULT
} from '@app/components/Pages/Dashboard/MLS/helpers/sort-utils'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { SortIndex, SortString } from '../../../types'

const useStyles = makeStyles(
  theme => ({
    button: {
      paddingRight: theme.spacing(2.5),
      paddingLeft: theme.spacing(2.5),
      marginLeft: theme.spacing(0.5)
    },
    menu: {
      zIndex: theme.zIndex.modal - 1,
      '& ul:focus': {
        outline: 'none'
      }
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
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        endIcon={
          activeSort.ascending ? (
            <SvgIcon size={muiIconSizes.small} path={mdiArrowUp} />
          ) : (
            <SvgIcon size={muiIconSizes.small} path={mdiArrowDown} />
          )
        }
      >
        {sortOptions[activeSort.index]}
      </Button>
      <Popper
        className={classes.menu}
        open={open}
        anchorEl={anchorRef.current}
        transition
        placement="bottom-end"
        modifiers={{
          flip: {
            enabled: false
          },
          hide: {
            enabled: false
          },
          preventOverflow: {
            enabled: false
          }
        }}
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
