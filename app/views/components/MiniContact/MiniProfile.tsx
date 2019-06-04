import React from 'react'

import Avatar from 'components/Avatar'
// import TextIconButton from 'components/Button/TextIconButton'
import IconCalendar from 'components/SvgIcons/Calendar2/IconCalendar'
import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Show from './Show'
import Activity from './Activity'
import { MiniContactType } from './index'
import { ProfileContainer } from './styled'
import { get_name } from './helpers'
import useProfile, { ProfileType } from './useProfile'

interface MiniProfilePropsType {
  type: MiniContactType
  initData: {}
}

function MiniProfile(props: MiniProfilePropsType) {
  const output = useProfile(props.type, props.initData)
  const data = output.data
  // const isContact = !!output.contact_id

  return (
    <ProfileContainer>
      <div className="head">
        <Avatar
          title={get_name(data)}
          image={data.profile_image_url}
          size={72}
        />

        <div className="actions">
          {output.contact_status === 'loading' && <Loading />}
          {/* <TextIconButton
            appearance="outline"
            iconLeft={IconCalendar}
            onClick={() => {}}
            size="small"
            text="Add Event"
          /> */}
        </div>
      </div>
      <div className="details">
        <Show if={!!data.name}>
          <div className="person-name">{data.name}</div>
        </Show>
        <Show if={!!data.phone}>
          <div className="person-phone">{data.phone}</div>
        </Show>
        <Show if={!!data.email}>
          <div className="person-email">{data.email}</div>
        </Show>
        <Show if={!!data.address}>
          <div className="person-more-info">
            <div className="person-address">{data.address}</div>
          </div>
        </Show>
      </div>
      <Activity dates={data.dates} />
    </ProfileContainer>
  )
}

export default MiniProfile
