<!-- <p align="center">
  <a href="#" target="_blank"><img src="#" width="200" alt="logo" /></a>
</p> -->

<p align="center">
  <a href="#" target="_blank">NestJS App</a> built using Nest framework with Typescript & Postgres database.
</p>

## Description

To be specified.

## Installation

_Note: Skip this section for docker based production deployment_

```bash
# install dependencies
$ npm install
```

## Setup

Copy the contents of example.env to create .env in the root and update env variables to set server configuration to run.

First you need to run and initialize databases.

> For non docker environment

`DATABASE_URL`, `REDIS_URI` in .env will be use to connect with databases, Please make sure you have correct connection uri here.

```bash
# development
$ npm run db:init

# production
$ npm run db:migrate:deploy
$ npm run db:seed
```

> For docker environment

_Note: If you already have running required database containers then you can follow same setup as mentioned above for non docker environment._

`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`, `REDIS_PORT`, `REDIS_PASSWORD` will be use to create database containers with authentication credential from .env, So make sure `DATABASE_URL` and `REDIS_URI` have exact same user, password and port for connection.

To run production database containers you need to set `POSTGRES_DATA_VOLUME` and `REDIS_DATA_VOLUME` value to be set in .env file to mount the volume into host machine.

```bash
# development
$ npm run dev:db
$ npm run db:init

# production
$ npm run prod:db
$ npm run db:migrate:deploy
$ npm run db:seed
```

For convenience to switch between docker environment to local environment & testing, Please create host entry in your machine with following:-

```
127.0.0.1 postgres
127.0.0.1 redis
```

## Run the server in docker container

```bash
# development
$ npm run dev
$ npm run dev:stop # To shut down containers

# production
$ npm run prod
$ npm run prod:stop # To shut down containers
```

## Run the server in local machine

```bash
# development
$ npm run start:dev

# production
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrate/Sync Database Schema

```bash
# initialize database - push schema, add constraints & seed database
$ npm run db:init

# preview schema
$ npm run db:studio

# seed database
$ npm run db:seed

# seed specific seed file into the database
$ npm run db:seed:only <name> # i.e. `npm run db:seed:only admin` to run prisma/seeds/admin.seed.ts

# add constraints in schema (Note: Not required, If not using `db:schema:push` on staging or production env)
$ npm run db:schema:constraints

# add constraints for the specific table
$ npm run db:schema:constraints:only <table name> # i.e. `npm run db:schema:constraints:only user` to add constraints into the user table

# generate client with schema
$ npm run db:client:generate

# push schema changes to the database without migration
$ npm run db:schema:push

# generate migration for new changes
$ npm run db:migration:create

# generate migration for new changes & deploy
$ npm run db:migrate:dev

# reset database
$ npm run db:migrate:reset

# deploy all migrations
$ npm run db:migrate:deploy
```

## API Documentation

```bash
# development
http://localhost:{PORT}/api-spec

# production
{API_URL}/api-spec
```

## Monitoring

To enable metrics server update `.env` file with below variables -

```bash
ENABLE_METRICS=true
METRICS_PORT=8080
METRICS_HOST=0.0.0.0
```

Copy `example.env` file & create `.env` file in `monitoring` directory. Then use below command to start/stop monitoring tools `Prometheus` & `Grafana`

```bash
# start
$ npm run monitoring

# stop
$ npm run monitoring:stop
```

To access `Grafana` & `Prometheus` navigate to below urls -

```bash
# Grafana
http://127.0.0.1:{GFAFANA_PORT}

# Prometheus
http://127.0.0.1:{PROMETHEUS_PORT}

```

# Documentation liberary-management


Book Module Features

Implemented full CRUD APIs for managing books:

Create Book API
Get All Books API
Get Book By ID API
Update Book API
Delete Book API

The module manages complete book information such as title, author, category, language, shelf number, total copies, and available copies.
Also implemented validation, exception handling, and stock management logic.
---
✅ Rental Module Features

Implemented APIs for managing rented books:

Create Rent Book API
Get All Rented Books API
Get Rented Book By ID API
Return Rented Book API
User Rental History API

The rental system tracks:

Which user rented which book
Issued librarian details
Rent date and due date
Returned book status
Total books rented by a user

Also implemented logic to automatically decrease available copies when a book is rented and increase available copies when the book is returned.
---

# Books API Structure
Create Book
API Path
 POST ->  book/create

Request Body
```base
{
  "title": "Atomic Habits",
  "description": "Self improvement book",
  "author": "James Clear",
  "publishedYear": 2018,
  "category": "Programming",
  "language": "Hindi",
  "totalCopies": 20,
  "shelfNumber": 12,
  "status": "Available"
}
```


GET Books
API Path
 GET ->  book


Get Book By ID
API PATH
GET -> book/:id

Update Book
API Path
  /books/:id

```base
request body
{
  "title": "string",
  "description": "string",
  "author": "string",
  "publishedYear": 0,
  "category": "Fiction",
  "language": "English",
  "totalCopies": 0
}
```

  Delete Book
Method-->  DELETE
API Path
/books/:id



# Rental Book API Structure
Create Rental Book

API Path
POST -> rent-book
Request Body

{
  "userId": 1,
  "bookId": 2,
  "dueDate": 4
}

Get All Rented Books
API Path
GET -> rent-book


Get User Rental History
API Path
GET -> rent-book/history
Example
GET -> rent-book/history?userId=1
Request Body{}


Get Rental Book By ID
API Path
GET -> rent-book/:id
Example
GET -> rent-book/1

Return Rented Book
API Path
PATCH -> rent-book/return/:id
Example
PATCH -> rent-book/return/1

request body 
Param(id)