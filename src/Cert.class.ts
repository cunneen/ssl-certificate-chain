import chilkat from "ck-node24-wrapper";
import * as cheerio from 'cheerio';


/**
 * A certificate; initially a wrapper of the Chilkat Cert class
 */
export class Cert {
  _certInstance: typeof chilkat.Cert;

  constructor() {
    this._certInstance = new chilkat.Cert();
  }

  /**
   * Loads a certificate from binary data.
   * @param data Binary data representing the certificate.
   * @return true if the certificate was loaded successfully.
   */
  loadFromBinary(data: Buffer): boolean {
    return this._certInstance.LoadFromBinary(data);
  }

  /**
   * Gets the certificate in PEM format.
   * @return The certificate in PEM format as a string.
   */
  getPem(): string | null {
    return this._certInstance.ExportCertPem();
  }

  /**
   * Is this certificate self-signed (i.e. is it the root of the chain)?
   * @return true if the certificate is self-signed, false otherwise.
   */
  isRoot(): boolean {
    return this._certInstance.IsRoot;
  }

  /**
   * Unloads the certificate data.
   * @return true if the certificate was unloaded successfully.
   */
  reset() {
    return this._certInstance.Unload();
  }

  /**
   * Retrieves the URL for the issuer's certificate.
   * The function extracts and decodes the issuer's certificate URL from the certificate's extension data.
   * It parses the extension data to find the appropriate OID and decodes the base64-encoded URL.
   * 
   * @return The issuer's certificate URL as a string.
   */

  getIssuerCertURL(): string {
    // figure out the URL for the issuer's own cert
    const issuerInfoXml = this._certInstance.GetExtensionAsXml('1.3.6.1.5.5.7.1.1')?.replace(/[\n\r]/g, '');
    // console.log(`issuer info xml: ${issuerInfoXml}`);
    /*
      The issuer info XML will be like:
      <sequence>
        <sequence>
          <oid>1.3.6.1.5.5.7.48.2</oid>
          <contextSpecific tag="6" constructed="0">
            aHR0cDovL2NydC5zZWN0aWdvLmNvbS9TZWN0aWdvUHVibGljU2VydmVyQXV0aGVudGljYXRpb25Sb290UjQ2LnA3Yw==</contextSpecific>
        </sequence>
        <sequence>
          <oid>1.3.6.1.5.5.7.48.1</oid>
          <contextSpecific tag="6" constructed="0">aHR0cDovL29jc3Auc2VjdGlnby5jb20=</contextSpecific>
        </sequence>
      </sequence>

      Which, if we base64-decode the text nodes, will be like:
      <sequence>
        <sequence>
          <oid>1.3.6.1.5.5.7.48.2</oid>
          <contextSpecific tag="6" constructed="0">
            http://crt.sectigo.com/SectigoPublicServerAuthenticationRootR46.p7c
          </contextSpecific>
        </sequence>
        <sequence>
          <oid>1.3.6.1.5.5.7.48.1</oid>
          <contextSpecific tag="6" constructed="0">
            http://ocsp.sectigo.com
          </contextSpecific>
        </sequence>
      </sequence>
    */
    const $ = cheerio.load(issuerInfoXml);
    const issuerInfoResult: string | string[] = $('sequence sequence contextSpecific').filter(function (i, el) {
      this === el
      // console.log("filtering:", this)
      return $(this).parent().children('oid').text() === '1.3.6.1.5.5.7.48.2';
    }).text();
    let issuerInfoBase64 = issuerInfoResult;
    if (Array.isArray(issuerInfoResult)) {
      // get the first one?
      issuerInfoBase64 = issuerInfoResult[0];
    }
    const issuerURL = atob(issuerInfoBase64);
    return issuerURL;

  }
}