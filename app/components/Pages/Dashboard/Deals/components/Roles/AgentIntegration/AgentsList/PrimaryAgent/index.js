import React, { Fragment } from 'react'
import Flex from 'styled-flex-component'

import Avatar from 'components/Avatar'
import { getBrandUsers } from 'utils/user-teams'

import { roleName } from 'deals/utils/roles'

import { RoleItem, RoleInfo, RoleTitle, RoleType } from '../../../styled'

export function PrimaryAgent(props) {
  return (
    <Fragment>
      {props.teams.map(office =>
        getBrandUsers(office).map(user => (
          <Flex key={user.id}>
            <RoleItem
              onClick={() =>
                props.onSelectAgent({
                  ...user,
                  brand_id: office.id
                })
              }
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                height: '3.5rem',
                marginBottom: 0,
                padding: 0
              }}
            >
              <Avatar
                title={user.display_name}
                image={user.profile_image_url}
                size={40}
                style={{
                  marginRight: '1rem'
                }}
              />

              <RoleInfo>
                <RoleTitle
                  style={{
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  {user.display_name}
                </RoleTitle>
                <RoleType>{roleName(user.role || '')}</RoleType>
              </RoleInfo>
            </RoleItem>
          </Flex>
        ))
      )}
    </Fragment>
  )
}
