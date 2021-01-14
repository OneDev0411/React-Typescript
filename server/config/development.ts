import pb from '../../config/public'
import pv from '../../config/private'

export default {
  app_name: pv.app_name,
  api_url: pb.api_url,
  client_id: pv.api.client_id,
  client_secret: pv.api.client_secret,
  crypto_key: pv.crypto.key,
  crypto_iv: pv.crypto.iv,
  forms_url: pb.forms.url,
  live_by_api_url: pv.live_by.api_url,
  live_by_api_client_id: pv.live_by.api_client_id,
  live_by_api_key: pv.live_by.api_key,
  my_marketing_matters_duns: pv.my_marketing_matters.duns,
  my_marketing_matters_shared_secret: pv.my_marketing_matters.shared_secret
}
