# Annotations Service

This repo contains an experimental AdonisJS application for the Web Annotations Protocol and how this may be used together with ActivityPub.

## What's used

- Everything you get with the core of [AdonisJS](https://adonisjs.com).
- ESLint and Prettier setup extending the [AdonisJS tooling config](https://github.com/adonisjs/tooling-config) presets.
- Ace command line framework.

On top of the framework core and dev-tooling, the following features are enabled:

- Lucid ORM
- Session management
- CSRF protection
- Edge template engine
- VineJS for validations
- Static files server
- Vite for bundling and serving frontend assets

In the future we will be using:
- Auth module ( Installed, but not configured / adapted for content-negotiation )
- [Fedify](https://fedify.dev), if we want to publish Annotate activities to the Fediverse

## Usage

- Clone the repo
- Install dependencies
- Copy `.env.example` to `.env` and fill in the values
- Set app key using `node ace generate:key` command.
- Create a postgresql database `CREATE DATABASE annotations_development;`
- Run the migrations: `npm run db:migrate` or `npm run db:fresh` (this will recreate the database)
- Start the server: `npm run dev`

### Console

You can also interact with the database through the console using `npm run console`

To load the database models: `await loadModels()`, then you can access them as `models.<name>`

For example, to create a `User`: `await models.user.create({ email: 'example@example.org', 'password': 'super-secret-password'})`

To create an Annotation:

```
const user = await models.user.findBy({ email: 'example@example.org' })
await models.annotation.create({ creatorId: user.id, content: 'Hello Annotations!', targetIri: 'http://example.org' })
```

### API

When `application/ld+json` is written below, we mean `application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"` specifically.

```
METHOD ROUTE
GET    /annotations (annotations.index)                                   application/ld+json (html not implemented yet)
GET    /annotations/:id (annotations.show)                                application/ld+json (html not implemented yet)
GET    /annotations/:collectionId/annotation/:id (annotation.show)        application/ld+json (html not implemented yet)

Not yet implemented:

POST   /annotations (annotations.store)                                   application/ld+json multipart/form-data
GET    /annotations/create (annotations.create)                           html
POST   /annotations/:collectionId (annotations.store)                     application/ld+json multipart/form-data
GET    /annotations/:collectionId/annotation/:id/edit (annotation.edit)   html
PUT    /annotations/:collectionId/annotation/:id (annotation.update)      application/ld+json multipart/form-data
PATCH  /annotations/:collectionId/annotation/:id (annotation.update)      application/ld+json multipart/form-data
DELETE /annotations/:collectionId/annotation/:id (annotation.destroy)     redirect
```
