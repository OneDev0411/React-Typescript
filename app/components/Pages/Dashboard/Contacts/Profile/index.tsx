import React, { useState, useEffect, RefObject } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { Helmet } from 'react-helmet'

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
// import { normalizeContact as associationNormalizer } from 'views/utils/association-normalizers'

import Loading from '../../../../Partials/Loading'

import skipEmailThreadChangeEvent from '../../Inbox/helpers/skip-email-thread-change-event'

import { Container } from '../components/Container'
import Flows from './Flows'
import { Dates } from './Dates'
import Deals from './Deals'
import { Details } from './Details'
import { Partner } from './Partner'
import Tags from './Tags/TagsSection'
import { ContactInfo } from './ContactInfo'
import AddressesSection from './Addresses'
import { Owner } from './Owner'
import Delete from './Delete'
import { PageContainer, SideColumn, MainColumn, PageWrapper } from './styled'

import Header from './Header/Header'
import Divider from './Divider'
import Timeline, { TimelineRef } from './Timeline'
import MergeDuplicates from './MergeDuplicates'

const ContactProfile = props => {
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

  // static getDerivedStateFromProps(props, state) {
  //   if (!props.contact) {
  //     return state
  //   }

  //   if (!state.contact || props.contact.updated_at > state.contact.updated_at) {
  //     return { contact: props.contact }
  //   }

  //   return state
  // }

  const fetchContact = async (
    callback = () => {},
    showFullScreenLoading = false
  ) => {
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
  }

  const updateContact = async () => {
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
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      await deleteContacts([contact?.id])

      props.router.push('/dashboard/contacts')
    } catch (error) {
      console.log(error)
    }
  }

  const initializeContact = (showFullScreenLoading = false) => {
    fetchContact(() => {
      if (props.fetchTags) {
        props.getContactsTags()
      }
    }, showFullScreenLoading)
  }

  const setNewContact = (newContact, fallback) => {
    setContact({ ...contact, ...newContact })
    fallback()
  }

  const detectScreenSize = () => {
    if (window.innerWidth < 1681 && isDesktopScreen) {
      setIsDesktopScreen(false)
    }

    if (window.innerWidth >= 1681 && !isDesktopScreen) {
      setIsDesktopScreen(true)
    }
  }

  // creates a ref to the timeline
  const timelineRef: RefObject<TimelineRef> = React.createRef()
  /**
   * refreshes timeline
   */
  const fetchTimeline = () => {
    if (!timelineRef) {
      return
    }

    return setTimeout(timelineRef.current?.refresh, 500)
  }

  const handleEmailThreadChangeEvent = event => {
    if (
      !timelineRef ||
      skipEmailThreadChangeEvent(event, props.allConnectedAccounts)
    ) {
      return
    }

    timelineRef.current?.refresh()
  }

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
    socket.on('crm_task:create', fetchTimeline)
    socket.on('email_campaign:create', fetchTimeline)
    socket.on('email_campaign:send', fetchTimeline)
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
  }, [props.params])

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
    <PageWrapper>
      <Helmet>
        <title>{documentTitle()}</title>
      </Helmet>
      <PageContainer className="u-scrollbar--thinner">
        <SideColumn>
          <Header
            contact={contact}
            // closeButtonQuery={props.location.state}
            // addToFlowCallback={addToFlowCallback}
          />
          <Tags contact={contact} onChange={fetchContact} />
          <Flows
            // @ts-ignore
            flows={contact?.flows || null}
            contactId={contact.id}
            onStop={handleStopFlow}
            addCallback={addToFlowCallback}
          />
          <ContactInfo {..._props} />
          <AddressesSection {..._props} />
          <Dates {..._props} />
          <Deals contact={contact} />
          <Details {..._props} />
          <Partner {..._props} />
          <Divider />
          <Owner
            onSelect={onChangeOwner}
            owner={contact.user}
            user={props.user}
            contact={contact}
            disabled={isUpdatingOwner}
          />
          <Divider />
          <Delete handleDelete={handleDelete} isDeleting={isDeleting} />
        </SideColumn>
        <MainColumn>
          <MergeDuplicates contact={contact} mergeCallback={mergeCallback} />
          <Timeline
            ref={timelineRef}
            contact={contact}
            onChangeNote={setNewContact}
          />
        </MainColumn>
      </PageContainer>
    </PageWrapper>
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
