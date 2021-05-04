declare interface IBaseShowing {
  brand: UUID
  title: string
  slug: string
  notice_period: Nullable<number>
  start_date: string
  end_date?: string
  duration: number
  same_day_allowed: boolean
  availabilities: IShowingAvailability[]
  listing: Nullable<IListing>
}
