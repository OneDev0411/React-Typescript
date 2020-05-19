import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
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

import { getContactsTags } from 'store_actions/contacts/get-contacts-tags'
import { normalizeContact as associationNormalizer } from 'views/utils/association-normalizers'

import Loading from '../../../../Partials/Loading'

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
import Timeline from './Timeline'
import MergeDuplicates from './MergeDuplicates'

class ContactProfile extends React.Component {
  state = {
    contact: null,
    isDeleting: false,
    isUpdatingOwner: false,
    isDesktopScreen: true
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.contact) {
      return state
    }

    if (!state.contact || props.contact.updated_at > state.contact.updated_at) {
      return { contact: props.contact }
    }

    return state
  }

  componentDidMount = () => {
    this.detectScreenSize()
    this.initializeContact()

    window.addEventListener('resize', this.detectScreenSize)

    window.socket.on('contact:touch', this.updateContact)
    window.socket.on('crm_task:create', this.fetchTimeline)
    window.socket.on('email_campaign:create', this.fetchTimeline)
    window.socket.on('email_campaign:send', this.fetchTimeline)
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.initializeContact()
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.detectScreenSize)
    window.socket.off('contact:touch', this.updateContact)
    window.socket.off('crm_task:create', this.fetchTimeline)
    window.socket.off('email_campaign:create', this.fetchTimeline)
    window.socket.off('email_campaign:send', this.fetchTimeline)
  }

  // creates a ref to the timeline
  timelineRef = React.createRef()

  /**
   * Web page (document) title
   * @returns {String} Title
   */
  get documentTitle() {
    const title = this.state.contact.display_name || ''

    return title ? `${title} | Contacts | Rechat` : 'Contact | Rechat'
  }

  detectScreenSize = () => {
    if (window.innerWidth < 1681 && this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: false })
    }

    if (window.innerWidth >= 1681 && !this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: true })
    }
  }

  updateContact = async () => {
    try {
      const response = await getContact(
        this.props.params.id,
        updateContactQuery
      )

      this.setState(state => ({
        contact: {
          ...normalizeContact(response.data),
          deals: state.contact.deals,
          flows: state.contact.flows
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  fetchContact = async (callback = () => {}) => {
    try {
      const response = await getContact(this.props.params.id, {
        associations: [
          ...updateContactQuery.associations,
          'contact.deals',
          'contact.flows',
          'flow_step.email',
          'flow_step.crm_task'
        ]
      })

      this.setState({ contact: normalizeContact(response.data) }, callback)
    } catch (error) {
      if (error.status === 404 || error.status === 400) {
        this.props.router.push('/dashboard/contacts')
      }
    }
  }

  initializeContact() {
    this.fetchContact(() => {
      if (this.props.fetchTags) {
        this.props.getContactsTags()
      }
    })
  }

  /**
   * refreshes timeline
   */
  fetchTimeline = () => setTimeout(this.timelineRef.current.refresh, 500)

  setContact = (newContact, fallback) => {
    this.setState(
      state => ({ contact: { ...state.contact, ...newContact } }),
      fallback
    )
  }

  onChangeOwner = async item => {
    this.setState({ isUpdatingOwner: true })

    try {
      const contact = await updateContactSelf(this.state.contact.id, {
        user: item.value.id
      })

      this.setState(state => ({
        isUpdatingOwner: false,
        contact: { ...state.contact, ...contact }
      }))
    } catch (error) {
      console.log(error)
      this.setState({ isUpdatingOwner: false })
    }
  }

  delete = async () => {
    try {
      this.setState({ isDeleting: true })

      await deleteContacts([this.state.contact.id])

      this.props.router.push('/dashboard/contacts')
    } catch (error) {
      console.log(error)
    }
  }

  stopFlow = async id => {
    try {
      await stopFlow(id)
      this.fetchContact()
      this.fetchTimeline()
    } catch (error) {
      console.log(error)
    }
  }

  addToFlowCallback = () => {
    this.fetchContact()
    this.fetchTimeline()
  }

  mergeCallback = async masterContactId => {
    if (masterContactId === this.state.contact.id) {
      await this.fetchContact()
      this.fetchTimeline()

      return
    }

    goTo(`/dashboard/contacts/${masterContactId}`)
  }

  handleUpdateContactInfo = attribute => {
    if (attribute.name === 'email') {
      this.fetchTimeline()
    }
  }

  render() {
    const { contact } = this.state
    const { user } = this.props

    if (!isLoadedContactAttrDefs(this.props.attributeDefs) || !contact) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    const defaultAssociation = {
      association_type: 'contact',
      contact: associationNormalizer(contact)
    }

    const _props = {
      contact,
      submitCallback: this.setContact
    }

    return (
      <PageWrapper>
        <Helmet>
          <title>{this.documentTitle}</title>
        </Helmet>
        <PageContainer className="u-scrollbar--thinner">
          <SideColumn>
            <Header
              contact={contact}
              backUrl={
                this.props.location.state && this.props.location.state.id
                  ? '/dashboard/contacts'
                  : null
              }
              closeButtonQuery={this.props.location.state}
              addToFlowCallback={this.addToFlowCallback}
            />
            <Divider />
            <Flows
              flows={contact.flows}
              contactId={contact.id}
              onStop={this.stopFlow}
              addCallback={this.addToFlowCallback}
            />
            <Divider />
            <Tags contact={contact} />
            <Divider />
            <ContactInfo {..._props} />
            <AddressesSection {..._props} />
            <Dates {..._props} />
            <Details {..._props} />
            <Partner {..._props} />
            <Divider />
            <Deals contact={contact} />
            <Divider />
            <Owner
              onSelect={this.onChangeOwner}
              owner={contact.user}
              user={user}
              contact={contact}
              disabled={this.state.isUpdatingOwner}
            />
            <Divider />
            <Delete
              handleDelete={this.delete}
              isDeleting={this.state.isDeleting}
            />
          </SideColumn>
          <MainColumn>
            <MergeDuplicates
              contact={this.state.contact}
              mergeCallback={this.mergeCallback}
            />
            <Timeline
              ref={this.timelineRef}
              contact={this.state.contact}
              defaultAssociation={defaultAssociation}
              onChangeNote={this.setContact}
            />
          </MainColumn>
        </PageContainer>
      </PageWrapper>
    )
  }
}

const mapStateToProps = ({ user, contacts }, props) => {
  const tags = contacts.list
  const fetchTags = !isFetchingTags(tags) && selectTags(tags).length === 0

  let contact = selectContact(contacts.list, props.params.id)

  if (!contact || !contact.user) {
    contact = null
  }

  return {
    user,
    contact,
    fetchTags,
    viewAsUsers: viewAs(user),
    attributeDefs: contacts.attributeDefs
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getContactsTags
    }
  )(ContactProfile)
)
