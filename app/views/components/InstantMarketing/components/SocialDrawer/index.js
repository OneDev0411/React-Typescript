import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Flex from 'styled-flex-component'

import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

import IconDoubleCheck from 'components/SvgIcons/DoubleCheckMark/IconDoubleCheck'
import Drawer from 'components/OverlayDrawer'
import { getBrandAgents } from 'views/utils/brand-members'

import { formatPhoneNumber } from 'utils/format'

import { getTemplateInstances } from 'models/instant-marketing/get-template-instances'
import { shareInstance } from 'models/instant-marketing/instance-share'

import Loading from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'
import ActionButton from 'components/Button/ActionButton'
import Avatar from 'components/Avatar'

import ShareLink from './ShareLink'
import { HelpIntro } from './Intro'

import { SectionTitle, AgentItem, AgentInfo } from './styled'

class SocialDrawer extends React.Component {
  state = {
    instance: null,
    sentList: [],
    isSending: []
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    try {
      const instance = await getTemplateInstances(this.props.template.id, {
        ...this.props.templateInstanceData,
        html: this.props.template.result
      })

      this.setState({
        instance
      })
    } catch (e) {
      console.log(e)
    }
  }

  get Agents() {
    return this.props.agents || []
  }

  get FileUrl() {
    return (
      this.state.instance &&
      truncateTextFromMiddle(this.state.instance.file.url, 60)
    )
  }

  isSent = user => this.state.sentList.includes(user.id)

  handleSend = async agent => {
    this.setState(state => ({
      isSending: [...state.isSending, agent.id]
    }))

    try {
      await shareInstance(this.state.instance.id, [agent.phone_number])

      this.setState(state => ({
        sentList: [...state.sentList, agent.id]
      }))
    } catch (e) {
      console.log(e)
    } finally {
      this.setState(state => ({
        isSending: state.isSending.filter(id => id !== agent.id)
      }))
    }
  }

  isSendButtonDisabled = agent =>
    this.state.instance === null ||
    !agent.phone_number ||
    this.state.isSending.includes(agent.id)

  getSendButtonCaption = agent =>
    this.state.isSending.includes(agent.id) ? 'Sending...' : 'Send'

  render() {
    return (
      <Drawer isOpen onClose={this.props.onClose} showFooter={false}>
        <Drawer.Header title={`Share on ${this.props.socialName}`} />
        <Drawer.Body>
          <HelpIntro />

          <ShareLink fileUrl={this.FileUrl} instance={this.state.instance} />

          <SectionTitle>Share link via SMS</SectionTitle>

          {this.Agents.length === 0 && (
            <div>
              <Loading />
            </div>
          )}

          {this.Agents.map(agent => (
            <AgentItem key={agent.id}>
              <Flex>
                <Avatar
                  title={agent.display_name}
                  image={agent.profile_image_url}
                />
                <AgentInfo>
                  <Flex
                    style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      lineHeight: 1.5
                    }}
                  >
                    {agent.display_name}
                  </Flex>
                  <Flex style={{ fontSize: '0.875rem' }}>
                    {formatPhoneNumber(agent.phone_number)}
                  </Flex>
                </AgentInfo>
              </Flex>

              <Flex>
                {this.isSent(agent) ? (
                  <Fragment>
                    <IconDoubleCheck />
                    &nbsp;
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      Sent
                    </span>
                  </Fragment>
                ) : (
                  <ActionButton
                    size="small"
                    disabled={this.isSendButtonDisabled(agent)}
                    onClick={() => this.handleSend(agent)}
                  >
                    {this.getSendButtonCaption(agent)}
                  </ActionButton>
                )}
              </Flex>
            </AgentItem>
          ))}
        </Drawer.Body>
      </Drawer>
    )
  }
}

SocialDrawer.propTypes = {
  template: PropTypes.object.isRequired,
  templateInstanceData: PropTypes.object.isRequired
}

SocialDrawer.defaultProps = {}

function mapStateToProps({ user }) {
  return {
    agents: getBrandAgents(user)
  }
}

export default connect(mapStateToProps)(SocialDrawer)
