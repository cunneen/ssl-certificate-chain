export type SSLCertChainOptions = {
  /** The URL to fetch the certificate chain from */
  url: string;
  /** The port to connect to, as a string (default: "443") */
  port: string;
  /** The output file to write the certificate chain to (default: chain.pem) */
  outputFile: string;
  /** Skip outputting the SSL certificate obtained from the URL specified by -u (default: false) */
  skipWebsiteCert: boolean;
  /** The output folder to write the certificate chain to (default: ${CWD}/output/) */
  outputDir: string;
}