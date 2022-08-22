/* TODO: this I've made this component typescript 8 months ago during contact profile redesign
   without any improvement. literally, I just convert js to tsx which we should take care of it in future.
*/
import { useRef, useState, RefObject, useEffect, useCallback } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { useEffectOnce } from 'react-use'

import { useGetGlobalTriggers } from '@app/components/Pages/Dashboard/Account/Triggers/hooks/use-get-global-triggers'
import useConfirmation from '@app/hooks/use-confirmation'
import useNotify from '@app/hooks/use-notify'
import { updateContactTouchReminder } from '@app/models/contacts/update-contact-touch-reminder'
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
      padding: theme.spacing(0, 4)
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 'auto',
      padding: theme.spacing(2, 4, 4),
      background: theme.palette.grey[50]
    },
    contentContainer: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderRadius: `${theme.shape.borderRadius}px`,
      width: '100%',
      height: '100%'
    },
    tabContainer: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column'
    },
    tabHeaderContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    timelineContainer: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderRadius: `${theme.shape.borderRadius}px`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    boxContainer: {
      display: 'flex',
      gap: theme.spacing(2)
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

const ContactProfile = props => {
  useGetGlobalTriggers()

  const notify = useNotify()

  const classes = useStyles()
  const confirmation = useConfirmation()
  const [contact, setContact] = useState<Nullable<INormalizedContact>>(null)
  const [currentContactId, setCurrentContactId] = useState<string | undefined>(
    props.params?.id
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingOwner, setIsUpdatingOwner] = useState(false)
  const [isDesktopScreen, setIsDesktopScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(
    !isLoadedContactAttrDefs(props?.attributeDefs) || !props?.contact
  )
  const [activeFilter, setActiveFilter] = useState<Filters>(Filters.Events)

  const fetchContact = useCallback(
    async (callback = () => {}, showFullScreenLoading = false) => {
      if (showFullScreenLoading) {
        setIsLoading(true)
      }

      try {
        const response = await getContact(props.params.id, {
          associations: [
            ...updateContactQuery.associations,
            'contact.deals',
            'contact.flows',
            'flow_step.email',
            'contact.triggers',
            'trigger.campaign',
            'flow_step.crm_task',
            'email_campaign.from',
            'email_campaign.template',
            'template_instance.template'
          ]
        })

        setContact(normalizeContact(response.data))
        setIsLoading(false)
        callback()
      } catch (error) {
        if (error.status === 404 || error.status === 400) {
          props.router.push('/dashboard/contacts')
        }
      }
    },
    [props.params.id, props.router]
  )

  const updateContact = useCallback(async () => {
    try {
      const response = await getContact(props.params.id, updateContactQuery)
      const normalizedContact = normalizeContact(response.data)

      if (contact) {
        setContact({
          ...normalizedContact,
          deals: contact.deals,
          flows: contact.flows
        })
      } else {
        setContact(normalizedContact)
      }
    } catch (error) {
      console.error(error)
    }
  }, [contact, props.params.id])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      await deleteContacts([contact?.id])

      props.router.push('/dashboard/contacts')
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

    goTo(`/dashboard/contacts/${masterContactId}`)
  }

  const handleChangeFilter = (value: Filters) => {
    setActiveFilter(value)
  }

  const updateAttributeSubmitCallback = (
    contact: INormalizedContact,
    updatedAttribute: IContactAttributeDef
  ) => {
    setNewContact(contact)

    if (updatedAttribute.data_type === 'date') {
      fetchTimeline()
    }
  }
  const onTouchChange = useCallback(
    ({ contacts }) => {
      if (Array.isArray(contacts) && contacts.includes(currentContactId)) {
        console.log('[ Socket ] Touch Changed')
        updateContact()
      }
    },
    [currentContactId, updateContact]
  )

  useEffectOnce(() => {
    detectScreenSize()
    initializeContact()
  })

  useEffect(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    if (props.params.id !== currentContactId) {
      setCurrentContactId(props.params.id)
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
    props.params.id,
    currentContactId,
    detectScreenSize,
    fetchTimeline,
    handleEmailThreadChangeEvent,
    initializeContact,
    onTouchChange
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
      <Helmet>
        <title>{documentTitle()}</title>
      </Helmet>
      <PageLayout gutter={0}>
        <div className={classes.header}>
          <Header
            contact={contact}
            contactChangeCallback={fetchContact}
            onUpdateTouchFreq={handleUpdateTouchFreq}
          />
        </div>

        <div className={classes.container}>
          <MergeDuplicates contact={contact} mergeCallback={mergeCallback} />

          <div className={classes.boxContainer}>
            <div
              className={cn(classes.contentContainer, classes.sidenavContainer)}
            >
              <LastTouch contact={contact} />
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
              <Owner
                onSelect={onChangeOwner}
                owner={contact.user}
                user={props.user}
                contact={contact}
                disabled={isUpdatingOwner}
              />
              <Delete handleDelete={handleDelete} isDeleting={isDeleting} />
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
                {activeFilter === Filters.Events && (
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

  let contact = selectContact(contacts.list, props.params.id)

  if (!contact || !contact.user) {
    contact = null
  }

  const allConnectedAccounts = selectAllConnectedAccounts(
    contacts.oAuthAccounts
  )

  return {
    user,
    contact,
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
