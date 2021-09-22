import { useState, ReactNode } from 'react'

import {
  Button,
  ButtonProps,
  Typography,
  CircularProgress,
  Theme,
  makeStyles
} from '@material-ui/core'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

import Search from '@app/views/components/Grid/Search'
import Drawer, { OverlayDrawerProps } from '@app/views/components/OverlayDrawer'
import TreeView from '@app/views/components/TreeView'
import { selectUser } from 'selectors/user'

import { useTeam } from './hooks/use-team'

const getNodeId = (team: IBrand) => team.id

const useStyles = makeStyles(
  (theme: Theme) => ({
    searchContainer: {
      margin: theme.spacing(2, 0)
    },
    team: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
    },
    loading: {
      textAlign: 'center',
      marginTop: theme.spacing(3)
    },
    nodeName: {
      padding: theme.spacing(1, 0)
    }
  }),
  { name: 'BrandSelectorDrawer' }
)

export type NodeRenderer = { brand: IBrand; onClose: () => void }
export type ButtonRenderer = { onOpen: () => void }

interface Props {
  nodeRenderer?: (props: NodeRenderer) => ReactNode
  defaultButtonProps?: Omit<ButtonProps, 'onClick'>
  drawerProps?: Omit<OverlayDrawerProps, 'open' | 'onClose'>
  buttonRenderer?: (props: ButtonRenderer) => ReactNode
}

export function BrandSelectorDrawer({
  defaultButtonProps = {},
  drawerProps = {},
  buttonRenderer,
  nodeRenderer
}: Props) {
  const user = useSelector(selectUser)
  const classes = useStyles()

  const [query, setQuery] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { error, loading, initialExpandedNodes, getChildNodes } = useTeam(
    user,
    query
  )

  const hanldeOpenDrawer = () => setIsOpen(true)
  const hanldeCloseDrawer = () => {
    if (query) {
      setQuery('')
    }

    setIsOpen(false)
  }

  const debouncedSetQuery = debounce(setQuery, 400)

  const renderButton = () => {
    if (buttonRenderer) {
      return buttonRenderer({ onOpen: hanldeOpenDrawer })
    }

    return (
      <Button {...defaultButtonProps} onClick={hanldeOpenDrawer}>
        Our Agents
      </Button>
    )
  }

  const renderNode = (brand: IBrand) => {
    if (!nodeRenderer) {
      return (
        <div className={classes.nodeName}>
          <Typography variant="body2">{brand.name}</Typography>
        </div>
      )
    }

    return nodeRenderer({ brand, onClose: hanldeCloseDrawer })
  }

  const renderTreeView = () => {
    if (loading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )
    }

    if (error) {
      return (
        <Typography variant="body1" color="textSecondary">
          Somthing Went Wrong!
        </Typography>
      )
    }

    return (
      <TreeView
        selectable
        getChildNodes={getChildNodes}
        initialExpandedNodes={initialExpandedNodes}
        getNodeId={getNodeId}
        renderNode={renderNode}
      />
    )
  }

  return (
    <>
      {renderButton()}
      <Drawer {...drawerProps} open={isOpen} onClose={hanldeCloseDrawer}>
        <Drawer.Header title="Select Agents" />
        <Drawer.Body>
          <div className={classes.searchContainer}>
            <Search
              placeholder="Search for teams and agents"
              onChange={value => debouncedSetQuery(value)}
            />
          </div>

          {renderTreeView()}
        </Drawer.Body>
      </Drawer>
    </>
  )
}
