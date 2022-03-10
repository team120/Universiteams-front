# Universiteams-front
Pro Scientific Dissemination &amp; Volunteering

## Getting started

Clone this repository, then open it with a code editor and execute the command `npm install`.

> If the dependencies are not installed with the above command, you must install [Node.js](https://nodejs.org/es/) on your machine.

## Run a server

To run a server on _development mode_ you need to execute:

```bash
npm run dev
# or
yarn dev
```

To be able to visualize the dev server running, you must open [http://localhost:3000](http://localhost:3000/).

> By default, the utilized port will be 3000, but this can be configured and changed for other port.

To build the system for production you must execute:

```bash
npm run build
# or
yarn build
```

To run a server on _production mode_ you need to execute:

```bash
npm start
# or
yarn start
```

## Repository edit

The repository's root path is `pages/index.tsx`. All folder structures and page files within are automatically routed and converted to equivalently named _endpoints_. When changes are made to a file, the open server is automatically updated when the changes are saved.

Each new component must be created inside the `components` folder. These are server-side rendered when they are called on any of the pages. Suppose we have a component called "Dropdown", it will be rendered on a page that contains the `<Dropdown />` tag.

The `pages/api` subfolder is mapped to the path `/api/*`. The files in this folder are taken by Next as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. To access any route API, the respective endpoint must be placed. Example, for the file `pages/api/test.ts`, the path [http://localhost:3000/api/test](http://localhost:3000/api/test) corresponds to it.

## Documentation about Next.js

Important and interesting documentation of Next.js can be consulted at:

-   [Nextjs.org/docs](https://nextjs.org/docs) - Features and functionalities of Next.js
-   [Nextjs.org/learn](https://nextjs.org/learn) - Interactive tutorial about Next.js

## Tech stack
### Common
|Tool|
|:-|
|:ballot_box_with_check: TypeScript / JavaScript |
|:ballot_box_with_check: JWT|

### Backend
|Tool|
|:-|
|:ballot_box_with_check: Node.JS|
|:ballot_box_with_check: Express|
|:ballot_box_with_check: TypeORM|
|:ballot_box_with_check: PostgreSQL|

### Frontend
|Tool|
|:-|
|:ballot_box_with_check: React|
|:ballot_box_with_check: Next.JS|
|:ballot_box_with_check: HTML5 / CSS3 / SASS|

## Authors
|Name|GitHub Account|
|:-|:-|
|Recalde, Alejandro|:octocat: https://github.com/alereca|
|Antonelli, Nicolás|:octocat: https://github.com/NicoAntonelli|
|Acciarri, Joshua|:octocat: https://github.com/JAcciarri|
