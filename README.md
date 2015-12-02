#Rechat Web

#####About
This is the Rechat application for web and desktop.  It is a universal React application that renders both on the server side and on the client side.

It uses the following:
1. [React](http://facebook.github.io/react/) for UI views
2. [Express](http://expressjs.com/) for server side rendering
3. [React Router](https://github.com/rackt/react-router) for routing
4. [Flux](https://facebook.github.io/flux/) for data flow
5. [Bootstrap](http://getbootstrap.com/) for responsive grid, UI elements, etc
6. [Socket.io](http://socket.io//) for realtime data / chat
#####Install
```
git clone https://bitbucket.org/rechat/web
cd web
npm i
```
#####Configure
Set `api.url` in config/private.js:
```javascript
api: {
  url: "http://localhost:3078",
  client_id: "bf0da47e-7226-11e4-905b-0024d71b10fc",
  client_secret: "secret"
},
```
Set `app.url` config/public.js:
```javascript
app: {
  url: "http://localhost:3078",
},
```
#####Run webpack dev
```
npm run dev
```
Go to [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server)
#####Run production
```
npm run prod
```
Go to [http://localhost:3000](http://localhost:3000)
#####Run tests
```
npm test
```