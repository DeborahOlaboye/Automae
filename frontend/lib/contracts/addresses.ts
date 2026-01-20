// Deployed contract addresses on Cronos Testnet
export const CONTRACT_ADDRESSES = {
  AssetRegistry: '0x096d1137230f1578DB6530EAC969E24D0C00F198',
  DividendDistribution: '0xc6fB8C158c6FAe0988c561DA2511B67000E337B6',
  AssetTreasury: '0x76fC905A4970db506fA49CC3158c36A2f1050daa',
  AssetFactory: '0x9D217912860233c538160c99e90BdF2E1481c31C',
} as const;

export const CRONOS_TESTNET = {
  chainId: 338,
  chainIdHex: '0x152',
  name: 'Cronos Testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  blockExplorer: 'https://explorer.cronos.org/testnet',
  nativeCurrency: {
    name: 'TCRO',
    symbol: 'TCRO',
    decimals: 18,
  },
} as const;
