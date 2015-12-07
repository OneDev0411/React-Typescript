#Rechat Web

#####About
This is the Rechat application for web and desktop.  It is a universal React application that renders both on the server side and on the client side.

It uses the following:
1. [React](http://facebook.github.io/react/) for UI views
2. [Express](http://expressjs.com/) for server side rendering
3. [React Router](https://github.com/rackt/react-router) for routing
4. [React Hot Loader](https://github.com/gaearon/react-hot-loader) for hot loading in development
5. [Flux](https://facebook.github.io/flux/) for data flow
6. [Bootstrap](http://getbootstrap.com/) for responsive grid, UI elements, etc
7. [Socket.io](http://socket.io//) for realtime data / chat
#####Install
```
git clone https://bitbucket.org/rechat/web
cd web
npm install
```
#####Run webpack dev
```
npm run development
```
Go to [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server)
#####Run staging
This uses the dev config, renders server side and removes dev features like hot reloader.
```
npm run staging
```
Go to [http://localhost:3000](http://localhost:3000)
#####Run production
```
npm run production
```
Go to [http://localhost:3000](http://localhost:3000)
#####Run tests
```
npm test
```