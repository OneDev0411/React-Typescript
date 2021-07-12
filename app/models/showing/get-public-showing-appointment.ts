import Fetch from 'services/fetch'

export async function getPublicShowingAppointment(
  appointmentToken: UUID
): Promise<IPublicShowingAppointment<'showing'>> {
  const response = await new Fetch()
    .get(`/showings/public/appointments/${appointmentToken}`)
    .query({
      'associations[]': ['showing_appointment_public.showing']
    })

  return response.body.data
}
