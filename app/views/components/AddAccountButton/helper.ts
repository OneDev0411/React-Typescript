import IconRealtor from '@app/views/components/SvgIcons/Realtor/IconRealtor.svg'
import IconZillow from '@app/views/components/SvgIcons/Zillow/IconZillow.svg'

export const convertLeadChannelsToAuthAccounts = (
  channels: LeadChannel[]
): IOAuthAccount[] => {
  return channels.map(channel => ({
    brand: channel.brand,
    contacts_last_sync_at: (channel.last_capture_date
      ? new Date(channel.last_capture_date)
      : new Date()
    ).toISOString(),
    created_at: new Date(channel.created_at).toISOString(),
    deleted_at: channel.deleted_at
      ? new Date(channel.deleted_at).toISOString()
      : null,
    display_name: channel.source_type,
    email: channel.user,
    first_name: '',
    gid: '',
    history_id: '',
    id: channel.id,
    last_name: '',
    last_sync_duration: 0,
    messages_total: 0,
    ord: '',
    photo: null,
    profile_image_url:
      channel.source_type === 'Zillow' ? IconZillow : IconRealtor,
    resource_name: channel.source_type,
    revoked: false,
    scope: [],
    scope_summary: [],
    threads_total: channel.capture_number,
    type: channel.source_type,
    updated_at: (channel.updated_at
      ? new Date(channel.updated_at)
      : new Date()
    ).toISOString(),
    user: channel.user,
    jobs: [
      {
        brand: channel.brand,
        deleted_at: channel.deleted_at
          ? new Date(channel.deleted_at).toISOString()
          : null,
        id: channel.id,
        google_credential: null,
        job_name: 'calendar',
        metadata: null,
        microsoft_credential: null,
        recurrence: true,
        resume_at: null,
        start_at: new Date(channel.created_at).toISOString(),
        status: 'success',
        type: 'users_jobs',
        updated_at: (channel.updated_at
          ? new Date(channel.updated_at)
          : new Date()
        ).toISOString(),
        user: channel.user
      },
      {
        brand: channel.brand,
        deleted_at: channel.deleted_at
          ? new Date(channel.deleted_at).toISOString()
          : null,
        id: channel.id,
        google_credential: null,
        job_name: 'contacts',
        metadata: null,
        microsoft_credential: null,
        recurrence: true,
        resume_at: null,
        start_at: new Date(channel.created_at).toISOString(),
        status: 'success',
        type: 'users_jobs',
        updated_at: (channel.updated_at
          ? new Date(channel.updated_at)
          : new Date()
        ).toISOString(),
        user: channel.user
      },
      {
        brand: channel.brand,
        deleted_at: channel.deleted_at
          ? new Date(channel.deleted_at).toISOString()
          : null,
        id: channel.id,
        google_credential: null,
        job_name: 'email',
        metadata: null,
        microsoft_credential: null,
        recurrence: true,
        resume_at: null,
        start_at: new Date(channel.created_at).toISOString(),
        status: 'success',
        type: 'users_jobs',
        updated_at: (channel.updated_at
          ? new Date(channel.updated_at)
          : new Date()
        ).toISOString(),
        user: channel.user
      }
    ]
  }))
}
