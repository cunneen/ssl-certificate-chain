<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/cunneen/ssl-certificate-chain">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">ssl-certificate-chain</h3>

  <p align="center">
    Downloads the SSL certificate from an HTTPS website, obtains each certificate in the certificate chain, and writes the chain as a PEM file.
    <br />
    <a href="https://github.com/cunneen/ssl-certificate-chain"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/cunneen/ssl-certificate-chain">View Demo</a>
    &middot;
    <a href="https://github.com/cunneen/ssl-certificate-chain/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/cunneen/ssl-certificate-chain/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>

</div>

This project was created in response to an issue I encountered with a legacy Nodejs v14.x application. Recently, I needed to make a modification to allow it to connect to a server with a HTTPS certificate signed issued by Sectigo (formerly known as Comodo), who [recently changed their public root CA certificates](https://www.sectigo.com/sectigo-public-root-cas-migration).

Node v14.x does not include Sectigo's new root CA certificate, so Nodejs was throwing a `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` error when it attempted to connect to the server.

The server certificate itself contained a reference (via the 'CA Issuers' field # `1.3.6.1.5.5.7.48.2`) to the certificate of the intermediate issuer (`"Sectigo Public Server Authentication CA DV R36"`), which itself contained a similar reference to the root CA certificate (`"Sectigo Public Server Authentication Root R46"`). The problem was that the certificates were encoded in a p7c (pkcs7) format, nodejs didn't seem to accept it, and it was tricky to find the right tool to convert it.

This tool was a simple attempt to build the PEM file necessary to get Nodejs to trust a particular CA certificate, without completely disabling certificate verification.

**NOTE: Alternative**: If you just want Node to use an updated CA store, you can use a script from the [curl project](https://github.com/curl/curl.git) to download the [latest certdata.txt](https://raw.githubusercontent.com/mozilla-firefox/firefox/refs/heads/release/security/nss/lib/ckfw/builtins/certdata.txt) from the source tree for Mozilla Firefox, and convert it into a PEM format.

1. Download the `mk_ca_bundle.pl` perl script from the [curl project](https://github.com/curl/curl/blob/master/scripts/mk-ca-bundle.pl) :

  ```bash
  curl -L -O https://raw.githubusercontent.com/curl/curl/refs/heads/master/scripts/mk-ca-bundle.pl
  chmod 755 mk-ca-bundle.pl
  ./mk-ca-bundle.pl ca-bundle.crt
  ```

2. Start node with the `NODE_EXTRA_CA_CERTS=...` environment variable set to the path to the `ca-bundle.crt` file e.g.:

  ```bash
  NODE_EXTRA_CA_CERTS=./ca-bundle.crt node check.js
  ```

### Built With

* [![Typescript][Typescript]][Typescript-url]
* [![Mocha][Mocha]][Mocha-url]
* [![NodeJS][NodeJS]][NodeJS-url]
* [![NPM][NPM]][NPM-url]
* [![GitHub][GitHub]][GitHub-url]
* [![VSCode][VSCode]][VSCode-url]
* [![Shields.io][Shields.io]][Shields.io-URL]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

You can run the application using `npx` (NB: requires nodejs):

```sh
npx ssl-certificate-chain <url>
```

### Prerequisites

[nodejs](https://nodejs.org/en/download/) > v24.x needs to be installed

## Example

### Without `ssl-certificate-chain`:

check.js :

```js
  const https = require('https')
  // const fs = require('fs');
  const options = {
    hostname: 'mt.com',
    port: 443,
    path: '/',
    method: 'GET',
    // Necessary self-signed certificate.
    //ca: [ fs.readFileSync('/usr/local/share/ca-certificates/SSL_CA.crt') ]
  }

    https.get(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
  }).on('error', (e) => {
    console.error(e);
  });
```

Running check.js in Node v14.x will throw an error if the issuing certificate for the server is not available locally:

```sh-session
$ nvm use v14 ; # use node v14 to exhibit the issue
$ node check.js
Error: unable to get local issuer certificate
    at TLSSocket.onConnectSecure (_tls_wrap.js:1515:34)
    at TLSSocket.emit (events.js:400:28)
    at TLSSocket._finishInit (_tls_wrap.js:937:8)
    at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:709:12) {
  code: 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'
}
```

### With `ssl-certificate-chain`:

(Note: replace `mt.com` with your own domain name)

Download issuer the certificate chain for `mt.com` into `mt.com.pem`, (using the `-s` flag to exclude the certificate for `mt.com` itself)

```sh-session
$ nvm use v24 ; # node v24 is required for `ssl-certificate-chain`
$ npx ssl-certificate-chain https://mt.com -o mt.com.pem -s
$ ls output
mt.com.pem

$ cat output/mt.com.pem
```

  <details>
  <summary>Expand to see the PEM file contents</summary>

  ```txt
  -----BEGIN CERTIFICATE-----
  MIIGTDCCBDSgAwIBAgIQLBo8dulD3d3/GRsxiQrtcTANBgkqhkiG9w0BAQwFADBf
  MQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTYwNAYDVQQD
  Ey1TZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gUm9vdCBSNDYw
  HhcNMjEwMzIyMDAwMDAwWhcNMzYwMzIxMjM1OTU5WjBgMQswCQYDVQQGEwJHQjEY
  MBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTcwNQYDVQQDEy5TZWN0aWdvIFB1Ymxp
  YyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gQ0EgT1YgUjM2MIIBojANBgkqhkiG9w0B
  AQEFAAOCAY8AMIIBigKCAYEApkMtJ3R06jo0fceI0M52B7K+TyMeGcv2BQ5AVc3j
  lYt76TvHIu/nNe22W/RJXX9rWUD/2GE6GF5x0V4bsY7K3IeJ8E7+KzG/TGboySfD
  u+F52jqQBbY62ofhYjMeiAbLI02+FqwHeM8uIrUtcX8b2RCxF358TB0NHVccAXZc
  FYgZndZCeXxjuca7pJJ20LLUnXtgXcjAE1vY4WvbReW0W6mkeZyNGdmpTcFs5Y+s
  yy6LtE5Zocji9J9NlNnReox2RWVyEXpA1ChZ4gqN+ZpVSIQ0HBorVFbBKyhdZyEX
  gZgNSNtBRwxqwIzJePJhYd4ZUhO1vk+/uP3nwDk0p95q/j7naXNCSvESnrHPypaB
  WRK066nKfPRPi9m9kIOhMdYfS8giFRTcdgL24Ycilj7ecAK9Trh0VbjwouJ4WH+x
  bt47u68ZFCD/ac55I0DNHkCpaPruj6e9Rmr7K46wZDAYXuEAqB7tGG/jd6JAA+H2
  O44CV98NRsU213f1kScIZntNAgMBAAGjggGBMIIBfTAfBgNVHSMEGDAWgBRWc1hk
  lfmSGrASKgRieaFAFYghSTAdBgNVHQ4EFgQU42Z0u3BojSxdTg6mSo+bNyKcgpIw
  DgYDVR0PAQH/BAQDAgGGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0lBBYwFAYI
  KwYBBQUHAwEGCCsGAQUFBwMCMBsGA1UdIAQUMBIwBgYEVR0gADAIBgZngQwBAgIw
  VAYDVR0fBE0wSzBJoEegRYZDaHR0cDovL2NybC5zZWN0aWdvLmNvbS9TZWN0aWdv
  UHVibGljU2VydmVyQXV0aGVudGljYXRpb25Sb290UjQ2LmNybDCBhAYIKwYBBQUH
  AQEEeDB2ME8GCCsGAQUFBzAChkNodHRwOi8vY3J0LnNlY3RpZ28uY29tL1NlY3Rp
  Z29QdWJsaWNTZXJ2ZXJBdXRoZW50aWNhdGlvblJvb3RSNDYucDdjMCMGCCsGAQUF
  BzABhhdodHRwOi8vb2NzcC5zZWN0aWdvLmNvbTANBgkqhkiG9w0BAQwFAAOCAgEA
  BZXWDHWC3cubb/e1I1kzi8lPFiK/ZUoH09ufmVOrc5ObYH/XKkWUexSPqRkwKFKr
  7r8OuG+p7VNB8rifX6uopqKAgsvZtZsq7iAFw04To6vNcxeBt1Eush3cQ4b8nbQR
  MQLChgEAqwhuXp9P48T4QEBSksYav7+aFjNySsLYlPzNqVM3RNwvBdvp6vgDtGwc
  xlKQZVuuNVIaoYyls8swhxDeSHKpRdxRauTLZ+pl+wGvy0pnrLEJGSz9mOEmfbod
  e/XopR2NGqaHJ6bIjyxPu6UtyQGI26En7UAEozACrHz06Nx2jTAY9E6NeB6XuobE
  wLK025ZRmvglcURG1BrV24tGHHTgxCe8M3oGlpUSMTKQ2dkgljZVYt+gKdFtWELZ
  MuRdi+X3XsrR8LFz+aLUiDRfQqhmw3RxjIyVKvvu9UPYY1nsvxYmFnUSeM+2q1z/
  iPUry+xDY9MC6+IhleKT094VKdFVp7LXH42+wvU+17lRolQ2mK2N/nBLVBwaIhib
  QXw4VYKwB86Bc6eS6iqsc94KEgD/U4VsjmgfhK+Xp4NM+VYzTTa3QeV3p8xOM0cw
  q1p8oZFA+OBcz3FYWpDIe5j0NWKlw9hXsTyPY/HeZUV59akskSOSRSmDfe8wJDPX
  58uB9/7lud0G3x0pxQAcffP0ayKavNwDTw4UfJ34cEw=
  -----END CERTIFICATE-----

  -----BEGIN CERTIFICATE-----
  MIIFijCCA3KgAwIBAgIQdY39i658BwD6qSWn4cetFDANBgkqhkiG9w0BAQwFADBf
  MQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTYwNAYDVQQD
  Ey1TZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gUm9vdCBSNDYw
  HhcNMjEwMzIyMDAwMDAwWhcNNDYwMzIxMjM1OTU5WjBfMQswCQYDVQQGEwJHQjEY
  MBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTYwNAYDVQQDEy1TZWN0aWdvIFB1Ymxp
  YyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gUm9vdCBSNDYwggIiMA0GCSqGSIb3DQEB
  AQUAA4ICDwAwggIKAoICAQCTvtU2UnXYASOgHEdCSe5jtrch/cSV1UgrJnwUUxDa
  ef0rty2k1Cz66jLdScK5vQ9IPXtamFSvnl0xdE8H/FAh3aTPaE8bEmNtJZlMKpnz
  SDBh+oF8HqcIStw+KxwfGExxqjWMrfhu6DtK2eWUAtaJhBOqbchPM8xQljeSM9xf
  iOefVNlI8JhD1mb9nxc4Q8UBUQvX4yMPFF1bFOdLvt30yNoDN9HWOaEhUTCDsG3X
  ME6WW5HwcCSrv0WBZEMNvSE6Lzzpng3LILVCJ8zab5vuZDCQOc2TZYEhMbUjUDM3
  IuM47fgxMMxF/mL50V0yeUKH32rMVhlATc6qu/m1dkmU8Sf4kaWD5QazYw6A3OAS
  VYCmO2a0OYctyPDQ0RTp5A1NDvZdV3LFOxxHVp3i1fuBYYzMTYCQNFu31xR13NgE
  SJ/AwSiItOkcyqex8Va3e0lMWeUgFaiEAin6OJRpmkkGj80feRQXEgyDet4fsZfu
  +Zd4KKTIRJLpfSYFplhym3kT2BFfrsU4YjRosoYwjviQYZ4ybPUHNs2iTG7sijbt
  8uaZFURww3y8nDnAtOFr94MlI1fZEoDlSfB1D++N6xybVCi0ITz8fAr/73trdf+L
  HaAZBav6+CuBQug4urv7qv094PPK306Xlynt8xhW6aWWrL3DkJiy4Pmi1KZHQ3xt
  zwIDAQABo0IwQDAdBgNVHQ4EFgQUVnNYZJX5khqwEioEYnmhQBWIIUkwDgYDVR0P
  AQH/BAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQEMBQADggIBAC9c
  mTz8Bl6MlC5w6tIyMY208FHVvArzZJ8HXtXBc2hkeqK5Duj5XYUtqDdFqij0lgVQ
  YKlJfp/imTYpE0RHap1VIDzYm/EDMrraQKFz6oOht0SmDpkBm+S8f74TlH7Kph52
  gDY9hAaLMyZlbcp+nv4fjFg4exqDsQ+8FxG75gbMY/qB8oFM2gsQa6H61SilzwZA
  Fv97fRheORKkU55+MkIQpiGRqRxOF3yEvJ+M0ejf5lG5Nkc/kLnHvALcWxxPDkjB
  JYOcCj+esQMzEhonrPcibCTRAUH4WAP+JWgiH5paPHxsnnVI84HxZmduTILA7rpX
  DhjvLpr3Etiga+kFpaHpaPi8TD8SHkXoUsCjvxInebnMMTzD9joiFgOgyY9mpFui
  TdaBJQbpdqQACj7LzTWb4OE4y2BThihCQRxEV+ioratF4yUQvNs+ZUH7G6aXD+u5
  dHn5HrwdVw1Hr8Mvn4dGp+smWg9WY7ViYG4A++MnESLn/pmPNPW56MORcr3Ywx65
  LvKRRFHQV80MNNVIIb/bE/FmJUNS0nAiNs2fxBx1IK1jcmMGDw4nztJqDby1ORrp
  0XZ60Vzk50lJLVU3aPAaOpg+VBeHVOmmJ1CJeyAvP/+/oYtKR5j/K3tJPsMpRmAY
  QqszKbrAKbkTidOIijlBO8n9pu0f9GBj39ItVQGL
  -----END CERTIFICATE-----
  ```

</details>
<br />

Run `check.js` in Node v14.x again, this time with the `NODE_EXTRA_CA_CERTS` environment variable set to the path to the certificate file. The error should now be fixed, and `check.js` outputs the http headers:

```sh-session
$ nvm use v14 ; # use node v14 to exhibit the issue
$ NODE_EXTRA_CA_CERTS=./output/mt.com.pem node check.js
statusCode: 301
headers: {
  date: 'Thu, 21 Aug 2025 14:44:38 GMT',
  location: 'https://www.mt.com/',
  'content-length': '323',
  connection: 'close',
  'content-type': 'text/html; charset=iso-8859-1',
  'set-cookie': [
    'cookiesession1=678B28D06B4D857D508F5DAB8D0C80DD;Expires=Fri, 21 Aug 2026 14:44:31 GMT;Path=/;HttpOnly'
  ],
  'strict-transport-security': 'max-age=15552000'
}
```

(the status code of `301` is just because this particular server returns a redirect; the fact that we received HTTP headers at all indicates that the SSL connection is working).

<br/>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#command-line-usage">Command-Line Usage</a></li>
        <li><a href="#api-usage">API Usage</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- USAGE EXAMPLES -->
## Usage

### Command-Line usage

```sh
npx ssl-certificate-chain <url> [-p port] [-o outputFile] [-d outputDir] [-s skipWebsiteCert]

```

Where:

* `<url>`: The URL to fetch the certificate chain from
* `[-p port]`: The port to connect to (default: `443`)
* `[-o outputFile]`: The output file to write the certificate chain to (default: `chain.pem`)
* `[-d outputDir]`: The output folder to write the certificate chain to (default: `${CWD}/output/`)
* `[-s skipWebsiteCert]`: Skip outputting the SSL certificate obtained from the URL specified by \<url> This is useful if you want to use the rest of the chain to explicitly trust the server certificate e.g. to use it as a `NODE_EXTRA_CA_CERTS` environment variable to nodejs, in order to workaround a `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` error. (default: `false`). Typically, the issuing certificates will have a much longer expiration date than the certificate for the website itself.

#### Example - Command-Line Usage

Download the certificate chain for https://example.com to `./output/example.com.pem`:

```sh
npx ssl-certificate-chain https://example.com -d output -o example.com.pem
```

### API Usage

```js
import { sslCertificateChain } from "ssl-certificate-chain";

await sslCertificateChain({ url, port, outputFile, skipWebsiteCert, outputDir });
```

See [command-line usage](#command-line-usage) for parameter details

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

<!--
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

-->

See the [open issues](https://github.com/cunneen/ssl-certificate-chain/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors

<a href="https://github.com/cunneen/ssl-certificate-chain/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=cunneen/ssl-certificate-chain" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the MIT license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


Project Link: [https://github.com/cunneen/ssl-certificate-chain](https://github.com/cunneen/ssl-certificate-chain)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [get-ssl-certificate](https://github.com/johncrisostomo/get-ssl-certificate)
* [cheerio](https://github.com/cheeriojs/cheerio)
* [minimist](https://github.com/substack/minimist)
* [anylogger](https://github.com/Downloads/anylogger)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)
* [chilkat software](https://www.chilkatsoft.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/cunneen/ssl-certificate-chain.svg?style=for-the-badge
[contributors-url]: https://github.com/cunneen/ssl-certificate-chain/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/cunneen/ssl-certificate-chain.svg?style=for-the-badge
[forks-url]: https://github.com/cunneen/ssl-certificate-chain/network/members
[stars-shield]: https://img.shields.io/github/stars/cunneen/ssl-certificate-chain.svg?style=for-the-badge
[stars-url]: https://github.com/cunneen/ssl-certificate-chain/stargazers
[issues-shield]: https://img.shields.io/github/issues/cunneen/ssl-certificate-chain.svg?style=for-the-badge
[issues-url]: https://github.com/cunneen/ssl-certificate-chain/issues
[license-shield]: https://img.shields.io/github/license/cunneen/ssl-certificate-chain.svg?style=for-the-badge
[license-url]: https://github.com/cunneen/ssl-certificate-chain/blob/master/LICENSE.txt

<!-- shields from https://github.com/inttter/md-badges -->
[GitHub]: https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white
[GitHub-URL]: https://github.com
[Mocha]: https://img.shields.io/badge/Mocha-8D6748?logo=mocha&logoColor=fff
[Mocha-URL]: https://mochajs.org
[NodeJS]: https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white
[NodeJS-URL]: https://nodejs.org/
[NPM]: https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff
[NPM-URL]: https://www.npmjs.com
[Shields.io]: https://img.shields.io/badge/shields-io-97C900?logo=shieldsdotio&logoColor=97C900&labelColor=555
[Shields.io-URL]: https://shields.io/
[Typescript]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff
[Typescript-URL]: https://typescriptlang.org
[VSCode-URL]: https://code.visualstudio.com/
[VSCode]: https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white
