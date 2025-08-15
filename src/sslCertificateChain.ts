import getSSLCertificate from 'get-ssl-certificate';
// import fs from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { downloadAndParseCert } from './httputils';
import { Cert } from './Cert.class'
import type { PeerCertificate } from 'tls';
import anylogger from "anylogger";
import type { SSLCertChainOptions } from './SSLCertChainOptions';
const logger = anylogger('ssl-certificate-chain:sslCertificateChain');

type GetSSLCertificateResponse = PeerCertificate & {
  pemEncoded: string
}

/**
 * Downloads and saves the SSL certificate chain for a given URL.
 * 
 * @param options - An options object
 * 
 * @throws Will throw an error if the URL is invalid or if there is a failure
 *         in downloading or writing the certificates.
 */

export async function sslCertificateChain(options: SSLCertChainOptions) {
  try {

    logger.debug("logging is set up");
    logger.debug("options:", options);
    const certChain: string[] = [];

    const { skipWebsiteCert, outputDir, outputFile, port } = options;

    if (!URL.canParse(options.url)) {
      throw new Error(`invalid URL: ${options.url}`);
    }
    const url = new URL(options.url);
    // get the server's certificate
    logger.debug(`getting certificate for ${url.hostname}:${port}`);
    const cert: GetSSLCertificateResponse = await getSSLCertificate.get(url.hostname, 5000, Number.parseInt(port));

    let certInstance = new Cert();

    // chilkatCert.VerboseLogging = true;
    const loadedOK = certInstance.loadFromBinary(cert.raw);

    if (loadedOK) {
      if (!skipWebsiteCert) {
        const pemData = certInstance.getPem();
        if (pemData) {
          certChain.push();
          logger.debug(`added cert from ${url.hostname} to chain`);

        }

      }

      let isRoot = certInstance.isRoot();
      const MAX_ITERATIONS = 100;
      let count = 0;
      while (!isRoot && count < MAX_ITERATIONS) {

        // get the issuer URL
        const issuerURL = certInstance.getIssuerCertURL();
        // check that we can parse the issuerURL as a URL
        if (!URL.canParse(issuerURL)) {
          throw new Error(`invalid issuer URL: ${issuerURL}`);
        }

        // get the issuer's cert
        logger.debug(`getting certificate for ${issuerURL}`);
        const issuerCertBuffer = await downloadAndParseCert(issuerURL);
        // clear the chilkat cert
        certInstance.reset();
        certInstance.loadFromBinary(issuerCertBuffer);
        isRoot = certInstance.isRoot();

        logger.debug(`added cert from ${issuerURL} to chain`);
        // add this cert to the chain
        const pemData = certInstance.getPem()
        if (!pemData) {
          throw new Error(`failed to get PEM data for ${issuerURL}`);
        }
        certChain.push(pemData);

        count++;
        if (count > MAX_ITERATIONS) {
          throw new Error("max iterations reached");
        }

      }
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputFileFullPath = path.resolve(path.join(outputDir, outputFile));

    logger.debug(`writing certificate chain to ${outputFileFullPath}`);
    fs.writeFileSync(outputFileFullPath, certChain.join("\n"), { encoding: "utf-8" });

  } catch (error) {
    // log and re-throw
    logger.error(error);
    throw error;
  }
}
