# Zetapush Worker

**index.ts** is the "back-end" part of the project, in charge of :
- requesting api (github, jira, jenkins)
- send data via websockets to all clients with [ZetaPush](https://github.com/zetapush/zetapush).

## Usage :

First, install dependencies : ```npm install```

Now run :
- localy  ``` npm run start ```
- remotly ``` npm run deploy ```
