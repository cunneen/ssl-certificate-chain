import https from 'https';
import http from 'http';

import anylogger from "anylogger";
const logger = anylogger('ssl-certificate-chain:httputils');

/**
 * Perform an HTTPS GET request and return the response as a Buffer.
 * @param url - The URL to request.
 * @returns A promise which resolves with the response body as a Buffer.
 */
function httpsGetAsync(url: string): Promise<Buffer<ArrayBuffer>> {
  const parsedURL = new URL(url);
  const httpLib = parsedURL.protocol === 'https:' ? https : http;
  const data: any[] = [];
  return new Promise((resolve, reject) => {
    httpLib.get(url, (res) => {
      logger.debug(`got http status code ${res.statusCode} from ${url}`);
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`Request failed with status code ${res.statusCode}`));
      }
      // logger.info(res.headers);
      res.on('data', (chunk) => {
        data.push(chunk);
      });
      res.on('end', () => {
        resolve(Buffer.concat(data));
      });
    });
  });
}

/**
 * Downloads a certificate from a URL and returns its contents as a Buffer.
 * @param url - The URL to download the certificate from.
 * @returns A promise which resolves with the certificate contents as a Buffer.
 */
async function downloadAndParseCert(url: string): Promise<Buffer<ArrayBuffer>> {
  logger.debug(`downloading ${url}`);
  const certResponse = await httpsGetAsync(url);
  return certResponse;
}

export { httpsGetAsync, downloadAndParseCert };