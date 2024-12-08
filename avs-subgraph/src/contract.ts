import { Bytes } from "@graphprotocol/graph-ts"
import {
  Initialized as InitializedEvent,
  NewTokenDataCreated as NewTokenDataCreatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RewardsInitiatorUpdated as RewardsInitiatorUpdatedEvent,
  TokenDataResponded as TokenDataRespondedEvent
} from "../generated/Contract/Contract"
import { Token, Action } from "../generated/schema"

export function handleNewTokenDataCreated(
  event: NewTokenDataCreatedEvent
): void {
  let token = Token.load(Bytes.fromHexString(event.params.contractAddress))
  if (token == null) {
    token = new Token(Bytes.fromHexString(event.params.contractAddress))
    token.tokenDataIndex = event.params.tokenDataIndex
    token.chainName = event.params.tokenName
    token.blockNumber = event.block.number
    token.save()
  }
}

export function handleTokenDataResponded(event: TokenDataRespondedEvent): void {
  let token = Token.load(Bytes.fromHexString(event.params.contractAddress))
  if (token != null) {
    token.isEligible = event.params.isEligible
    token.save()
    let action = new Action(event.transaction.hash)
    action.token = token.id
    action.save()
  }
}
