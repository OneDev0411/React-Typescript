import { Request, Response, NextFunction } from 'express'

import { decrypt } from '../../../utils/crypto'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { token: encryptedToken } = req.query

  if (!encryptedToken) {
    res.redirect('/404')

    return
  }

  try {
    let { token, email } = JSON.parse(decrypt(encryptedToken as string))

    return res.redirect(
      `/password/reset?token=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(email)}`
    )
  } catch (error) {
    console.log(error)

    return res.redirect('/oops')
  }
}
