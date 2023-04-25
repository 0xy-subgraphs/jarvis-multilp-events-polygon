import {
  DepositedLiquidity as DepositedLiquidityEvent,
  WithdrawnLiquidity as WithdrawnLiquidityEvent
} from "../generated/SynthereumPoolEur/SynthereumPool"
import {
  LiquidityDeposit,
  LiquidityWithdraw
} from "../generated/schema"
import { SynthereumPool } from "../generated/SynthereumPoolEur/SynthereumPool"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function handleDepositedLiquidity(event: DepositedLiquidityEvent): void {
  let entity = LiquidityDeposit.load(event.address.concat(event.params.lp))
  let poolContract = SynthereumPool.bind(event.address)
  let multiplier = BigInt.fromU32(10).pow(18 - poolContract.collateralTokenDecimals() as u8)
  let depositValue = multiplier == new BigInt(0) ? event.params.collateralSent : event.params.collateralSent.times(multiplier)
  if (entity == null) {
    let entity = new LiquidityDeposit(event.address.concat(event.params.lp))
    entity.lpAddress = event.params.lp
    entity.poolAddress = event.address
    entity.totalDeposited = depositValue
    entity.save()
  } else {
    entity.totalDeposited = entity.totalDeposited.plus(depositValue)
    entity.save()
  }
}

export function handleWithdrawnLiquidity(event: WithdrawnLiquidityEvent): void {
  let entity = LiquidityWithdraw.load(event.address.concat(event.params.lp))
  let poolContract = SynthereumPool.bind(event.address)
  let multiplier = BigInt.fromU32(10).pow(18 - poolContract.collateralTokenDecimals() as u8)
  let withdrawValue = multiplier == new BigInt(0) ? event.params.collateralWithdrawn : event.params.collateralWithdrawn.times(multiplier)
  if (entity == null) {
    let entity = new LiquidityWithdraw(event.address.concat(event.params.lp))
    entity.lpAddress = event.params.lp
    entity.poolAddress = event.address
    entity.totalWithdrawn = withdrawValue
    entity.save()
  } else {
    entity.totalWithdrawn = entity.totalWithdrawn.plus(withdrawValue)
    entity.save()
  }
}