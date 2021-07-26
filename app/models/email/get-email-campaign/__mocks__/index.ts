import mcEmailCampaign from 'fixtures/email-campaign/mc-email-campaign.json'
import simpleEmailCampaign from 'fixtures/email-campaign/simple-email-campaign.json'

const samples = {
  simple: simpleEmailCampaign,
  mc: mcEmailCampaign
}
export async function getEmailCampaign(id: string) {
  return samples[id] || simpleEmailCampaign
}
