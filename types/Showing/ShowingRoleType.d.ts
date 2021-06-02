declare type IShowingRoleType = Extract<
  IDealRoleType,
  'SellerAgent' | 'CoSellerAgent' | 'Tenant'
>
