import algosdk from 'algosdk';

let client: null | algosdk.Algodv2 = null;

export function setupClient() {
  if (client == null) {
    const token = {
      'x-api-key': 'uwMK5eEd2i52PCM6FOVGY2rQTA5gy0pr52IOAREF',
    };
    const server = 'https://testnet-algorand.api.purestake.io/ps2';
    const port = '';
    const algodClient = new algosdk.Algodv2(token, server, port);
    console.log('algodClient', algodClient);
    client = algodClient;
  } else {
    return client;
  }
  return client;
}
