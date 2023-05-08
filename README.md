# Wise API

## Technologies

- Cloud Functions (Node 10)
  - [Function Framework](https://github.com/GoogleCloudPlatform/functions-framework-nodejs) for local development.
- TypeScript
  - Google Cloud Functions Server (Express): https://www.npmjs.com/package/@types/express

## Develop

First install dependencies:

```sh
npm i
```

Then in one tab continually build the project with this command:

```sh
npm run build
```

In another tab, start the web server (and watch if the source code changes):

```sh
API_KEY=<KEY> npm run watch
```

This uses [`npm-watch`](https://www.npmjs.com/package/npm-watch) with the [`functions-framework`](https://www.npmjs.com/package/@google-cloud/functions-framework) to auto re-build the server after changes.

### Test locally

Go to `http://localhost:8080` to run your Google Cloud Function locally.

```
http://localhost:8080/conversations
```

### API Key

To create an API key, use the Cloud Console credentials page:

https://console.cloud.google.com/apis/credentials

More detailed instructions can be found in the ["Get API Key" guide](https://developers.google.com/maps/documentation/javascript/get-api-key#detailed_guide).

### Deploy

You must create a `.env.yaml` with your API Key:

```env
API_KEY=
```

You can deploy this project to Google Cloud Functions by running the following script:

```sh
gcloud config set project $MY_PROJECT
sh deploy.sh
```
