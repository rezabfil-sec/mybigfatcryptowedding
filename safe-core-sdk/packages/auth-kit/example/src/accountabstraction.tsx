import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
  } from 'react'
  import { ethers, utils } from 'ethers'
  import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
  import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
  
  import AccountAbstraction from '@safe-global/account-abstraction-kit-poc'
  import { Web3AuthModalPack } from '@safe-global/auth-kit'
  import { MoneriumPack, StripePack } from '@safe-global/onramp-kit'
  import { GelatoRelayPack } from '@safe-global/relay-kit'
  import Safe, { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'
  
  // import usePolling from 'src/hooks/usePolling'
  // import getMoneriumInfo from 'src/utils/getMoneriumInfo'
  
  const isMoneriumRedirect = () => {
    const authCode = new URLSearchParams(window.location.search).get('code')
  
    return !!authCode
  }
  
  export const mumbaiChain = {
    id: '0x13881',
    token: 'matic',
    shortName: 'matic',
    label: 'Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    color: '#8248E5',
    isStripePaymentsEnabled: true,
    isMoneriumPaymentsEnabled: false,
    faucetUrl: 'https://mumbaifaucet.com/'
  }
  
  const initialState = {
    isAuthenticated: false,
    loginWeb3Auth: () => {},
    logoutWeb3Auth: () => {},
    relayTransaction: async () => {},
    setChainId: () => {},
    setSafeSelected: () => {},
    onRampWithStripe: async () => {},
    safes: [],
    chainId: mumbaiChain.id,
    isRelayerLoading: true,
    openStripeWidget: async () => {},
    closeStripeWidget: async () => {},
    startMoneriumFlow: async () => {},
    closeMoneriumFlow: () => {}
  }
  
  const accountAbstractionContext = createContext(initialState)
  
  const useAccountAbstraction = () => {
    const context = useContext(accountAbstractionContext)
  
    if (!context) {
      throw new Error(
        'useAccountAbstraction should be used within a AccountAbstraction Provider'
      )
    }
  
    return context
  }
  
  // const MONERIUM_TOKEN = 'monerium_token'
  
  const AccountAbstractionProvider = ({ children }) => {
    // owner address from the email  (provided by web3Auth)
    const [ownerAddress, setOwnerAddress] = useState('')
  
    // safes owned by the user
    const [safes, setSafes] = useState([])
  
    // chain selected
    const [chainId, setChainId] = useState(() => {
      if (isMoneriumRedirect()) {
        return '0x5'
      }
  
      return mumbaiChain.id
    })
  
    // web3 provider to perform signatures
    const [web3Provider, setWeb3Provider] = useState()
  
    const isAuthenticated = !!ownerAddress && !!chainId
    const chain = mumbaiChain
  
    // reset React state when you switch the chain
    useEffect(() => {
      setOwnerAddress('')
      setSafes([])
      setChainId(chain.id)
      setWeb3Provider(undefined)
      setSafeSelected('')
    }, [chain])
  
    // authClient
    const [web3AuthModalPack, setWeb3AuthModalPack] = useState()
  
    // onRampClient
    const [stripePack, setStripePack] = useState()
  
    useEffect(() => {
      ;(async () => {
        const options = {
          clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID || '',
          web3AuthNetwork: 'testnet',
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: chain.id,
            rpcTarget: chain.rpcUrl
          },
          uiConfig: {
            theme: 'dark',
            loginMethodsOrder: ['google', 'facebook']
          }
        }
  
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
          txServiceUrl: chain.transactionServiceUrl
        })
  
        await web3AuthModalPack.init({
          options,
          adapters: [openloginAdapter],
          modalConfig
        })
  
        setWeb3AuthModalPack(web3AuthModalPack)
      })()
    }, [chain])
  
    // auth-kit implementation
    const loginWeb3Auth = useCallback(async () => {
      if (!web3AuthModalPack) return
  
      try {
        const { safes, eoa } = await web3AuthModalPack.signIn()
        const provider = web3AuthModalPack.getProvider()
  
        // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
        setChainId(chain.id)
        setOwnerAddress(eoa)
        setSafes(safes || [])
        setWeb3Provider(new ethers.providers.Web3Provider(provider))
      } catch (error) {
        console.log('error: ', error)
      }
    }, [chain, web3AuthModalPack])
  
    useEffect(() => {
      if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
        ;(async () => {
          await loginWeb3Auth()
        })()
      }
    }, [web3AuthModalPack, loginWeb3Auth])
  
    const logoutWeb3Auth = () => {
      web3AuthModalPack?.signOut()
      setOwnerAddress('')
      setSafes([])
      setChainId(chain.id)
      setWeb3Provider(undefined)
      setSafeSelected('')
      setGelatoTaskId(undefined)
      // closeMoneriumFlow()
    }
  
    const getSafes = async () => {
      if (web3Provider) {
        const signer = web3Provider.getSigner()
  
        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: signer
        })
  
        const safe = await Safe.create({
          ethAdapter,
          // safeAddress, 
          isL1SafeMasterCopy: true
        })
  
        return safe
      }
    }
  
    const deploySafe = async () => {
      if (web3Provider) {
        const signer = web3Provider.getSigner()
  
        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: signer
        })
  
        const safeFactory = await SafeFactory.create({ ethAdapter })
  
        const safeAccountConfig = {
          owners: [
            '0xE1C7eb2f5Da0F5b8662b3c9a11464Fa703d5ed5e'
          ],
          threshold: 2
          // ... (optional params)
        }
        console.log('yes')
        const mySafe = await safeFactory.deploySafe({ safeAccountConfig }).catch(console.error)
        const mySafeAddress = await mySafe.getAddress()
  
        setSafes(safes => [...safes, mySafeAddress])
        setSafeSelected(mySafeAddress)
      }
    }
  
    // current safe selected by the user
    const [safeSelected, setSafeSelected] = useState('')
    // const [moneriumInfo, setMoneriumInfo] = useState()
    // const [moneriumPack, setMoneriumPack] = useState()
  
    // Initialize MoneriumPack
    // useEffect(() => {
    //   ;(async () => {
    //     if (!web3Provider || !safeSelected) return
  
    //     const safeOwner = web3Provider.getSigner()
    //     const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: safeOwner })
  
    //     const safeSdk = await Safe.create({
    //       ethAdapter: ethAdapter,
    //       safeAddress: safeSelected,
    //       isL1SafeMasterCopy: true
    //     })
  
    //     const pack = new MoneriumPack({
    //       clientId: process.env.REACT_APP_MONERIUM_CLIENT_ID || '',
    //       environment: 'sandbox'
    //     })
  
    //     await pack.init({
    //       safeSdk
    //     })
  
    //     setMoneriumPack(pack)
    //   })()
    // }, [web3Provider, safeSelected])
  
    // const startMoneriumFlow = useCallback(
    //   async (authCode, refreshToken) => {
    //     if (!moneriumPack) return
  
    //     const moneriumClient = await moneriumPack.open({
    //       redirectUrl: process.env.REACT_APP_MONERIUM_REDIRECT_URL,
    //       authCode,
    //       refreshToken
    //     })
  
    //     if (moneriumClient.bearerProfile) {
    //       localStorage.setItem(MONERIUM_TOKEN, moneriumClient.bearerProfile.refresh_token)
  
    //       const authContext = await moneriumClient.getAuthContext()
    //       const profile = await moneriumClient.getProfile(authContext.defaultProfile)
    //       const balances = await moneriumClient.getBalances(authContext.defaultProfile)
  
    //       setMoneriumInfo(getMoneriumInfo(safeSelected, authContext, profile, balances))
    //     }
    //   },
    //   [moneriumPack, safeSelected]
    // )
  
    // const closeMoneriumFlow = useCallback(() => {
    //   moneriumPack?.close()
    //   localStorage.removeItem(MONERIUM_TOKEN)
    //   setMoneriumInfo(undefined)
    // }, [moneriumPack])
  
    // useEffect(() => {
    //   const authCode = new URLSearchParams(window.location.search).get('code') || undefined
    //   const refreshToken = localStorage.getItem(MONERIUM_TOKEN) || undefined
  
    //   if (authCode || refreshToken) startMoneriumFlow(authCode, refreshToken)
    // }, [startMoneriumFlow])
  
    // TODO: add disconnect owner wallet logic ?
  
    // conterfactual safe Address if its not deployed yet
    useEffect(() => {
      const getSafeAddress = async () => {
        if (web3Provider) {
          const signer = web3Provider.getSigner()
          const relayPack = new GelatoRelayPack()
          const safeAccountAbstraction = new AccountAbstraction(signer)
  
          await safeAccountAbstraction.init({ relayPack })
  
          const hasSafes = safes.length > 0
  
          const safeSelected = hasSafes
            ? safes[0]
            : await safeAccountAbstraction.getSafeAddress()
  
          setSafeSelected(safeSelected)
        }
      }
  
      getSafeAddress()
    }, [safes, web3Provider])
  
    const [isRelayerLoading, setIsRelayerLoading] = useState(false)
    const [gelatoTaskId, setGelatoTaskId] = useState()
  
    // refresh the Gelato task id
    useEffect(() => {
      setIsRelayerLoading(false)
      setGelatoTaskId(undefined)
    }, [chainId])
  
    // relay-kit implementation using Gelato
    const relayTransaction = async () => {
      if (web3Provider) {
        setIsRelayerLoading(true)
  
        const signer = web3Provider.getSigner()
        const relayPack = new GelatoRelayPack()
        const safeAccountAbstraction = new AccountAbstraction(signer)
  
        await safeAccountAbstraction.init({ relayPack })
  
        // we use a dump safe transfer as a demo transaction
        const dumpSafeTransafer = [
          {
            to: safeSelected,
            data: '0x',
            value: utils.parseUnits('0.01', 'ether').toString(),
            operation: 0 // OperationType.Call,
          }
        ]
  
        const options = {
          isSponsored: false,
          gasLimit: '600000', // in this alfa version we need to manually set the gas limit
          gasToken: ethers.constants.AddressZero // native token
        }
  
        const gelatoTaskId = await safeAccountAbstraction.relayTransaction(
          dumpSafeTransafer,
          options
        )
  
        setIsRelayerLoading(false)
        setGelatoTaskId(gelatoTaskId)
      }
    }
  
    // onramp-kit implementation
    const openStripeWidget = async () => {
      const stripePack = new StripePack({
        stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || '',
        onRampBackendUrl: process.env.REACT_APP_STRIPE_BACKEND_BASE_URL || ''
      })
  
      await stripePack.init()
  
      const sessionData = await stripePack.open({
        // sessionId: sessionId, optional parameter
        element: '#stripe-root',
        defaultOptions: {
          transaction_details: {
            wallet_address: safeSelected,
            supported_destination_networks: ['ethereum', 'polygon'],
            supported_destination_currencies: ['usdc'],
            lock_wallet_address: true
          },
          customer_information: {
            email: 'john@doe.com'
          }
        }
      })
  
      setStripePack(stripePack)
  
      console.log('Stripe sessionData: ', sessionData)
    }
  
    const closeStripeWidget = async () => {
      stripePack?.close()
    }
  
    // we can pay Gelato tx relayer fees with native token & USDC
    // TODO: ADD native Safe Balance polling
    // TODO: ADD USDC Safe Balance polling
  
    // fetch safe address balance with polling
    // const fetchSafeBalance = useCallback(async () => {
    //   const balance = await web3Provider?.getBalance(safeSelected)
  
    //   return balance?.toString()
    // }, [web3Provider, safeSelected])
  
    // const safeBalance = usePolling(fetchSafeBalance)
  
    const state = {
      ownerAddress,
      chainId,
      chain,
      safes,
  
      isAuthenticated,
  
      web3Provider,
  
      loginWeb3Auth,
      logoutWeb3Auth,
  
      setChainId,
  
      safeSelected,
      // safeBalance,
      setSafeSelected,
  
      isRelayerLoading,
      relayTransaction,
      gelatoTaskId,
  
      openStripeWidget,
      closeStripeWidget,
  
      // startMoneriumFlow,
      // closeMoneriumFlow,
      // moneriumInfo
  
      deploySafe,
      getSafes
    }
  
    return (
      <accountAbstractionContext.Provider value={state}>
        {children}
      </accountAbstractionContext.Provider>
    )
  }
  
  export { useAccountAbstraction, AccountAbstractionProvider }