import { providers } from 'ethers'
import invariant from 'tiny-invariant'
import { DidResolver } from '../types'

const provider = new providers.StaticJsonRpcProvider(
  'https://rpc.ankr.com/eth',
  1,
)

export const resolveEth: DidResolver<'eth'> = async (
  did,
  snapshots, // TODO: use snapshots
) => {
  const address = await provider.resolveName(did)
  invariant(address)
  return { coinType: 60, address }
}
