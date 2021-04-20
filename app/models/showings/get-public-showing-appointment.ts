import Fetch from 'services/fetch'

export async function getPublicShowingAppointment(
  appointmentId: UUID
): Promise<IPublicShowingAppointment<'showing'>> {
  const response = await new Fetch()
    .get(`/showings/public/appointments/${appointmentId}`)
    .query({
      'associations[]': ['showing_appointment_public.showing']
    })

  return response.body.data
}
