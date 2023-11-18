import { useEffect, useState } from 'react'
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  UserInfo,
  WALLET_ADAPTERS
} from '@web3auth/base'
// MYBIGFATCRYTOWEDDING BUTTON ADDED
import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthOptions } from '@web3auth/modal'
import { EthHashInfo } from '@safe-global/safe-react-components'

import AppBar from './AppBar'
import { AuthKitSignInData, Web3AuthModalPack, Web3AuthEventListener } from '../../src/index'

// MYBIGFATCRYTOWEDDING - TO DEPOLY SAFE
import { DeploySafeProps, EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'

// MYBIGFATCRYTOWEDDING - CREATE DEPOLOYSAFE WITH BUTTON EVENT

// MYBIGFATCRYTOWEDDING END 

const connectedHandler: Web3AuthEventListener = (data) => console.log('CONNECTED', data)
const disconnectedHandler: Web3AuthEventListener = (data) => console.log('DISCONNECTED', data)

function App() {
  const [web3AuthModalPack, setWeb3AuthModalPack] = useState<Web3AuthModalPack>()
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<AuthKitSignInData | null>(
    null
  )
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>()
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)
  const [chainId, setChainId] = useState<string>('')

  async function deploySafe() {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(provider as ethers.providers.ExternalProvider)
      const signer = ethersProvider.getSigner()
      console.log('hola')
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer || provider
      })
      console.log('hola2')
      const safeFactory = await SafeFactory.create({ ethAdapter })
      console.log(safeAuthSignInResponse?.eoa)

      const callback = (txHash: string) => { console.log('hi'); return txHash }

      const safeSdk = await safeFactory.deploySafe(
        {
          safeAccountConfig: {
            threshold: 1, owners: [safeAuthSignInResponse?.eoa || '']
          },
          saltNonce: Date.now().toString(),
          callback
        },

      )
      console.log("asdf")
    } catch (error) {
      console.error("Error deploying safe:", error);
    }

  }

  useEffect(() => {
    ; (async () => {
      const options: Web3AuthOptions = {
        clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID || '',
        web3AuthNetwork: 'testnet',
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0x89',
          rpcTarget: `https://polygon-mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`
        },
        uiConfig: {
          theme: 'dark',
          loginMethodsOrder: ['google', 'facebook']
        }
      }
      setChainId('0x89')

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: 'torus',
          showOnModal: false
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: 'metamask',
          showOnDesktop: true,
          showOnMobile: false
        }
      }

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'mandatory'
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            name: 'Safe'
          }
        }
      })

      const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: 'https://safe-transaction-polygon.safe.global'
      })

      await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig })

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler)

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler)

      setWeb3AuthModalPack(web3AuthModalPack)

      return () => {
        web3AuthModalPack.unsubscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler)
        web3AuthModalPack.unsubscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler)
      }
    })()
  }, [])

  useEffect(() => {
    if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
      ; (async () => {
        await login()
      })()
    }
  }, [web3AuthModalPack])

  const login = async () => {
    if (!web3AuthModalPack) return
    console.log("Hello")

    const signInInfo = await web3AuthModalPack.signIn()
    console.log('SIGN IN RESPONSE: ', signInInfo)

    const userInfo = await web3AuthModalPack.getUserInfo()
    console.log('USER INFO: ', userInfo)

    setSafeAuthSignInResponse(signInInfo)
    setUserInfo(userInfo || undefined)
    setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider)
  }

  const logout = async () => {
    if (!web3AuthModalPack) return

    await web3AuthModalPack.signOut()

    setProvider(null)
    setSafeAuthSignInResponse(null)
  }

  return (
    <>
      <AppBar onLogin={login} onLogout={logout} userInfo={userInfo} isLoggedIn={!!provider} />
      {safeAuthSignInResponse?.eoa && (
        <Grid container>
          <Grid item md={4} p={4}>
            <Typography variant="h3" color="secondary" fontWeight={700}>
              Owner account
            </Typography>
            <Divider sx={{ my: 3 }} />
            <EthHashInfo
              address={safeAuthSignInResponse.eoa}
              showCopyButton
              showPrefix
              prefix={getPrefix(chainId)}
            />
          </Grid>
          <Grid item md={8} p={4}>
            <>
              <Typography variant="h3" color="secondary" fontWeight={700}>
                Available Safes
              </Typography>
              <Divider sx={{ my: 3 }} />
              {safeAuthSignInResponse?.safes?.length ? (
                safeAuthSignInResponse?.safes?.map((safe, index) => (
                  <Box sx={{ my: 3 }} key={index}>
                    <EthHashInfo address={safe} showCopyButton shortAddress={false} />
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="secondary" fontWeight={700}>
                  No Available Safes
                </Typography>
              )}
              {/* MYBIGFATCRYTOWEDDING BUTTON ADDED */}
              <Box sx={{ mt: 2 }}></Box>
              <Button
                variant="contained"
                color="primary"
                onClick={deploySafe}
              >
                Deploy Couple Safe
              </Button>
            </>
          </Grid>
        </Grid>
      )}
    </>
  )
}

const getPrefix = (chainId: string) => {
  switch (chainId) {
    case '0x1':
      return 'eth'
    case '0x5':
      return 'gor'
    case '0x64':
      return 'gno'
    case '0x89':
      return 'matic' 
    case '0xaa36a7':
      return 'sepolia'
    default:
      return 'eth'
  }
}

export default App
