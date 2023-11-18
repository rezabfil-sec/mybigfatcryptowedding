import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
import dotenv from 'dotenv'

dotenv.config()

// https://chainlist.org/?search=goerli&testnets=true
const RPC_URL='https://polygon-mumbai.infura.io/v3/cf97479861984ee49649082af230ad6f'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
// const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider)
// const owner3Signer = new ethers.Wallet(process.env.OWNER_3_PRIVATE_KEY!, provider)

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})