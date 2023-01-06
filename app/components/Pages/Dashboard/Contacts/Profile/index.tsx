/* TODO: this I've made this component typescript 8 months ago during contact profile redesign
   without any improvement. literally, I just convert js to tsx which we should take care of it in future.
*/
import { useRef, useState, RefObject, useEffect, useCallback } from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { useEffectOnce, useTitle } from 'react-use'

import { useGetGlobalTriggers } from '@app/components/Pages/Dashboard/Account/Triggers/hooks/use-get-global-triggers'
import { useActiveBrand } from '@app/hooks/brand'
import useConfirmation from '@app/hooks/use-confirmation'
import useNotify from '@app/hooks/use-notify'
import { updateContactTouchReminder } from '@app/models/contacts/update-contact-touch-reminder'
import Acl from '@app/views/components/Acl'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import PageLayout from 'components/GlobalPageLayout'
import { deleteContacts } from 'models/contacts/delete-contact'
import { getContact } from 'models/contacts/get-contact'
import { updateContactQuery } from 'models/contacts/helpers/default-query'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { updateContactSelf } from 'models/contacts/update-contact-self'
import { stopFlow } from 'models/flows/stop-flow'
import { isLoadedContactAttrDefs } from 'reducers/contacts/attributeDefs'
import { selectContact } from 'reducers/contacts/list'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { goTo } from 'utils/go-to'
import { viewAs } from 'utils/user-teams'

import Loading from '../../../../Partials/Loading'
import skipEmailThreadChangeEvent from '../../Inbox/helpers/skip-email-thread-change-event'
import { Container } from '../components/Container'

import AddressesSection from './Addresses'
import Assignee from './Assignee'
import AddEvent from './components/AddEvent'
import AddNote from './components/AddNote'
import { ContactInfo } from './ContactInfo'
import { Dates } from './Dates'
import Deals from './Deals'
import Delete from './Delete'
import { Details } from './Details'
import Flows from './Flows'
import { Header } from './Header'
import { LastTouch } from './LastTouch'
import MergeDuplicates from './MergeDuplicates'
import { Owner } from './Owner'
import { Partner } from './Partner'
import { Filters, Tabs } from './Tabs'
import Timeline, { TimelineRef } from './Timeline'

const useStyles = makeStyles(
  (theme: Theme) => ({
    header: {
      padding: theme.spacing(0, 3),
      borderBottom: `1px solid ${theme.palette.action.disabledBackground}`
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 'auto',
      background: theme.palette.grey[100]
    },
    contentContainer: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderTop: 'none',
      width: '100%',
      height: '100%'
    },
    tabContainer: {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(1),
      flex: '1 1',
      display: 'flex',
      flexDirection: 'column'
    },
    tabHeaderContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.action.disabledBackground}`
    },
    timelineContainer: {
      marginTop: theme.spacing(3),
      borderRadius: `${theme.shape.borderRadius}px`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      '&::webkit-scrollbar': {
        display: 'none'
      }
    },
    boxContainer: {
      display: 'flex'
    },
    sidenavContainer: {
      width: '30%',
      minWidth: '350px',
      maxWidth: '450px',
      padding: theme.spacing(2)
    },
    warnContainer: {
      marginBottom: theme.spacing(2),
      color: theme.palette.warning.contrastText,
      ...theme.typography.body2
    }
  }),
  { name: 'ContactProfile' }
)

/*
  Note:
  This component needs many improvements but due to the limit time
  I don't have the chance to handle it, I just convert itto TS
  in hopes of taking care of the other improvements in future
*/

const ContactProfile = ({
  onCloseContact,
  onOpenContact,
  onUpdateContact,
  onDeleteContact,
  cachedContact,
  ...props
}) => {
  useGetGlobalTriggers()

  const notify = useNotify()
  const activeBrand = useActiveBrand()
  const abortControllerRef = useRef<Nullable<AbortController>>(null)
  const classes = useStyles()
  const confirmation = useConfirmation()

  const isCachedContactExists = !!cachedContact

  const [contact, setContact] = useState<Nullable<INormalizedContact>>(
    isCachedContactExists ? normalizeContact(cachedContact) : null
  )
  const [currentContactId, setCurrentContactId] = useState<string | undefined>(
    props.params?.id || props.id
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingOwner, setIsUpdatingOwner] = useState(false)
  const [isDesktopScreen, setIsDesktopScreen] = useState(false)

  const [isLoading, setIsLoading] = useState(
    !isLoadedContactAttrDefs(props?.attributeDefs) || !isCachedContactExists
  )

  const [activeFilter, setActiveFilter] = useState<Filters>(Filters.Upcoming)

  const isModal: boolean = props.isModal

  const goToContacts = useCallback(() => {
    if (isModal && typeof onCloseContact === 'function') {
      onCloseContact()
    } else {
      goTo('/dashboard/contacts')
    }
  }, [isModal, onCloseContact])

  const goToContact = useCallback(
    (masterContactId: UUID) => {
      if (isModal && typeof onOpenContact === 'function') {
        onOpenContact(masterContactId)
      } else {
        goTo(`/dashboard/contacts/${masterContactId}`)
      }
    },
    [isModal, onOpenContact]
  )

  const fetchContact = useCallback(
    async (callback = () => {}, showFullScreenLoading = false) => {
      if (showFullScreenLoading && !isCachedContactExists) {
        setIsLoading(true)
      }

      // To set cached contact after click on next/prev button on modal
      if (isCachedContactExists && isModal) {
        setContact(normalizeContact(cachedContact))
        timelineRef.current?.refresh()
      }

      try {
        // To prevent race condition
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
          abortControllerRef.current = null
        }

        abortControllerRef.current = new AbortController()

        const response = await getContact(
          props.params?.id || props.id,
          {
            associations: [
              ...updateContactQuery.associations,
              'flow_step.email',
              'contact.triggers',
              'trigger.campaign',
              'flow_step.crm_task',
              'email_campaign.from',
              'email_campaign.template',
              'template_instance.template',
              'contact.assignees',
              'contact_role.user',
              'contact_role.brand'
            ]
          },
          abortControllerRef.current.signal
        )
        const normalizedContact = normalizeContact(response.data)

        setContact(normalizedContact)

        setIsLoading(false)

        if (
          !showFullScreenLoading &&
          isModal &&
          typeof onUpdateContact === 'function'
        ) {
          onUpdateContact(normalizedContact)
        }

        callback()
      } catch (error) {
        if (error.status === 404 || error.status === 400) {
          goToContacts()
        }
      }
    },
    [
      isCachedContactExists,
      isModal,
      cachedContact,
      props.params?.id,
      props.id,
      onUpdateContact,
      goToContacts
    ]
  )

  const handleOnTouchChange = useCallback(async () => {
    try {
      const response = await getContact(
        props.params?.id || props.id,
        updateContactQuery
      )

      const normalizedContact = normalizeContact(response.data)

      setContact(normalizedContact)

      if (isModal && typeof onUpdateContact === 'function') {
        onUpdateContact(normalizedContact)
      }
    } catch (error) {
      console.error(error)
    }
  }, [isModal, onUpdateContact, props.id, props.params?.id])

  const handleDelete = async () => {
    try {
      if (contact) {
        setIsDeleting(true)

        await deleteContacts([contact?.id])

        if (isModal && typeof onDeleteContact === 'function') {
          onDeleteContact(contact.id)
        }

        goToContacts()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const initializeContact = useCallback(
    (showFullScreenLoading = false) => {
      fetchContact(() => {
        if (props.fetchTags) {
          props.getContactsTags()
        }
      }, showFullScreenLoading)
    },
    [fetchContact, props]
  )

  const setNewContact = (
    newContact: INormalizedContact,
    fallback?: () => void
  ) => {
    setContact({ ...contact, ...newContact })

    if (isModal && typeof onUpdateContact === 'function') {
      onUpdateContact({ ...contact, ...newContact })
    }

    if (fallback) {
      fallback()
    }
  }

  const handleUpdateTouchFreq = (newVal: Nullable<number>) => {
    if (!contact) {
      return
    }

    const oldValue = contact.touch_freq || null

    // optimistic update
    setContact((prevContact: INormalizedContact) => ({
      ...prevContact,
      touch_freq: newVal
    }))

    if (isModal && typeof onUpdateContact === 'function') {
      onUpdateContact({ ...contact, touch_freq: newVal })
    }

    fetchTimeline()

    updateContactTouchReminder(contact.id, newVal).catch(e => {
      console.log(e)
      notify({
        status: 'error',
        message: 'Something went wrong. Please try again or contact support.'
      })
      // revert optimistic update if error
      setContact((prevContact: INormalizedContact) => ({
        ...prevContact,
        touch_freq: oldValue
      }))

      if (isModal && typeof onUpdateContact === 'function') {
        onUpdateContact({ ...contact, touch_freq: oldValue })
      }
    })
  }

  const handleCreateNote = (contact: INormalizedContact) => {
    setNewContact(contact)

    if (activeFilter !== Filters.Notes) {
      setActiveFilter(Filters.Notes)
    }
  }

  const detectScreenSize = useCallback(() => {
    if (window.innerWidth < 1681 && isDesktopScreen) {
      setIsDesktopScreen(false)
    }

    if (window.innerWidth >= 1681 && !isDesktopScreen) {
      setIsDesktopScreen(true)
    }
  }, [isDesktopScreen])

  // creates a ref to the timeline
  const timelineRef: RefObject<TimelineRef> = useRef(null)
  /**
   * refreshes timeline
   */
  const fetchTimeline = useCallback(() => {
    if (!timelineRef.current?.refresh) {
      return
    }

    console.log('[ + ] Fetching Timeline')

    return setTimeout(timelineRef.current.refresh, 500)
  }, [timelineRef])

  const handleEmailThreadChangeEvent = useCallback(
    event => {
      if (
        !timelineRef ||
        skipEmailThreadChangeEvent(event, props.allConnectedAccounts)
      ) {
        return
      }

      timelineRef.current?.refresh()
    },
    [props.allConnectedAccounts, timelineRef]
  )

  /**
   * Web page (document) title
   * @returns {String} Title
   */
  const documentTitle = () => {
    const title = contact?.display_name || ''

    return title ? `${title} | Contacts | Rechat` : 'Contact | Rechat'
  }

  useTitle(documentTitle())

  const onChangeOwner = async item => {
    if (!contact) {
      return
    }

    setIsUpdatingOwner(true)

    try {
      const response = await updateContactSelf(contact.id, {
        // @ts-ignore
        user: item.value.id
      })
      const alteredContact = response.data || {}

      setContact({ ...contact, ...alteredContact })

      if (isModal && typeof onUpdateContact === 'function') {
        onUpdateContact({ ...contact, ...alteredContact })
      }

      setIsUpdatingOwner(false)
    } catch (error) {
      console.log(error)
      setIsUpdatingOwner(false)
    }
  }

  const handleStopFlow = async id => {
    try {
      confirmation.setConfirmationModal({
        confirmLabel: 'Stop Flow',
        message: 'Are you sure you want to stop this flow?',
        description:
          'All future events and scheduled emails that created by this flow will be deleted.',
        onConfirm: async () => {
          await stopFlow(id)
          fetchContact()
          fetchTimeline()
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const addToFlowCallback = () => {
    fetchContact()
    fetchTimeline()
  }

  const mergeCallback = async masterContactId => {
    if (masterContactId === contact?.id) {
      await fetchContact()
      fetchTimeline()

      return
    }

    goToContact(masterContactId)
  }

  const handleChangeFilter = (value: Filters) => {
    setActiveFilter(value)
  }

  const updateAttributeSubmitCallback = (
    contact: INormalizedContact,
    updatedAttribute?: IContactAttributeDef
  ) => {
    setNewContact(contact)

    if (updatedAttribute?.data_type === 'date') {
      fetchTimeline()
    }
  }

  const onTouchChange = useCallback(
    ({ contacts }) => {
      if (Array.isArray(contacts) && contacts.includes(currentContactId)) {
        console.log('[ Socket ] Touch Changed')
        handleOnTouchChange()
      }
    },
    [currentContactId, handleOnTouchChange]
  )

  useEffectOnce(() => {
    detectScreenSize()
    initializeContact(true)

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  })

  useEffect(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    const contactId = props.params?.id || props.id

    if (contactId !== currentContactId) {
      setCurrentContactId(contactId)
      initializeContact(true)
    }

    window.addEventListener('resize', detectScreenSize)
    socket?.on('contact:touch', onTouchChange)
    socket?.on('crm_task:create', fetchTimeline)
    socket?.on('crm_task:delete', fetchTimeline)
    socket?.on('email_campaign:create', fetchTimeline)
    socket?.on('email_campaign:send', fetchTimeline)
    socket?.on('email_thread:update', handleEmailThreadChangeEvent)
    socket?.on('email_thread:delete', handleEmailThreadChangeEvent)

    return () => {
      window.removeEventListener('resize', detectScreenSize)
      socket?.off('contact:touch', onTouchChange)
      socket?.off('crm_task:create', fetchTimeline)
      socket?.off('crm_task:delete', fetchTimeline)
      socket?.off('email_campaign:create', fetchTimeline)
      socket?.off('email_campaign:send', fetchTimeline)
      socket?.off('email_thread:update', handleEmailThreadChangeEvent)
      socket?.off('email_thread:delete', handleEmailThreadChangeEvent)
    }
  }, [
    props.params?.id,
    currentContactId,
    detectScreenSize,
    fetchTimeline,
    handleEmailThreadChangeEvent,
    initializeContact,
    onTouchChange,
    props.id
  ])

  if (isLoading) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  if (!contact) {
    return null
  }

  const _props = {
    contact,
    submitCallback: updateAttributeSubmitCallback
  }

  return (
    <>
      <PageLayout gutter={0}>
        <div className={classes.header}>
          <Header
            contact={contact}
            contactChangeCallback={fetchContact}
            onUpdateTouchFreq={handleUpdateTouchFreq}
            RenderActions={props.RenderActions}
          />
        </div>

        <div className={classes.container}>
          <MergeDuplicates contact={contact} mergeCallback={mergeCallback} />

          <div className={classes.boxContainer}>
            <div
              className={cn(classes.contentContainer, classes.sidenavContainer)}
            >
              <LastTouch
                contact={contact}
                onUpdateTouchFreq={handleUpdateTouchFreq}
              />
              <ContactInfo {..._props} />
              <Flows
                // @ts-ignore
                flows={contact?.flows || null}
                contactId={contact.id}
                onStop={handleStopFlow}
                addCallback={addToFlowCallback}
              />
              <Dates {..._props} />
              <AddressesSection {..._props} />
              <Deals contact={contact} />
              <Details {..._props} />
              <Partner {..._props} />
              <Acl.Beta>
                <Assignee {..._props} />
              </Acl.Beta>
              <Owner
                onSelect={onChangeOwner}
                owner={contact.user}
                user={props.user}
                contact={contact}
                disabled={isUpdatingOwner}
              />
              {activeBrand.id === contact.brand && (
                <Box mx={1}>
                  <Delete handleDelete={handleDelete} isDeleting={isDeleting} />
                </Box>
              )}
            </div>

            <div className={classes.tabContainer}>
              <div className={classes.tabHeaderContainer}>
                <Tabs
                  contact={contact}
                  activeFilter={activeFilter}
                  onChangeFilter={handleChangeFilter}
                />
                {activeFilter === Filters.Notes && (
                  <AddNote
                    contactId={contact.id}
                    onCreateNote={handleCreateNote}
                  />
                )}
                {(activeFilter === Filters.History ||
                  activeFilter === Filters.Upcoming) && (
                  <AddEvent contact={contact} callback={fetchTimeline} />
                )}
              </div>

              <div className={classes.timelineContainer}>
                {contact && (
                  <Timeline
                    activeFilter={activeFilter}
                    ref={timelineRef}
                    contact={contact}
                    onChangeNote={setNewContact}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  )
}

const mapStateToProps = ({ user, contacts, activeTeam = null }, props) => {
  const tags = contacts.list
  const fetchTags = !isFetchingTags(tags) && selectTags(tags).length === 0

  const cachedContact =
    selectContact(contacts.list, props.params?.id || props.id) || null

  const allConnectedAccounts = selectAllConnectedAccounts(
    contacts.oAuthAccounts
  )

  return {
    user,
    cachedContact,
    fetchTags,
    viewAsUsers: viewAs(activeTeam),
    attributeDefs: contacts.attributeDefs,
    allConnectedAccounts
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getContactsTags
  })(ContactProfile)
)
