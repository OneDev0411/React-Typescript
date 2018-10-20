import { getActiveTeamACL } from 'utils/user-teams'

export default function hasMarketingAccess(user) {
  return getActiveTeamACL(user).includes('Marketing')
}
