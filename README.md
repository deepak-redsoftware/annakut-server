# ANNAKUT Backend

> A system to help annakut stakeholders in tracking donations.

## API Documentation

Postman API documentation is published [here](https://documenter.getpostman.com/view/30171331/2s9YJaZQ3N).

### Env Variables

Create a `.env` file and add the following variables:

```
PORT=4000
MONGO_URI=<enter_connection_string_here>
SALT_ROUNDS=<enter_value_here>
NODE_ENV=<development | production>
JWT_SECRET=<enter_secret_here>
```

### Install Dependencies

```
npm install
```

### Run

#### Change DB connection string as well

#### Start Dev Server

```
npm run dev
```

#### Start Production Server

```
npm start
```
