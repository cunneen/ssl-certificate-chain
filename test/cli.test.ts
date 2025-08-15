// test/cli.test.ts
import { expect } from 'chai';
import { spawn, type SpawnOptions } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import anylogger from 'anylogger';
const logger = anylogger('test-ssl-certificate-chain:cli');

describe('CLI', function () {
  this.timeout(10000);
  it('should execute the CLI with default options', async () => {
    const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');
    const args = ['https://example.com'];
    const options: SpawnOptions = { stdio: 'inherit' };

    const childProcess = spawn(cliPath, args, options);

    await new Promise<void>((resolve, reject) => {
      childProcess.on('close', (code) => {
        if (code === 0) {
          const outputDir = path.resolve(path.join((process.cwd()), 'output'));
          const outputFile = path.resolve(path.join(outputDir, 'chain.pem'));
          expect(fs.existsSync(outputFile)).to.be.true;
          resolve();
        } else {
          reject(new Error(`CLI exited with code ${code}`));
        }
      });
    });
  });

  it('should execute the CLI with custom options', async () => {
    const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');
    const args = ['https://example.com', '-p', '443', '-o', 'example.com.pem'];
    // const options: SpawnOptions = { stdio: 'inherit', env: { ...(process.env), DEBUG: "*" } };
    const options: SpawnOptions = { stdio: 'inherit' };

    const childProcess = spawn(cliPath, args, options);

    await new Promise<void>((resolve, reject) => {
      childProcess.on('close', (code) => {
        if (code === 0) {
          const outputDir = path.resolve(path.join((process.cwd()), 'output'));
          const outputFile = path.resolve(path.join(outputDir, 'example.com.pem'));
          expect(fs.existsSync(outputFile)).to.be.true;
          resolve();
        } else {
          reject(new Error(`CLI exited with code ${code}`));
        }
      });
    });
  });

  it('should exit with non-zero code if invalid URL', async () => {
    const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');
    const args = [' invalid-url'];
    // const options: SpawnOptions = { stdio: 'inherit' };
    const options: SpawnOptions = { stdio: 'ignore' };

    const childProcess = spawn(cliPath, args, options);

    await new Promise<void>((resolve, reject) => {
      childProcess.on('close', (code) => {
        logger.debug("code", code);
        expect(code).to.not.equal(0);
        if (code !== 0) {
          resolve();
        } else {
          reject(new Error(`CLI exited with code ${code}`));
        }
      });
    });
  });
});