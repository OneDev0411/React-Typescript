#Rechat Web App

#####Stack
This is the Rechat application for Web (Desktop version). It is a universal React application that renders both on the server side and on the client side.

It uses the following:
1. [Koa](https://koajs.com) for server side rendering
2. [React](https://facebook.github.io/react/) for UI views
3. [Redux](https://github.com/reactjs/redux) for state managing

#####Install
```bash
git clone git@gitlab.com:rechat/web.git
cd web
npm install
```

#####Start Dev Server
```bash
npm run develop
```
Go to [http://localhost:8080](http://localhost:8080)

#####Run app tests by Jest
```bash
npm run test:app
```

#####Run E2E tests
```bash
npm run setup-e2e
npm run test:e2e
```