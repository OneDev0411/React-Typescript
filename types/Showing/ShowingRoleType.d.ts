declare type IShowingRoleType = Extract<
  IDealRoleType,
  'Admin/Assistant' | 'SellerAgent' | 'CoSellerAgent' | 'Tenant' | 'Other'
>
