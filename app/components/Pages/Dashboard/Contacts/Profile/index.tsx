import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  RefObject
} from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { useEffectOnce } from 'react-use'
import { Box, makeStyles, Theme } from '@material-ui/core'
import { Helmet } from 'react-helmet'

import cn from 'classnames'

import PageLayout from 'components/GlobalPageLayout'

import { goTo } from 'utils/go-to'
import { viewAs } from 'utils/user-teams'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'

import { stopFlow } from 'models/flows/stop-flow'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { updateContactQuery } from 'models/contacts/helpers/default-query'
import { getContact } from 'models/contacts/get-contact'
import { deleteContacts } from 'models/contacts/delete-contact'
import { updateContactSelf } from 'models/contacts/update-contact-self'

import { isLoadedContactAttrDefs } from 'reducers/contacts/attributeDefs'
import { selectContact } from 'reducers/contacts/list'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { getContactsTags } from 'actions/contacts/get-contacts-tags'

import Loading from '../../../../Partials/Loading'

import skipEmailThreadChangeEvent from '../../Inbox/helpers/skip-email-thread-change-event'
import { Container } from '../components/Container'
import Flows from './Flows'
import { Dates } from './Dates'
import Deals from './Deals'
import { Details } from './Details'
import { Partner } from './Partner'
import { ContactInfo } from './ContactInfo'
import { LastTouch } from './LastTouch'
import AddressesSection from './Addresses'
import { Owner } from './Owner'
import Delete from './Delete'

import { Header } from './Header'
import { Filters, Tabs } from './Tabs'
import Timeline, { TimelineRef } from './Timeline'
import MergeDuplicates from './MergeDuplicates'

const useStyles = makeStyles(
  (theme: Theme) => ({
    header: {
      padding: theme.spacing(0, 4)
    },
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      width: '100%',
      height: 'auto',
      padding: theme.spacing(2, 4, 4),
      background: theme.palette.grey[50]
    },
    contentContainer: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderRadius: `${theme.shape.borderRadius}px`
    },
    sidenavContainer: {
      width: '350px',
      padding: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    timelineContainer: {
      flexGrow: 1
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
  const classes = useStyles()
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
    if (!timelineRef) {
      return
    }

    return setTimeout(timelineRef.current?.refresh, 500)
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
      const alteredContact = await updateContactSelf(contact.id, {
        // @ts-ignore
        user: item.value.id
      })

      setContact({ ...contact, ...alteredContact })
      setIsUpdatingOwner(false)
    } catch (error) {
      console.log(error)
      setIsUpdatingOwner(false)
    }
  }

  const handleStopFlow = async id => {
    try {
      await stopFlow(id)
      fetchContact()
      fetchTimeline()
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

  // const handleUpdateContactInfo = attribute => {
  //   if (attribute.name === 'email') {
  //     fetchTimeline()
  //   }
  // }

  useEffectOnce(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    detectScreenSize()
    initializeContact()

    window.addEventListener('resize', detectScreenSize)

    if (!socket) {
      return
    }

    socket.on('contact:touch', updateContact)
    socket.on('crm_task:create', () => fetchTimeline())
    socket.on('email_campaign:create', () => fetchTimeline())
    socket.on('email_campaign:send', () => fetchTimeline())
    socket.on('email_thread:update', handleEmailThreadChangeEvent)
    socket.on('email_thread:delete', handleEmailThreadChangeEvent)
  })

  useEffect(() => {
    if (props.params.id !== currentContactId) {
      setCurrentContactId(props.params.id)
      initializeContact(true)
    }

    return () => {
      const socket: SocketIOClient.Socket = (window as any).socket

      if (!socket) {
        return
      }

      window.removeEventListener('resize', detectScreenSize)
      socket.off('contact:touch', updateContact)
      socket.off('crm_task:create', fetchTimeline)
      socket.off('email_campaign:create', fetchTimeline)
      socket.off('email_campaign:send', fetchTimeline)
      socket.off('email_thread:update', handleEmailThreadChangeEvent)
      socket.off('email_thread:delete', handleEmailThreadChangeEvent)
    }
  }, [
    props.params,
    currentContactId,
    detectScreenSize,
    fetchTimeline,
    handleEmailThreadChangeEvent,
    initializeContact,
    updateContact
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
    submitCallback: setNewContact
  }

  return (
    <>
      <Helmet>
        <title>{documentTitle()}</title>
      </Helmet>
      <PageLayout gutter={0}>
        <Box className={classes.header}>
          <Header
            contact={contact}
            onTagChange={fetchContact}
            handleCreateNote={handleCreateNote}
          />
          <Tabs
            contact={contact}
            activeFilter={activeFilter}
            onChangeFilter={handleChangeFilter}
          />
        </Box>

        <PageLayout.Main mt={0} className={classes.container}>
          <Box
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
          </Box>
          <Box
            className={cn(classes.contentContainer, classes.timelineContainer)}
          >
            <MergeDuplicates contact={contact} mergeCallback={mergeCallback} />
            <Timeline
              activeFilter={activeFilter}
              ref={timelineRef}
              contact={contact}
              onChangeNote={setNewContact}
            />
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

const mapStateToProps = ({ user, contacts }, props) => {
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
    viewAsUsers: viewAs(user),
    attributeDefs: contacts.attributeDefs,
    allConnectedAccounts
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getContactsTags
  })(ContactProfile)
)
