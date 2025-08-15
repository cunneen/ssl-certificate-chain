// cert.test.ts
import { expect } from 'chai';
import { Cert } from '../src/Cert.class';
import path from 'node:path';
import fs from 'node:fs';

const ROOT_CERT_PATH = path.join(import.meta.dirname, 'assets/root.p7c');
const INTERMEDIATE_CERT_PATH = path.join(import.meta.dirname, 'assets/intermediate.crt');

describe('Cert class', () => {
  let cert: Cert;

  let rootCertDataBuffer: Buffer;
  let intermediateCertDataBuffer: Buffer;

  before(() => {
    rootCertDataBuffer = Buffer.from(fs.readFileSync(ROOT_CERT_PATH, { encoding: 'binary' }), 'binary');
    intermediateCertDataBuffer = Buffer.from(fs.readFileSync(INTERMEDIATE_CERT_PATH, { encoding: 'binary' }), 'binary');
  });

  beforeEach(() => {
    cert = new Cert();
  });

  describe('loadFromBinary', () => {
    it('should load a certificate from binary data', async () => {
      const loaded = await cert.loadFromBinary(rootCertDataBuffer);
      expect(loaded).to.be.true;
    });

    it('should return false if loading fails', async () => {
      const invalidData = Buffer.from('invalid-data', 'binary');
      const loaded = await cert.loadFromBinary(invalidData);
      expect(loaded).to.be.false;
    });
  });

  describe('getPem', () => {
    it('should return the certificate in PEM format', async () => {
      await cert.loadFromBinary(rootCertDataBuffer);
      const pem = cert.getPem();
      expect(pem).to.be.a('string');
      expect(pem).to.match(/^-----BEGIN CERTIFICATE-----/);
    });

    it('should return null if no certificate is loaded', async () => {
      const pem = cert.getPem();
      expect(pem).to.be.null;
    });
  });

  describe('isRoot', () => {
    it('should return true if the certificate is self-signed', async () => {
      const success = await cert.loadFromBinary(rootCertDataBuffer);
      expect(success).to.be.true;
      const isRoot = cert.isRoot();
      expect(isRoot).to.be.true;
    });

    it('should return false if the certificate is not self-signed', async () => {
      const success = await cert.loadFromBinary(intermediateCertDataBuffer);
      expect(success).to.be.true;
      const isRoot = cert.isRoot();
      expect(isRoot).to.be.false;
    });
  });
});