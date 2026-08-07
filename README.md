```
    ___    _       ___     ____    ___
   | _ \  | |     /   \   |_  /   /   \
   |  _/  | |__   | - |    / /    | - |
  _|_|_   |____|  |_|_|   /___|   |_|_|
_| """ |_|"""""|_|"""""|_|"""""|_|"""""|
"--0-0-'"--0-0-'"--0-0-'"--0-0-''"--0-0-'
```

## Welcome to the SFA Plaza

This is a web app and API backend for working with calls to action (CTAs). CTAs are prompts to the Streets For All community to reach out to the appropriate legislators/representatives for specific issues.

### Structure

The web app is for creating CTAs, which consist of a landing page that can be shared with community members, and a "mailto" link, which when clicked on, automatically opens the community member's email client and prepopulates the email.

The web app is divided between the editor, which Streets For All staff and volunteers can use to configure all the elements above, and the aforementioned public-facing landing page.

The `api/` directory contains API endpoints that can be called by other web clients, the primary one being the `/cta` endpoint, which is called by the main Streets For All website to retrieve the latest Mailchimp campaign for the banner at the top.

### Database

Saved email templates are stored in MongoDB using [Prisma](https://www.prisma.io/orm). Update the connection string in the `DATABASE_URL` environment variable.

Prisma is comprised of three main elements:

1. **Prisma CLI:** Lets you run the `npx prisma` command below in your terminal
2. **Prisma Schema:** The `schema.prisma` file that reflects the database fields and their types
3. **Prisma Client:** Based on the schema, Prisma generates this JavaScript client/SDK that allows for the database operations along with respective types in our code.

To update fields, edit the `prisma/schema.prisma` file. See [here](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-fields) for a guide and [here](https://www.prisma.io/docs/orm/reference/prisma-schema-reference) for a full reference of field types.

Then run the following:

```sh
npx prisma db push
```

This applies the schema changes to the database and regenerates the Prisma Client.

> [!WARNING]
> Apparently not all changes are always applied to the database, so always double-check and update it directly if required.

_(For other, relational databases, Prisma requires you to create a [migration](https://www.prisma.io/docs/orm/prisma-migrate) for each round of changes you make to the schema, but this isn't required for MongoDB.)_
