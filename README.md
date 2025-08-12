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
    A nodejs module for downloading a SSL certificate chain from a website
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
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>    
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- GETTING STARTED -->
## Getting Started

You can run the application using `npx` (NB: requires nodejs):

```sh
npx ssl-certificate-chain <url>
```

### Prerequisites

[nodejs](https://nodejs.org/en/download/) needs to be installed

<!-- USAGE EXAMPLES -->
## Usage

```sh
 npx ssl-certificate-chain <url> [-p port] [-o outputFile]
```

### Example

Download the certificate chain for https://example.com to `example.com.pem`:

```sh
npx ssl-certificate-chain https://example.com -o example.com.pem
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP 
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/cunneen/ssl-certificate-chain/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

-->

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

