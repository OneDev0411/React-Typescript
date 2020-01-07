import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'
import {
  Button,
  Typography,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import pluralize from 'pluralize'

import { DuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts'
import { getDuplicateContacts } from 'models/contacts/get-duplicate-contacts'
import { mergeContact } from 'models/contacts/merge-contact'
import { mergeContactsBatch } from 'models/contacts/merge-contacts-batch'

import LoadingContainer from 'components/LoadingContainer'
import DuplicateContactsList from 'components/DuplicateContacts/DuplicateContactsList'

import { Container } from '../styled'

import Header from './Header'
import ZeroState from './ZeroState'

interface ClusterWithMaster {
  masterId: UUID
  duplicates: DuplicateContacts
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    clusterWrapper: {
      margin: theme.spacing(2, 0),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    clusterHeader: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(1, 2),
      background: theme.palette.action.hover
    },
    clusterHeaderActions: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    dismissButton: {
      margin: theme.spacing(0, 1)
    }
  })
)

interface Props {
  isSideMenuOpen: boolean
  onSideMenuTriggerClick: () => void
}

export default function Duplicates({
  isSideMenuOpen,
  onSideMenuTriggerClick
}: Props) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(true)
  const [clusters, setClusters] = useState<ClusterWithMaster[]>([])

  useEffect(() => {
    async function fetchDuplicates() {
      setIsLoading(true)

      const duplicates = await getDuplicateContacts()

      setClusters(
        duplicates.map(item => ({
          masterId: item.contacts[0]!.id,
          duplicates: item
        }))
      )

      setIsLoading(false)
    }

    fetchDuplicates()
  }, [])

  const getCluster = (clusterId: number) => {
    return clusters.find(item => item.duplicates.id === clusterId)
  }

  const getClusterMasterContact = (clusterId: number) => {
    const cluster = getCluster(clusterId)

    if (!cluster) {
      return null
    }

    const clusterMaster = cluster.duplicates.contacts.find(
      contact => contact.id === cluster.masterId
    )

    if (!clusterMaster) {
      return null
    }

    return clusterMaster
  }

  const getClusterContactsLength = (clusterId: number) => {
    const cluster = getCluster(clusterId)

    if (!cluster) {
      return 0
    }

    return cluster.duplicates.contacts.length
  }

  const getClusterHeader = (clusterId: number) => {
    const master = getClusterMasterContact(clusterId)

    if (!master) {
      return ''
    }

    const masterTitle =
      master.display_name || master.email || master.phone_number

    const clusterLengthWithoutMaster = getClusterContactsLength(clusterId) - 1
    const possiblePluralizedContactWord = pluralize(
      'contact',
      clusterLengthWithoutMaster
    )

    return `${masterTitle} and ${clusterLengthWithoutMaster} other ${possiblePluralizedContactWord}`
  }

  const notifyUnsuccessfulMerge = () => {
    dispatch(
      addNotification({
        status: 'error',
        message:
          'Something went wrong while merging the contacts. Please try again.'
      })
    )
  }

  const handleSetMasterIdClick = (clusterId: number, masterId: UUID) => {
    setClusters(
      clusters.map(item => {
        if (item.duplicates.id === clusterId) {
          return {
            duplicates: item.duplicates,
            masterId
          }
        }

        return item
      })
    )
  }

  const handleDismissContactClick = (clusterId: number, contactId: UUID) => {
    const cluster = getCluster(clusterId)

    if (!cluster) {
      return
    }

    // Minimum number of contacts to merge is 2
    if (cluster.duplicates.contacts.length === 2) {
      dispatch(
        addNotification({
          status: 'warning',
          message: 'You need to have at least 2 contacts to merge.'
        })
      )

      return
    }

    setClusters(
      clusters.map(item => {
        if (item.duplicates.id === clusterId) {
          return {
            ...item,
            duplicates: {
              ...item.duplicates,
              contacts: item.duplicates.contacts.filter(
                contact => contact.id !== contactId
              )
            }
          }
        }

        return item
      })
    )
  }

  const removeCluster = (clusterId: number) => {
    setClusters(clusters.filter(item => item.duplicates.id !== clusterId))
  }

  const handleDismissClusterClick = (clusterId: number) => {
    removeCluster(clusterId)
  }

  const handleMergeClusterClick = async (clusterId: number) => {
    const selectedCluster = clusters.find(
      item => item.duplicates.id === clusterId
    )

    if (!selectedCluster) {
      return
    }

    setIsLoading(true)

    try {
      const masterId = selectedCluster.masterId
      const contactIds = selectedCluster.duplicates.contacts.map(
        contact => contact.id
      )

      await mergeContact(masterId, contactIds)
      removeCluster(clusterId)
      dispatch(
        addNotification({
          status: 'success',
          message: `${contactIds.length} contacts merged successfully.`
        })
      )
    } catch (err) {
      notifyUnsuccessfulMerge()
      console.error(err)
    }

    setIsLoading(false)
  }

  const handleMergeAllClustersClick = async () => {
    setIsLoading(true)

    try {
      const normalizedClusters = clusters.map(item => {
        return {
          parent: item.masterId,
          sub_contacts: item.duplicates.contacts
            .map(contact => contact.id)
            .filter(id => id !== item.masterId)
        }
      })

      await mergeContactsBatch(normalizedClusters)
      dispatch(
        addNotification({
          status: 'success',
          message: `${pluralize(
            'contacts list',
            clusters.length,
            true
          )} will be merged. It may take a few minutes.`
        })
      )
    } catch (err) {
      notifyUnsuccessfulMerge()
      console.error(err)
    }

    setIsLoading(false)
  }

  const renderHeader = () => {
    return (
      <Header
        listsLength={clusters.length}
        isSideMenuOpen={isSideMenuOpen}
        onSideMenuTriggerClick={onSideMenuTriggerClick}
        onMergeAllClick={handleMergeAllClustersClick}
      />
    )
  }

  if (isLoading) {
    return (
      <>
        {renderHeader()}
        <Container>
          <LoadingContainer
            style={{
              height: 'calc(100vh - 6em)'
            }}
          />
        </Container>
      </>
    )
  }

  if (clusters.length === 0) {
    return (
      <>
        {renderHeader()}
        <Container>
          <ZeroState />
        </Container>
      </>
    )
  }

  return (
    <>
      {renderHeader()}
      <Container>
        {clusters.map(cluster => {
          const clusterId = cluster.duplicates.id
          const clusterHeader = getClusterHeader(clusterId)

          return (
            <div
              key={`${clusterId}-master-${cluster.masterId}`}
              className={classes.clusterWrapper}
            >
              <div className={classes.clusterHeader}>
                <div>
                  <Typography variant="body1">{clusterHeader}</Typography>
                </div>
                <div className={classes.clusterHeaderActions}>
                  <Button
                    variant="text"
                    color="secondary"
                    className={classes.dismissButton}
                    onClick={() => handleDismissClusterClick(clusterId)}
                  >
                    Dismiss
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleMergeClusterClick(clusterId)}
                  >
                    Merge
                  </Button>
                </div>
              </div>
              <DuplicateContactsList
                key={clusterId}
                contacts={cluster.duplicates.contacts}
                masterId={cluster.masterId}
                onDismissClick={contactId =>
                  handleDismissContactClick(clusterId, contactId)
                }
                onSetMasterClick={masterId =>
                  handleSetMasterIdClick(clusterId, masterId)
                }
              />
            </div>
          )
        })}
      </Container>
    </>
  )
}
