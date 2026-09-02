```
    ___    _       ___     ____    ___
   | _ \  | |     /   \   |_  /   /   \
   |  _/  | |__   | - |    / /    | - |
  _|_|_   |____|  |_|_|   /___|   |_|_|
_| """ |_|"""""|_|"""""|_|"""""|_|"""""|
"--0-0-'"--0-0-'"--0-0-'"--0-0-''"--0-0-'
```

# Welcome to the SFA Plaza

This is a web app and API backend for working with calls to action (CTAs). CTAs are prompts to the Streets For All community to reach out to the appropriate legislators/representatives for specific issues.

## Structure

### Web app

The web app is a browser-based tool for interacting with CTAs, which consist of:

- An email template (recipients, CC, BCC, subject, body) for reaching out to legislators/representatives about the issue at hand, distilled into a "mailto" link, which when clicked on, automatically opens the email client and prepopulates the email
- A landing page that can be shared with community members, containing a brief overview of the issue at hand as well as the contact information of their legislators/representatives, including the aforementioned "mailto" link

The web app is divided into the following sections:

#### Editor

The editor is used by Streets For All staff and volunteers to create and configure CTAs. This includes settings for both the email template ("mailto" link) and the landing page.

#### Landing page

The landing page is generated using the settings from the editor and can be shared with community members / advocates. Depending on the configuration, the landing page can include a geolocator, whereby the advocate enters their address to determine their specific representative(s).

### API

The `api/` directory contains API endpoints that can be called by other web clients.

Currently its primary endpoint is `/cta`, which is called by the main Streets For All website to retrieve the latest Mailchimp campaign for the banner at the top. Note that this is independent from the CTAs in the web app, although they can be used in conjunction (i.e., send a Mailchimp email that contains a link to the web app landing page that has a "mailto" link to open up the email template for reaching out to the appropriate legislator).

## Database

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
