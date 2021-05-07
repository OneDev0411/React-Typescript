import { useMemo } from 'react'

function useAppointmentApprovalAccessMessage(
  roles: IShowingRole[],
  hasApproved: boolean
) {
  const { names, count } = useMemo(() => {
    const names = roles.map(role => role.first_name).sort()

    if (names.length < 3) {
      return {
        names: names.join(' and '),
        count: names.length
      }
    }

    const lastName = names.pop()

    return {
      names: `${names.join(', ')} and ${lastName}`,
      count: names.length + 1
    }
  }, [roles])

  return hasApproved
    ? `You approved this before. It is waiting for ${names} to approve this appointment`
    : `${names} ${count > 1 ? 'have' : 'has'} access to do this.`
}

export default useAppointmentApprovalAccessMessage
