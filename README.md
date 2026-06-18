```
    ___    _       ___     ____    ___   
   | _ \  | |     /   \   |_  /   /   \  
   |  _/  | |__   | - |    / /    | - |  
  _|_|_   |____|  |_|_|   /___|   |_|_|  
_| """ |_|"""""|_|"""""|_|"""""|_|"""""| 
"--0-0-'"--0-0-'"--0-0-'"--0-0-''"--0-0-' 
```

## Welcome to the SFA Plaza

this is a landing page and backend we can use for hosting tools and projects that don't require their own URLs

Pushing to the **main** branch deploys straight to: https://plaza.streetsforall.org


### to preview locally run:  

`npm start`   
*this starts the node js server*

`cd frontend`   
`npm start`   
*this starts the react app*

### structure

All backend endpoints are prefaced with '/api'.

projects structure looks like:  
> BACKEND: 
> node express app with api endpoints
> > frontend: react app with pages/tools

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
