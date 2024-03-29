import hre from 'hardhat'

// Types
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Project Tools
import { handleContractFunction } from '../tools/contract'
import { logAccountsInfo } from '../tools/logs/info'
import { logProcessParameters, logProcessReceipt } from '../tools/logs/process'
import { sleep } from '../tools/time'

// Project Constants
import { processTimeout, requestTimeout } from '../constants'

// Script
export const transfer = async (
    contract: Contract,
    signer: SignerWithAddress,
    recipient: string,
    amount: number,
): Promise<void> => {
    console.log(`\n----------------------------------------`)
    console.log(`----- Transfer Process Initialized -----`)
    console.log(`----------------------------------------\n`)

    let contractName: string = 'null'

    if (Object.hasOwn(contract, 'name')) {
        contractName = await contract.name()
        await sleep(requestTimeout)
    }

    await logAccountsInfo(
        [contract.address, signer.address, recipient],
        [contractName, 'signer', 'recipient'],
        hre,
    )

    const states = await logProcessParameters(
        contract,
        signer,
        'transfer',
        [recipient, amount],
        ['to', 'amount'],
    )

    await handleContractFunction(contract, 'transfer', signer, recipient, amount)

    await logProcessReceipt(contract, signer, 'transfer', [recipient, amount], states)

    console.log(`\n---------------------------------------`)
    console.log(`----- Transfer Process Finalized -----`)
    console.log(`---------------------------------------\n`)

    await sleep(processTimeout)
}
