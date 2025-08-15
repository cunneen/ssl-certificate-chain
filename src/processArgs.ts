import minimist from 'minimist';
import path from 'node:path';
import type { SSLCertChainOptions } from './SSLCertChainOptions';
import anylogger from 'anylogger';
const logger = anylogger('ssl-certificate-chain:processArgs');

export function usage() {
  console.log("Usage: ssl-certificate-chain [-u] <url> [-p <port>] [-o <outputFile>]");
  console.log("  Downloads the SSL certificate from an HTTPS website, obtains the certificate chain and writes the chain as a PEM file.");
  console.log("  -u <url>        The URL to fetch the certificate chain from");
  console.log("  -p <port>       The port to connect to (default: 443)");
  console.log("  -o <outputFile> The output file to write the certificate chain to (default: chain.pem)");
  console.log("  -d <outputDir>  The output folder to write the certificate chain to (default: ${CWD}/output/)");
  console.log("  -s <true|false> Skip outputting the SSL certificate obtained from the URL specified by -u (default: false)");
}

/**
 * Processes the command line arguments and returns an object with the
 * URL, port and output file. If the arguments are invalid, it prints
 * a usage message and exits with a status code of 1.
 */
export function processArgs(): SSLCertChainOptions {
  const argv = minimist(process.argv.slice(2));
  logger.debug("argv:", argv);
  let url = argv.u;
  if (!url) {
    if (argv._.length === 1) {
      url = argv._[0];
    } else {
      usage();
      process.exit(1);
    }
  }
  // check if the URL starts with https://
  if (!url.startsWith("https://")) {
    url = "https://" + url;
  }
  const port = argv.p || "443";
  if (isNaN(Number.parseInt(port))) {
    console.error("Port must be a number");
    process.exit(1);
  }
  const outputFile = argv.o || "chain.pem";

  let skipWebsiteCert = false;
  if (argv.s === "true") {
    console.log(`Skipping output for ${url}`);
    skipWebsiteCert = true;
  }

  let outputDir = path.resolve(path.join(process.cwd(), "output"));
  if (argv.d) {
    outputDir = path.resolve(argv.d);
  }

  return { url, port, outputFile, skipWebsiteCert, outputDir };

}