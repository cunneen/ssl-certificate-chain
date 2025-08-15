#!/usr/bin/env node
// ================================================
// CLI for ssl-certificate-chain
// ================================================
// This file gets copied to the 'dist' folder

import { processArgs } from "./processArgs";
import { debug } from 'debug'
import 'anylogger-debug'
import anylogger from 'anylogger'

const logger = anylogger('ssl-certificate-chain:cli');

const sslCertChainModule = require("./sslCertificateChain");
const { sslCertificateChain } = sslCertChainModule;

const args = processArgs();
sslCertificateChain(args);
