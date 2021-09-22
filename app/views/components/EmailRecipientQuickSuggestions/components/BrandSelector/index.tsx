import { useState } from 'react'

import {
  Button,
  Typography,
  CircularProgress,
  Theme,
  makeStyles
} from '@material-ui/core'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

import Search from '@app/views/components/Grid/Search'
import Drawer from '@app/views/components/OverlayDrawer'
import TreeView from '@app/views/components/TreeView'
import { selectUser } from 'selectors/user'

import { Brand } from './components/Brand'
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
    }
  }),
  { name: 'BrandSelector' }
)

interface Props {
  currentRecipients?: IDenormalizedEmailRecipientInput[]
  onSelect: (
    recipient: IDenormalizedEmailRecipientInput,
    sendType: IEmailRecipientSendType | undefined
  ) => void
}

export function BrandSelector({ onSelect, currentRecipients = [] }: Props) {
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

  const handleOnClickBrand = (brand: IBrand) => {
    const recipient: IDenormalizedEmailRecipientBrandInput = {
      recipient_type: 'Brand',
      brand
    }

    onSelect(recipient, 'BCC')
    hanldeCloseDrawer()
  }

  const renderNode = (brand: IBrand) => {
    return (
      <Brand
        brand={brand}
        currentRecipients={currentRecipients}
        onClick={handleOnClickBrand}
      />
    )
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
      <Button size="small" onClick={hanldeOpenDrawer}>
        Our Agents
      </Button>
      {/*
        I set the drawer width to the 43rem manually bacause in our email drawer we set this
        value and base on shayan request we want the brand selector drawer cover the email drawer
      */}
      <Drawer open={isOpen} onClose={hanldeCloseDrawer} width="43rem">
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
