// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

var serverEndpoint = 'http://localhost:4040'
var webSocketEndpoint = 'ws://localhost:4040/connect'

export const environment = {
  production: false,
  webSocketServer: webSocketEndpoint,
  apiServer: serverEndpoint,
  scanWebsocket: webSocketEndpoint + '/scan',
  bulkUpdateWebsocket: webSocketEndpoint + '/bulk',
  burnDownSocket: webSocketEndpoint + '/burnDown'
};
