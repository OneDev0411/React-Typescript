declare interface IPublicShowing
  extends IModel<'showing_public'>,
    IBaseShowing {
  id: number
  unavailable_times: string[] | null
  agent: IShowingAgent
  timezone: string
  timezone_offset: number
}
