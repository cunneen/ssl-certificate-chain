#!/usr/bin/env node
// ================================================
// CLI for ssl-certificate-chain
// ================================================
// This file gets copied to the 'dist' folder

const sslCertificateChain = require("./index.cjs").default;
sslCertificateChain();