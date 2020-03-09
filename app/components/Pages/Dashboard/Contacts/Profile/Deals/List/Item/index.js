import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import _ from 'underscore'

import { Typography, Box } from '@material-ui/core'

import { goTo } from 'utils/go-to'

import { getContactUsers } from 'models/contacts/helpers'
import { getAddress } from 'models/Deal/helpers/context'

import Avatar from 'components/Avatar'
import { normalizeDeal } from 'views/utils/association-normalizers'

import { roleName } from '../../../../../Deals/utils/roles'

import { Container, Role } from './styled'

class Item extends React.Component {
  state = {
    roles: []
  }

  componentDidMount() {
    this.searchRoles()
  }

  handleOnClickItem = () =>
    goTo(
      `/dashboard/deals/${this.props.item.id}`,
      `Contact - ${this.props.contact.display_name}`
    )

  searchRoles = async () => {
    const { item, contact } = this.props
    const { roles } = item
    let matchedRoles = []
    const contactUsers = getContactUsers(contact)

    // todo: refactor
    for (let index = 0; index < roles.length; index++) {
      if (
        (roles[index].user &&
          _.find(contactUsers, ({ id }) => id === roles[index].user.id)) ||
        roles[index].email ||
        roles[index].phone_number
      ) {
        matchedRoles.push(roles[index])
      }
    }

    this.setState({ roles: matchedRoles })
  }

  render() {
    const { item } = this.props
    const { roles } = this.state

    const clientTitle = ''
    const address = getAddress(item)
    const avatar = normalizeDeal(item, false).avatar

    const contactRoleName = roles.map(role => roleName(role.role)).join(', ')

    return (
      <Container onClick={this.handleOnClickItem}>
        <Avatar {...avatar} size={40} />
        <Box ml={1} width="calc(100% - 3rem)">
          <Typography variant="body2">
            {address && <Typography variant="body2">{address}</Typography>}
            <Flex alignCenter>
              {clientTitle && (
                <Typography variant="body2">{clientTitle}</Typography>
              )}
              {contactRoleName && <Role>{contactRoleName}</Role>}
            </Flex>
          </Typography>
        </Box>
      </Container>
    )
  }
}

Item.propTypes = {
  contact: PropTypes.shape().isRequired,
  item: PropTypes.object.isRequired,
  handleOnClickItem: PropTypes.func.isRequired
}

export default Item
