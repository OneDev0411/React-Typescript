import pv from '../../config/private'
import pb from '../../config/public'

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
  my_marketing_matters_shared_secret: pv.my_marketing_matters.shared_secret,
  prerender_token: pv.prerender.token,
  aws_access_key_id: pv.aws.access_key_id,
  aws_secret_access_key: pv.aws.secret_access_key,
  videobolt_key: pv.videobolt.key
}
