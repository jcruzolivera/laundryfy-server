require('dotenv').config();
const cors = require('cors');
const express = require('express');
const dbConnection = require('../database/dbConnection');

class Server {
  constructor () {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: '/api/auth',
      orders: '/api/orders',
      stateOrders: '/api/stateOrders',
      customers: '/api/customers',
      products: '/api/products',
      pricelists: '/api/pricelists',
      users: '/api/users',
      login: '/api/login',
      signUp: '/api/signup',
      roles: '/api/roles'
    };

    this.connectDB();

    this.middlewares();

    this.routes();
  }

  async connectDB () {
    await dbConnection();
  }

  middlewares () {
    this.app.use(cors());
    this.app.use(express.static('public'));
    this.app.use(express.json());
  }

  routes () {
    //  Auth
    this.app.use(this.paths.auth, require('../routes/auth'));

    //  Customers
    this.app.use(this.paths.customers, require('../routes/customers'));

    //  Pricelists
    this.app.use(this.paths.pricelists, require('../routes/pricelists'));

    //  Products
    this.app.use(this.paths.products, require('../routes/products'));

    //  Orders
    this.app.use(this.paths.orders, require('../routes/orders'));

    //  Roles
    this.app.use(this.paths.roles, require('../routes/roles'));

    //  Users
    this.app.use(this.paths.users, require('../routes/users'));

    //  StateOrdes
    this.app.use(this.paths.stateOrders, require('../routes/stateOrders'));
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log('listening on port', this.port);
    }
    );
  }
}

module.exports = Server;
