import Fetch from 'services/fetch'

async function getMembers(role) {
  const endpoint = `/brands/${role.brand}/roles/${role.id}/members`

  try {
    const fetchRoles = new Fetch().get(endpoint)

    return await fetchRoles
  } catch (e) {
    console.log(e)
  }
}

interface IAddTeamMember {
  avatar: File
  email: string
  firstName: string
  lastName: string
  phone: string
  roles: UUID[]
  user: UUID
}

async function addMembers(
  brandId: string,
  roleId: string,
  member: Partial<IAddTeamMember>
) {
  try {
    const request = new Fetch()
      .upload(`/brands/${brandId}/roles/${roleId}/members`)
      .set('X-RECHAT-BRAND', brandId)

    if (member.user) {
      request.field('user', member.user)
    }

    if (member.email) {
      request.field('email', member.email)
    }

    if (member.firstName) {
      request.field('first_name', member.firstName)
    }

    if (member.lastName) {
      request.field('last_name', member.lastName)
    }

    if (member.phone) {
      request.field('phone_number', member.phone)
    }

    if (member.avatar) {
      request.attach('avatar', member.avatar)
    }

    return await request
  } catch (error) {
    throw error
  }
}

async function deleteMember(role: IBrandRole, member_id: string) {
  try {
    return await new Fetch().delete(
      `/brands/${role.brand}/roles/${role.id}/members/${member_id}`
    )
  } catch (error) {
    return { error }
  }
}

export default {
  getMembers,
  addMembers,
  deleteMember
}
