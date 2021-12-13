interface Props {
  url: string
}

export function VideoThumbnail({ url }: Props) {
  return (
    <video autoPlay muted controls={false}>
      <source src={url} />
    </video>
  )
}
