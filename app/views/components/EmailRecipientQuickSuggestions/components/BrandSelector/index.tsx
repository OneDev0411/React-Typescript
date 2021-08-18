import React, { useState, useCallback } from 'react'

import { Button, Typography, Theme, makeStyles } from '@material-ui/core'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// import useNotify from '@app/hooks/use-notify'
import Search from 'components/Grid/Search'
import Drawer from 'components/OverlayDrawer'
import TreeView from 'components/TreeView'
import Loading from 'partials/Loading'
import { selectUser } from 'selectors/user'

import { areRecipientsEqual } from '../../helpers/are-recipients-equal'

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
  /**
   * Callback to be called when a quick suggestion in selected.
   * The selected suggestion may have a forced
   * {@link IEmailRecipientSendType send type}. Right now the type is
   * forced to `Bcc` for some suggestions like "All contacts" and "All Agents"
   * @param recipient: the recipient associated with this quick suggestion
   * @param sendType: the {@link IEmailRecipientSendType send type} associated
   * with this suggestion. It can be undefined and in this case, the recipient
   * is to be added to the currently (or lastly) focused input.
   */
  onSelect: (
    recipient: IDenormalizedEmailRecipientInput,
    sendType: IEmailRecipientSendType | undefined
  ) => void
}

export function BrandSelector({ onSelect, currentRecipients = [] }: Props) {
  const user = useSelector(selectUser)
  const classes = useStyles()
  // const notify = useNotify()

  const [searchKey, setSearchKey] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { error, loading, initialExpandedNodes, getChildNodes } = useTeam(
    user,
    searchKey
  )

  // console.log({ error, loading, rootTeam, initialExpandedNodes, getChildNodes })
  const hanldeOpenDrawer = () => setIsOpen(true)
  const hanldeCloseDrawer = () => {
    if (searchKey) {
      setSearchKey('')
    }

    setIsOpen(false)
  }

  const debouncedSetSearchKey = debounce(setSearchKey, 400)

  const handleClickBrand = (brand: IBrand) => {
    const recipient: IDenormalizedEmailRecipientBrandInput = {
      recipient_type: 'Brand',
      brand
    }

    const isUnused =
      !currentRecipients ||
      !currentRecipients.find(areRecipientsEqual(recipient))

    console.log({ brand, currentRecipients, isUnused })

    onSelect(recipient, 'BCC')
    hanldeCloseDrawer()
  }

  const teamRenderer = useCallback((team: IBrand) => {
    // console.log({ team })

    return (
      <div className={classes.team} onClick={() => handleClickBrand(team)}>
        <Typography variant="body2">{team.name}</Typography>
      </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        renderNode={teamRenderer}
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
