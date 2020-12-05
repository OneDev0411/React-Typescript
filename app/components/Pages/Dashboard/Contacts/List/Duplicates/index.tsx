import React, { useState, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'components/notification'
import {
  Button,
  Typography,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import pluralize from 'pluralize'

import { DuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts/types'
import { getDuplicateContacts } from 'models/contacts/get-duplicate-contacts'
import { mergeContact } from 'models/contacts/merge-contact'
import { mergeContactsAll } from 'models/contacts/merge-contacts-all'
import { dismissAllMergeClusters } from 'models/contacts/dismiss-all-merge-clusters'
import { dismissMergeCluster } from 'models/contacts/dismiss-merge-cluster'
import { dismissMergeContact } from 'models/contacts/dismiss-merge-contact'

import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import DuplicateContactsList from 'components/DuplicateContacts/DuplicateContactsList'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import HeaderOptions from './HeaderOptions'
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
  const confirmation = useContext(ConfirmationModalContext)
  const [isLoading, setIsLoading] = useState(true)
  const [clusters, setClusters] = useState<ClusterWithMaster[]>([])

  useEffect(() => {
    async function fetchDuplicates() {
      setIsLoading(true)

      const duplicates = await getDuplicateContacts()

      setClusters(
        duplicates.data.map(item => ({
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

  const removeCluster = (clusterId: number) => {
    setClusters(clusters.filter(item => item.duplicates.id !== clusterId))
  }

  const removeContactFromCluster = (clusterId: number, contactId: UUID) => {
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

  const notifyUnsuccessfulDismiss = () => {
    dispatch(
      addNotification({
        status: 'error',
        message:
          'Something went wrong while dismissing duplicate contacts. Please try again.'
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

    confirmation.setConfirmationModal({
      message: 'Are you sure about dismissing this contact?',
      onConfirm: async () => {
        try {
          await dismissMergeContact(clusterId, contactId)
          removeContactFromCluster(clusterId, contactId)
        } catch (err) {
          notifyUnsuccessfulDismiss()
          console.error(err)
        }
      }
    })
  }

  const handleDismissClusterClick = (clusterId: number) => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about dismissing this duplicate contacts list?',
      onConfirm: async () => {
        setIsLoading(true)

        try {
          await dismissMergeCluster(clusterId)
          removeCluster(clusterId)
          dispatch(
            addNotification({
              status: 'success',
              message: 'Duplicate contacts list dismissed successfully.'
            })
          )
        } catch (err) {
          notifyUnsuccessfulDismiss()
          console.error(err)
        }

        setIsLoading(false)
      }
    })
  }

  const handleMergeClusterClick = (clusterId: number) => {
    const selectedCluster = clusters.find(
      item => item.duplicates.id === clusterId
    )

    if (!selectedCluster) {
      return
    }

    confirmation.setConfirmationModal({
      message: 'Are you sure about merging this duplicate contacts list?',
      onConfirm: async () => {
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
    })
  }

  const handleMergeAllClustersClick = async () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about merging all duplicate contacts lists?',
      onConfirm: async () => {
        setIsLoading(true)

        try {
          await mergeContactsAll()
          setClusters([])
          dispatch(
            addNotification({
              status: 'success',
              message:
                'All duplicate contacts lists will be merged. It may take a few minutes.'
            })
          )
        } catch (err) {
          notifyUnsuccessfulMerge()
          console.error(err)
        }

        setIsLoading(false)
      }
    })
  }

  const handleDismissAllClustersClick = async () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about dismissing all duplicate contacts lists?',
      onConfirm: async () => {
        setIsLoading(true)

        try {
          await dismissAllMergeClusters()
          dispatch(
            addNotification({
              status: 'success',
              message:
                'All duplicate contacts lists will be dismissed. It may take a few minutes.'
            })
          )
          setClusters([])
        } catch (err) {
          notifyUnsuccessfulDismiss()
          console.error(err)
        }

        setIsLoading(false)
      }
    })
  }
  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingContainer
          style={{
            height: 'calc(100vh - 6em)'
          }}
        />
      )
    }

    if (clusters.length === 0) {
      return <ZeroState />
    }

    return clusters.map(cluster => {
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
    })
  }

  return (
    <PageLayout>
      <PageLayout.Header title="Duplicate Contacts">
        <HeaderOptions
          listsLength={clusters.length}
          onDismissAllClick={handleDismissAllClustersClick}
          onMergeAllClick={handleMergeAllClustersClick}
        />
      </PageLayout.Header>
      <PageLayout.Main>{renderContent()}</PageLayout.Main>
    </PageLayout>
  )
}
