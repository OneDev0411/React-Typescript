export const ACL: Record<
  | 'CRM'
  | 'ADMIN'
  | 'DEALS'
  | 'BACK_OFFICE'
  | 'MARKETING'
  | 'STORE'
  | 'BETA'
  | 'AGENT_NETWORK',
  IPermission
> = {
  CRM: 'CRM',
  ADMIN: 'Admin',
  DEALS: 'Deals',
  BACK_OFFICE: 'BackOffice',
  MARKETING: 'Marketing',
  STORE: 'STORE',
  BETA: 'BetaFeatures',
  AGENT_NETWORK: 'AgentNetwork'
}
