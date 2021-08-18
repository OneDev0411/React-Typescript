import React, { useState } from 'react'

import { Button, Theme, makeStyles } from '@material-ui/core'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

import Search from 'components/Grid/Search'
import Drawer from 'components/OverlayDrawer'
import TreeView from 'components/TreeView'
import Loading from 'partials/Loading'
import { selectUser } from 'selectors/user'

import { Brand } from './components/Brand'
import { useTeam } from './hooks/use-team'

const getNodeId = (team: IBrand) => team.id

const useStyles = makeStyles(
  (theme: Theme) => ({
    searchContaoner: {
      margin: theme.spacing(2, 0)
    },
    team: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
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

  const [searchKey, setSearchKey] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { error, loading, initialExpandedNodes, getChildNodes } = useTeam(
    user,
    searchKey
  )

  const hanldeOpenDrawer = () => setIsOpen(true)
  const hanldeCloseDrawer = () => {
    if (searchKey) {
      setSearchKey('')
    }

    setIsOpen(false)
  }

  const debouncedSetSearchKey = debounce(setSearchKey, 400)

  const handleOnClickBrand = (brand: IBrand) => {
    const recipient: IDenormalizedEmailRecipientBrandInput = {
      recipient_type: 'Brand',
      brand
    }

    onSelect(recipient, 'BCC')
    hanldeCloseDrawer()
  }

  const renderTreeView = () => {
    if (loading) {
      return <Loading />
    }

    if (error) {
      return <span>Somthing Went Wrong!</span>
    }

    return (
      <TreeView
        getChildNodes={getChildNodes}
        selectable
        initialExpandedNodes={initialExpandedNodes}
        getNodeId={getNodeId}
        renderNode={(brand: IBrand) => (
          <Brand
            brand={brand}
            currentRecipients={currentRecipients}
            onClick={handleOnClickBrand}
          />
        )}
      />
    )
  }

  return (
    <>
      <Button size="small" onClick={hanldeOpenDrawer}>
        More
      </Button>
      <Drawer open={isOpen} onClose={hanldeCloseDrawer}>
        <Drawer.Header title="Select Team" />
        <Drawer.Body>
          <div className={classes.searchContaoner}>
            <Search
              placeholder="Search for teams and agents"
              onChange={value => debouncedSetSearchKey(value)}
            />
          </div>

          {renderTreeView()}
        </Drawer.Body>
      </Drawer>
    </>
  )
}
