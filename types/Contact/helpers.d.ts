declare interface TNormalizeContactAttribute<C extends IContact> {
  (contacts: ApiResponse<C[]>): C[]
}

declare interface TNormalizeContacts<C extends IContact> {
  (contacts: ApiResponse<C[]>): { entities: { contacts: C[] } }
}
