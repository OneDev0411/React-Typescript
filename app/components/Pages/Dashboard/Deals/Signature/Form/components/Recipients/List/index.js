import React, { Fragment } from 'react'
import _ from 'underscore'

import { Button, IconButton } from '@material-ui/core'

import { BasicDropdown } from 'components/BasicDropdown'
import UserAvatar from 'components/Avatar'

import IconClose from 'components/SvgIcons/Close/CloseIcon'

import { MenuButton } from './components/MenuButton'

import {
  RoleAvatar,
  RoleInfo,
  RoleType
} from '../../../../../components/Roles/styled'

import { roleName, getLegalFullName } from '../../../../../utils/roles'
import { getAvatarTitle } from '../../../../../utils/get-avatar-title'

import {
  ItemContainer,
  Role,
  RoleTitle,
  Header,
  OrderCell,
  RoleCell,
  RecipientTypeCell,
  DeleteCell
} from './styled'

export class RecipientsList extends React.Component {
  get Orders() {
    return new Array(_.size(this.props.items)).fill(0).map((v, k) => ({
      label: k + 1,
      onClick: role => this.handleOrderChange(role, k + 1)
    }))
  }

  get Types() {
    return [
      {
        label: 'Need To Sign',
        value: 'Signer',
        onClick: role => this.handleTypeChange(role, 'Signer')
      },
      {
        label: 'CC',
        value: 'CarbonCopy',
        onClick: role => this.handleTypeChange(role, 'CarbonCopy')
      }
    ]
  }

  getSelectedOrder = role =>
    this.Orders.find(item => ~~role.order === ~~item.label) || this.Orders[0]

  getSelectedType = role =>
    this.Types.find(item => role.envelope_recipient_type === item.value) ||
    this.Types[0]

  handleOrderChange = (role, order) =>
    this.props.onChangeRecipientOrder(role, order)

  handleTypeChange = (role, type) =>
    this.props.onChangeRecipientType(role, type)

  render() {
    return (
      <Fragment>
        {_.size(this.props.items) > 0 && (
          <Header>
            <OrderCell>Order</OrderCell>
            <RoleCell>Recipients</RoleCell>
            <RecipientTypeCell />
            <DeleteCell />
          </Header>
        )}

        {_.map(this.props.items, role => (
          <ItemContainer key={role.id}>
            <OrderCell>
              {/* TODO: replace with mui dropdown */}
              <BasicDropdown
                style={{ marginRight: '1rem', width: '10%' }}
                items={this.Orders}
                onChange={item => item.onClick(role)}
                buttonRenderer={props => <MenuButton {...props} />}
                defaultSelectedItem={this.getSelectedOrder(role)}
                fullHeight
                itemRenderer={({ item, ...rest }) => (
                  <Button
                    fullWidth
                    key={item.label}
                    style={{ width: '100%' }}
                    {...rest}
                  >
                    {item.label}
                  </Button>
                )}
              />
            </OrderCell>

            <RoleCell>
              <Role style={{ justifyContent: 'flex-start' }}>
                <RoleAvatar style={{ width: 'auto' }}>
                  <UserAvatar
                    size={32}
                    color="#000"
                    title={getAvatarTitle(role)}
                    image={
                      role && role.user ? role.user.profile_image_url : null
                    }
                  />
                </RoleAvatar>

                <RoleInfo>
                  <RoleTitle style={{ fontWeight: 500 }}>
                    {getLegalFullName(role)}
                  </RoleTitle>
                  <RoleType style={{ color: '#000', fontSize: '0.875rem' }}>
                    {roleName(role.role)}
                  </RoleType>
                </RoleInfo>
              </Role>
            </RoleCell>

            <RecipientTypeCell>
              {/* TODO: replace with mui dropdown */}
              <BasicDropdown
                items={this.Types}
                onChange={item => item.onClick(role)}
                pullTo="right"
                buttonRenderer={props => <MenuButton {...props} />}
                defaultSelectedItem={this.getSelectedType(role)}
                fullHeight
                itemRenderer={({ item, ...rest }) => (
                  <Button
                    key={item.label}
                    style={{ minWidth: '100px' }}
                    {...rest}
                  >
                    {item.label}
                  </Button>
                )}
              />
            </RecipientTypeCell>

            <DeleteCell>
              <IconButton
                size="small"
                onClick={() => this.props.onRemoveRecipient(role)}
              >
                <IconClose style={{ width: '16px' }} />
              </IconButton>
            </DeleteCell>
          </ItemContainer>
        ))}
      </Fragment>
    )
  }
}
