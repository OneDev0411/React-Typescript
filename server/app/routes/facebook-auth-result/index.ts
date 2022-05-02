import { Request, Response } from 'express'

function postMessageAndCloseWindow(
  type: 'error' | 'success',
  data?: object
): string {
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
        window.close();
      </script>
    `
}

export default async (req: Request, res: Response) => {
  if (req.query.error) {
    return res.send(
      postMessageAndCloseWindow('error', {
        errorCode: req.query.error,
        errorMessage: req.query.msg
      })
    )
  }

  return res.send(postMessageAndCloseWindow('success'))
}
