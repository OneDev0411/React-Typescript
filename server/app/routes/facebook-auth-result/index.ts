import { Request, Response } from 'express'

function postMessage(type: 'error' | 'success', data?: object): string {
  const baseMessage = {
    source: 'facebook-auth-result',
    payload: {
      type,
      ...data
    }
  }

  return `
      <script>
        window.opener.postMessage(${JSON.stringify(baseMessage)}, "*");
      </script>
    `
}

export default async (req: Request, res: Response) => {
  if (req.query.error) {
    return res.send(postMessage('error', { errorCode: req.query.error }))
  }

  return res.send(postMessage('success'))
}
