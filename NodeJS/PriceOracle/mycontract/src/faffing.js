'use strict'

const lib = require('xrpl-accountlib')
const{ flagNames } = require('flagnames')
const { XrplClient } = require('xrpl-client')
const dotenv = require('dotenv')

const createSignerList = async () => {
    
    dotenv.config()
    console.log('createSignerList')
    console.log('env', 'wss://hooks-testnet-v2.xrpl-labs.com')
    const client = new XrplClient('wss://hooks-testnet-v2.xrpl-labs.com')
    // //address = rherCUfhJsj6f8AppcDs2DBLNtWwXC86CM
    // const secret = 'shTTsMzCX7QxK4J9TLe3gH3Mg1isH'
    // const master = lib.derive.familySeed(secret)

    // const account1 = 'rB7mDDCs4dVoDxf75MMG2ziTv6TYiBBCNB'
    // const account2 = 'rfqF3jL633uVxBuD4mHt8NZYQKuZt8Ryh3'
    // const account3 = 'rhpSk3UCUB3wMwH9eUzzkhdWpvLFRLsqPJ'



    //address = rLTRttqLNcaqEoF76gdFhvZnnzAzGiqVMz
    const secret = 'ss7VYYxvCwQYedsMLQguYFyUsAgjK'
    const master = lib.derive.familySeed(secret)

    const account1 = 'rUGeTkDDgi9bogBeLSg63MCX9z8CD6Tx1F'
    const account1_secret = 'ssUuFwgb2ZsDccA9XGqVtgarYtLZs'
    const account2 = 'r4EezkWyjArbZRGhTA3LoepzppuKq1qvgV'
    const account2_secret = 'sszfN6BFkkKjRptK3aomAeAzzN2Yo'
    const account3 = 'rsX6TkVxWQByiijNnQw8eu5D83kYcjp37S'
    const account3_secret = 'sh3UmcKoa6xHsCdLUsVCJskQbfcRJ'


    const {account_data} = await client.send({
        'command': 'account_info',
        account: master.address
    })
    console.log(flagNames(account_data.LedgerEntryType, account_data.Flags))
    console.log('account_data', account_data)

    const {account_objects} = await client.send({
        'command': 'account_objects',
        account: master.address
    })
    // console.log('account_objects', account_objects[0])
    // console.log('LedgerEntryType', account_objects[0].LedgerEntryType)
    // console.log('Flags', account_objects[0].Flags)
    // console.log(flagNames(account_objects.LedgerEntryType, account_objects.Flags))

    /*
    const payload = {
        TransactionType: 'SignerListSet',
        Account: master.address,
        Fee: '10',
        Sequence: account_data.Sequence,
        SignerQuorum: 3,
        SignerEntries: [{
            SignerEntry: {
                Account: account1,
                SignerWeight: 1
            }
        }, 
        {
            SignerEntry: {
                Account: account2,
                SignerWeight: 1
            }
        },
        {
            SignerEntry: {
                Account: account3,
                SignerWeight: 1
            }
        }]
    }
    */
    
    const {signedTransaction} = lib.sign(payload, master)
    const result = await client.send({
        command: 'submit',
        tx_blob: signedTransaction
    })
    console.log('result', result)
    
    client.close()
}

const updateSignerList = async () => {
    dotenv.config()
    console.log('updateSignerList')
    console.log('env', 'wss://hooks-testnet-v2.xrpl-labs.com')
    const client = new XrplClient('wss://hooks-testnet-v2.xrpl-labs.com')
    // //address = rherCUfhJsj6f8AppcDs2DBLNtWwXC86CM
    // const secret = 'shTTsMzCX7QxK4J9TLe3gH3Mg1isH'
    // const master = lib.derive.familySeed(secret)

    // const account1 = 'rB7mDDCs4dVoDxf75MMG2ziTv6TYiBBCNB'
    // const account2 = 'rfqF3jL633uVxBuD4mHt8NZYQKuZt8Ryh3'
    // const account3 = 'rhpSk3UCUB3wMwH9eUzzkhdWpvLFRLsqPJ'



    //address = rLTRttqLNcaqEoF76gdFhvZnnzAzGiqVMz
    const secret = 'ss7VYYxvCwQYedsMLQguYFyUsAgjK'
    const master = lib.derive.familySeed(secret)

    //'rUGeTkDDgi9bogBeLSg63MCX9z8CD6Tx1F'
    //'ssUuFwgb2ZsDccA9XGqVtgarYtLZs'
    const account1 = lib.derive.familySeed('ssUuFwgb2ZsDccA9XGqVtgarYtLZs')
    
    // 'r4EezkWyjArbZRGhTA3LoepzppuKq1qvgV'
    // 'sszfN6BFkkKjRptK3aomAeAzzN2Yo'
    const account2 = lib.derive.familySeed('sszfN6BFkkKjRptK3aomAeAzzN2Yo')
    // 'rsX6TkVxWQByiijNnQw8eu5D83kYcjp37S'
    // 'sh3UmcKoa6xHsCdLUsVCJskQbfcRJ'
    const account3 = lib.derive.familySeed('sh3UmcKoa6xHsCdLUsVCJskQbfcRJ')

    //  'rDJDVPFUpatsW9t6dwN5am8sddHFFNm9xY'
    // 'ssEpyeYN6D2THYZkbxASG1hhpLSK1'

    const account4 = lib.derive.familySeed('ssEpyeYN6D2THYZkbxASG1hhpLSK1')

    const {account_data} = await client.send({
        'command': 'account_info',
        account: master.address
    })
    console.log('account_data', account_data)

    const {account_objects} = await client.send({
        'command': 'account_objects',
        account: master.address
    })
    console.log('account_objects', account_objects)

    const payload = {
        TransactionType: 'SignerListSet',
        Account: master.address,
        Fee: String((3 + 1) + 40), // (n +1) * fee
        Sequence: account_data.Sequence,
        SignerQuorum: 3,
        SignerEntries: [{
            SignerEntry: {
                Account: account1.address,
                SignerWeight: 1
            }
        }, 
        {
            SignerEntry: {
                Account: account2.address,
                SignerWeight: 1
            }
        },
        {
            SignerEntry: {
                Account: account4.address,
                SignerWeight: 1
            }
        }]
    }
    
    //account1.signAs('rAddress'))
    //const {signedTransaction} = lib.sign(payload, [account1, account2, account3])
    const signedTransaction1 = lib.sign(payload, account1.signAs(String(account1.address)))
    console.log('signedTransaction1', signedTransaction1.signedTransaction)
    const signedTransaction2 = lib.sign(payload, account2.signAs(String(account2.address)))
    console.log('signedTransaction2', signedTransaction2.signedTransaction)
    const signedTransaction3 = lib.sign(payload, account3.signAs(String(account3.address)))
    console.log('signedTransaction3', signedTransaction3.signedTransaction)
    //console.log('signedTransaction', s.signers)
    // console.log('signedTransaction', signedTransaction)


    // const result = await client.send({
    //     command: 'submit',
    //     tx_blob: signedTransaction
    // })
    // console.log('result', result)

    client.close()
    return 
}
const validateSignerListPresent = async (address) => {
    const client = new XrplClient('wss://hooks-testnet-v2.xrpl-labs.com')
    const {account_objects} = await client.send({
        'command': 'account_objects',
        account: address
    })
    // console.log('account_objects', account_objects)

    for (let index = 0; index < account_objects.length; index++) {
        const element = account_objects[index]
        if (element?.LedgerEntryType == 'SignerList') {
            return true
        }
    }
    return false
}

const dissableMasterKey = async () => {
    console.log('env', 'wss://hooks-testnet-v2.xrpl-labs.com')
    const client = new XrplClient('wss://hooks-testnet-v2.xrpl-labs.com')
    //address = rherCUfhJsj6f8AppcDs2DBLNtWwXC86CM
    const secret = 'shTTsMzCX7QxK4J9TLe3gH3Mg1isH'
    const master = lib.derive.familySeed(secret)

    const {account_data} = await client.send({
        'command': 'account_info',
        account: master.address
    })
    console.log('account_data', account_data)

    const asfDisableMaster = 4
    const payload = {
        TransactionType: 'AccountSet',
        Account: master.address,
        Fee: '10',
        Sequence: account_data.Sequence,
        SetFlag: asfDisableMaster
    }

    const {signedTransaction} = lib.sign(payload, master)
    const result = await client.send({
        command: 'submit',
        tx_blob: signedTransaction
    })
    console.log('result', result)
    return
}


const run = async () => {
    if (await validateSignerListPresent('rherCUfhJsj6f8AppcDs2DBLNtWwXC86CM')) {
        await updateSignerList()
    }
    else {
        await createSignerList()
    }
}

run()
