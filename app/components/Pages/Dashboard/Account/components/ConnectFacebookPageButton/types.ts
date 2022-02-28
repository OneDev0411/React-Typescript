export interface FacebookResultMessagePayloadBase<TType extends string> {
  type: TType
}

export interface FacebookResultMessagePayloadSuccess
  extends FacebookResultMessagePayloadBase<'success'> {}

export interface FacebookResultMessagePayloadError
  extends FacebookResultMessagePayloadBase<'error'> {
  errorCode: FacebookAuthErrorCode
}

export type FacebookResultMessagePayload =
  | FacebookResultMessagePayloadSuccess
  | FacebookResultMessagePayloadError

export type FacebookAuthErrorCode =
  | 'OAuthException'
  | 'Unauthorized'
  | 'FacebookPageIsNotConnected'
  | 'InstagramIsNotConnected'
  | 'Unknown'
