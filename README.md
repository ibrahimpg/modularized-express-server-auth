# modularized-express-server-auth
The portion of the server that signs new JWT and verifies JWT attempting to access protected routes.

# modularized-express-server-registration
The portion of the server handling user registration, login, and a few other things.

## Architecture

Multi-server Express.js back-end

1. Auth server for signing/verifying JWT.
***
2. Registration server for creating, logging in to, deleting, and verifying emails of users. User fields that are not email, password, username are populated with placeholder.
***
3. Patch server for updating allowable fields that were populated with placeholder stuff in the registration server.
***
4. More servers as needed. A shop cart server for example.

## Personal Notes

MongoDB Atlas can be thought of as having the following structure:

project -> cluster -> database -> collection -> documents

In the MongoClient.connect logic, we connect to a cluster via the MongoDB URI.
We then select a database from the cluster and assign it to a variable.
In this case we assign the database named 'database' to the variable 'db'.
If the database doesn't exist, it will be created when we perform a CRUD operation.
We then export 'db' for use in other files.
We interact with collections within the database through our route logic.
For example: database.db().collection('users').find({ some route logic })
This is from our register.js file. The 'database' part is simply the variable name
we have attached to any exports from index.js. The .db() part is the one that uses
the specific variable that we have exported containing our database.

const { MongoClient } = require('mongodb');
is simply a destructured version of:
const MongoClient = require('mongodb').MongoClient;
ESLint with the Airbnb style guide prefers this.