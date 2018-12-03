# zetapush-projects-overview

The goal of this project is to develop a dashboard for developers, to allow them to have a simplified view of their projects through different tools (GitHub, Jenkins, Jira).

## Installation

```console
npm install
```

## Deployment

Push your code on ZetaPush platform

```console
npm run deploy
```

## Development

Run your code on your local platform

```console
npm run start
```

## Project structure

```console
.
└──
  ├── src (Angular application)
  ├── worker
  │  ├── api.js (export function which call APIs and merge data)
  │  └── index.ts (api implementation)
  └── package.json
```

## Zetapush Worker

* `worker/index.ts` is the "back-end" part of the project, in charge of :
- requesting api (github, jira, jenkins)
- send data via websockets to all clients with [ZetaPush](https://github.com/zetapush/zetapush).