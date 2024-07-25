const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://tinder.com";

app.use(cors());
app.use(morgan('dev'));

app.use('/', proxy(API_SERVICE_URL, {
   userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
      let body = proxyResData.toString('utf8');
      body = body.replace(/https:\/\/[^.]+\.gotinder.com/g, (match) => {
         return match.replace('https://', 'http://').replace('gotinder.com', 'vm597841.eurodir.ru');
       });
       
      
      return body;
   }
}));

app.listen(PORT, HOST, () => {
   console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
