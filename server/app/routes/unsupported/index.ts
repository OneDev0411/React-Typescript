import { Request, Response } from 'express'

const template = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Rechat | Unsupported Browser</title>
  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
  <style>
    body {
      font-family: 'Barlow', sans-serif;
    }

    .wrapper {
      text-align: center;
      margin-top: 10%;
    }

    .logo {
      width: 250px;
      height: auto;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <img src="https://app.rechat.com/static/images/logo.svg"
      class="logo"
      alt="Rechat Logo" />
    <h1>Sorry. Your browser is not supported by Rechat.</h1>
    <h2>For the best experience on Rechat, we recommend using Chrome.</h2>
    <h2>
      <a href="https://www.google.com/chrome/">Get Chrome</a>
    </h2>
  </div>
</body>

</html>`

export default async (req: Request, res: Response) => {
  res.set('content-type', 'text/html; charset=utf-8')
  res.send(template)
}
