import { useState, useEffect, useCallback, useContext } from 'react'

import { makeStyles, Theme, useTheme } from '@material-ui/core'
import { mdiAlertOctagonOutline } from '@mdi/js'
import pluralize from 'pluralize'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'

import { SvgIcon } from '@app/views/components/SvgIcons'
import { Callout } from 'components/Callout'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import DuplicateContactsDrawer from 'components/DuplicateContacts/DuplicateContactsDrawer'
import { addNotification } from 'components/notification'
import { dismissMergeContact } from 'models/contacts/dismiss-merge-contact'
import { getContactDuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts'
import { DuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts/types'
import { mergeContact } from 'models/contacts/merge-contact'

interface Props {
  contact: IContact
  mergeCallback: (contactId: UUID) => Promise<void>
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      borderRadius: theme.spacing(0.5)
    },
    container: {
      padding: theme.spacing(1, 1),
      display: 'flex',
      flexDirection: 'row'
    },
    iconWrapper: {
      height: theme.spacing(2),
      padding: theme.spacing(0, 2, 0, 0)
    },
    icon: {
      color: '#854300'
    },
    content: {
      display: 'flex',
      width: 'fit-content',
      flexDirection: 'column',
      color: '#673400'
    },
    buttonWrapper: {
      marginTop: theme.spacing(1)
    },
    secondaryButton: {
      marginRight: theme.spacing(2),
      fontWeight: 400,
      opacity: 0.7,
      color: '#854300',
      cursor: 'pointer',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
        color: '#854300'
      }
    },
    primaryButton: {
      fontWeight: 400,
      cursor: 'pointer',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none'
      }
    },
    bold: {
      fontFamily: 'LatoBold'
    }
  }),
  {
    name: 'MergeDuplicates'
  }
)

export default function MergeDuplicates({ contact, mergeCallback }: Props) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)
  const [isOpen, setIsOpen] = useState(true)
  const [masterId, setMasterId] = useState(contact.id)
  const [isContactsListDrawerOpen, setIsContactsListDrawerOpen] =
    useState(false)
  const [duplicateContacts, setDuplicateContacts] =
    useState<DuplicateContacts | null>(null)

  const fetchDuplicates = useCallback(async () => {
    try {
      const response = await getContactDuplicateContacts(contact.id)

      setDuplicateContacts(response.data)
    } catch (err) {
      if (err.status === 404) {
        setDuplicateContacts(null)
      }
    }
  }, [contact.id])

  useEffect(() => {
    fetchDuplicates()
  }, [contact.id, fetchDuplicates])

  const handleReviewClick = () => {
    setIsContactsListDrawerOpen(true)
  }

  const handleCloseDrawerClick = async () => {
    setIsContactsListDrawerOpen(false)
  }

  const handleDismissClick = async (
    contactId: UUID,
    checkMinumumDuplicatesCount = true,
    closeOnDismiss = false
  ) => {
    if (!duplicateContacts) {
      return
    }

    // Minimum number of contacts to merge is 2
    if (
      checkMinumumDuplicatesCount &&
      duplicateContacts.contacts.length === 2
    ) {
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
          await dismissMergeContact(duplicateContacts.id, contactId)

          setDuplicateContacts({
            ...duplicateContacts,
            contacts: duplicateContacts.contacts.filter(
              item => item.id !== contactId
            )
          })

          if (closeOnDismiss) {
            setIsOpen(false)
          }
        } catch (err) {
          dispatch(
            addNotification({
              status: 'error',
              message:
                // eslint-disable-next-line max-len
                'Something went wrong while dismissing the contact. Please try again.'
            })
          )
          console.error(err)
        }
      }
    })
  }

  const handleDismissMergeCallout = async (contactId: UUID) => {
    await handleDismissClick(contactId, false, true)
  }

  const handleSetMasterClick = (contactId: UUID) => {
    setMasterId(contactId)
  }

  const handleMergeClick = async () => {
    if (!duplicateContacts) {
      return
    }

    confirmation.setConfirmationModal({
      message: 'Are you sure about merging this duplicate contacts list?',
      onConfirm: async () => {
        try {
          await mergeContact(
            masterId,
            duplicateContacts.contacts.map(item => item.id)
          )
          dispatch(
            addNotification({
              status: 'success',
              // eslint-disable-next-line max-len
              message: `${duplicateContacts.contacts.length} contacts merged successfully.`
            })
          )
          setIsContactsListDrawerOpen(false)
          await mergeCallback(masterId)

          // Refetch the duplicates if we are in the master contact page
          if (masterId === contact.id) {
            fetchDuplicates()
          }
        } catch (err) {
          dispatch(
            addNotification({
              status: 'error',
              message:
                'Something went wrong while merging the contacts. Please try again.'
            })
          )
          console.error(err)
        }
      }
    })
  }

  if (!duplicateContacts || !isOpen) {
    return null
  }

  return (
    <>
      <Callout
        dense
        type="warn"
        closeButtonTooltip="Dismiss"
        style={{ border: '1px solid #F6E1BF' }}
      >
        <div className={classes.container}>
          <div className={classes.iconWrapper}>
            <SvgIcon path={mdiAlertOctagonOutline} className={classes.icon} />
          </div>

          <div className={classes.content}>
            <span style={{ color: theme.palette.warning.contrastText }}>
              We’ve found {duplicateContacts.contacts.length - 1} other{' '}
              {pluralize('contact', duplicateContacts.contacts.length - 1)}{' '}
              similar. Do you want to merge them?
            </span>
            <div className={classes.buttonWrapper}>
              <Link
                className={classes.secondaryButton}
                color="inherit"
                onClick={() => {
                  handleDismissMergeCallout(contact.id)
                }}
                to=""
              >
                Dismiss
              </Link>
              <Link
                to=""
                color="secondary"
                onClick={handleReviewClick}
                className={classes.primaryButton}
              >
                Review
              </Link>
            </div>
          </div>
        </div>
      </Callout>

      {isContactsListDrawerOpen && (
        <DuplicateContactsDrawer
          title="Merge Contacts"
          contacts={duplicateContacts.contacts}
          masterId={masterId}
          onDismissClick={handleDismissClick}
          onSetMasterClick={handleSetMasterClick}
          onMergeClick={handleMergeClick}
          onClose={handleCloseDrawerClick}
        />
      )}
    </>
  )
}
