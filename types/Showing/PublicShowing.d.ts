declare interface IPublicShowing
  extends IModel<'showing_public'>,
    IBaseShowing {
  id: number
  unavailable_times: string[] | null
  agent: Optional<IShowingAgent | IAgent>
  timezone: string
  timezone_offset: number
}
