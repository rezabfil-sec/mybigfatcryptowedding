// src/deploy.mjs
import { writeFileSync } from 'fs';
import { Contract, ContractDeployer, createPXEClient, getSandboxAccountsWallets } from '@aztec/aztec.js';
import TokenContractArtifact from "../contracts/token/target/Token.json" assert { type: "json" };

const { PXE_URL = 'http://localhost:8080' } = process.env;

async function main() {
  const pxe = createPXEClient(PXE_URL);
  const [ownerWallet] = await getSandboxAccountsWallets(pxe);

  const token = await Contract.deploy(ownerWallet, TokenContractArtifact, [ownerWallet.getCompleteAddress()])
    .send()
    .deployed();

  console.log(`Token deployed at ${token.address.toString()}`);

  const addresses = {
    token: token.address.toString(),
  };
  writeFileSync('addresses.json', JSON.stringify(addresses, null, 2));
}

main().catch((err) => {
  console.error(`Error in deployment script: ${err}`);
  process.exit(1);
});