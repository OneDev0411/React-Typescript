import React from 'react'
import Flex from 'styled-flex-component'

import fecha from 'fecha'

import LinkButton from 'components/Button/LinkButton'
import Spinner from 'components/Spinner'
import { BasicDropdown } from 'components/BasicDropdown'
import VerticalDotsIcon from 'components/SvgIcons/MoreVert/IconMoreVert'
import LinkIcon from 'components/SvgIcons/LinkIcon'

import { getActiveTeamId } from 'utils/user-teams'
import config from 'config'

import {
  Container,
  EventItem,
  EventInfoTitle,
  EventInfoDescription,
  RegistrationLink,
  LinkText,
  EventMenu
} from './styled.js'

export default class EventsList extends React.Component {
  menuItems = [
    {
      label: 'Edit',
      onClick: event => this.onEditEvent(event)
    }
  ]

  activeBrand = getActiveTeamId(this.props.user)

  getRegisterLink = event =>
    `${config.app.url}/openhouse/${event.id}/${this.activeBrand}/register`

  onEditEvent = event => this.props.onEditEvent(event)

  render() {
    if (this.props.isFetching) {
      return <Spinner />
    }

    return (
      <Container>
        {this.props.events.map(event => {
          const link = this.getRegisterLink(event)

          return (
            <EventItem key={event.id}>
              <Flex
                column
                style={{ width: '50%' }}
                onClick={() => this.onEditEvent(event)}
              >
                <EventInfoTitle>
                  Open House:&nbsp;
                  {fecha.format(
                    new Date(event.due_date * 1000),
                    'dddd, MMMM D, YYYY hh:mm A'
                  )}
                </EventInfoTitle>
                <EventInfoDescription>{event.description}</EventInfoDescription>
              </Flex>

              <RegistrationLink>
                <LinkText>
                  <a href={link} target="_blabk">
                    {link}
                  </a>
                  <LinkIcon />
                </LinkText>

                <LinkButton
                  appearance="outline"
                  target="_blank"
                  to={link}
                  style={{ margin: 0 }}
                >
                  Registration Page
                </LinkButton>
              </RegistrationLink>

              <EventMenu>
                <BasicDropdown
                  pullTo="right"
                  buttonRenderer={props => <VerticalDotsIcon {...props} />}
                  items={this.menuItems}
                  onChange={item => item.onClick(event)}
                />
              </EventMenu>
            </EventItem>
          )
        })}
      </Container>
    )
  }
}
