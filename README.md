# mybigfatcryptowedding
ETH Global Istanbul Hackathon

We submitted to 4 bounties that focus on the key features of our applications:
+ SAFE
+ Threshold Network
+ IPFS with Lighthouse
+ Aztec

All but IPFS have individual directories as their integration was not possible due to certain deployment issues or the project readiness.

## Folder Details
### SAFE - safe-core-sdk/packages/auth-kit

This is an updated Auth-kit version that enables Safe deployment on top of the creation and login of blockchain accounts. It is currently operational on the Polygon mainnet due to the absence of a transaction service in Mumbai at the moment.

For proper functionality, please ensure that localhost is accessible using Firefox, as popups do not function correctly in Chrome.

What does it do and why do we need it?
- Enables the easy creation and login of blockchain accounts using social logins or web3 wallets. When using web2 methods like email or social accounts, it generates Ethereum addresses and delivers key shares via email, simplifying the process for web2 couples, friends, and families, to create blockchain accounts and a safe.
- Allows users to create a SAFE on the Polygon mainnet. This SAFE acts as a collective account for couples, friends, and families, facilitating actions such as NFT invitation minting, RSVPs, playlist submissions, gift and message exchanges, and more.

To use the example properly on your local machine follow these steps:

Install dependencies
`yarn add @safe-global/auth-kit @web3auth/base@4.6.0 @web3auth/modal@4.6.2 @web3auth/openlogin-adapter@4.6.0 ethers@5.7.2 @safe-global/protocol-kit @safe-global/api-kit @safe-global/safe-core-sdk-types`

In the safe-core-sdk folder
    1. `yarn install`
    2. `yarn build`
In the auth-kit example folder
    3. `yarn install`
    4. `yarn start`

### Threshold network and IPFS - taco-web

This is an enhanced version of Threshold Network's demo-taco, now featuring integrated IPFS functionality.

We chose to build our solution on top of the demo-taco primarily because of its easy integration with the Mumbai testnet and access to tokens.

Incorporating IPFS into our project, we opted for the Lighthouse package due to its comprehensive and fundamental capabilities. However, implementing advanced features, such as utilizing NFT smart contracts for more sophisticated contract access, presented challenges.

This is primarily because Goerli has been deprecated, and all testing activities are now taking place on Sepolia and Mumbai. Regrettably, neither of these networks offers straightforward NFT minting capabilities, necessitating the deployment of custom smart contracts.

To run the steps,
1. `pnpm build`
2. `pnpm start`

What does it do and why do we need it?
- NFT invitation
   - Host control access to message via Threshold network, currently it is gating based on token balance, in the future we want to check if the invitee holds the token of the NFT invitation
   - Host can store encrypted messages to IPFS via lighthouse
   - Invitees can read the encrypted message(Information for the wedding) if they fulfill the condition (decrypt data on the fly)
- Photo sharing
   - Guests can share the photo they took during the party to IPFS via the Lighthouse
   - Only the host and submitter can see the encrypted photos.
   - We want to collect the best photos and make them as an album.
   - Shared album will be accessible by invitees only.

### Aztec - aztec

This is a privacy-enhancing feature building on top of Aztec token deployment and sandbox. 
We chose these capabilities as they provide a great base and interaction options for our scenario and serve as a great base for future improvements. 

Using Aztec, we deploy a simple token transfer that allows us to distinguish between private and public information. Therefore, guests can choose to interact with functions of their preference to send tokens in a private fashion (hiding their content and origin) or public. Only the owners of the given account - the newlyweds in our scenario can view the private account balances. Similar interaction should be later on possible once Aztec is fully released.

To run the steps,
1. Start the sandbox using Docker -- get the https://github.com/AztecProtocol/aztec-packages/tree/master/yarn-project/aztec-sandbox and run `docker compose up`
2. Compile and deploy the smart contracts using `nargo` and `node src/deploy.mjs`
3. Execute `node src/index.mjs` to follow the individual interactions

What does it do and why do we need it?
- Blockchain enables us to bridge funds cross-border with almost any friction, which is exactly fitting for our global relationships. 
- In addition, when it comes to delicate situations, such as wedding presents, it is crucial to ensure everyone feels comfortable with their contributions to the newlyweds. Therefore, the privacy of the sender and/or the content of the transaction must be hidden, which is exactly what Aztec offers.