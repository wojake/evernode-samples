const evernode = require('evernode-js-client')
const dotenv = require('dotenv')
dotenv.config()

const tenantCredentials = {
    address: process.env.XRPL_SOURCE_ACCOUNT,
    secret: process.env.XRPL_SOURCE_ACCOUNT_SECRET
}

async function app() {

    // Content goes here.
    const xrplApi = new evernode.XrplApi(process.env.ENDPOINT)
    evernode.Defaults.set({
        registryAddress: 'r3cNR2bdao1NyvQ5ZuQvCUgqkoWGmgF34E',
        xrplApi: xrplApi
    })


    const tenantClient = new evernode.TenantClient(tenantCredentials.address, tenantCredentials.secret)
    await tenantClient.connect()
    await tenantClient.prepareAccount()

    await getEvers(tenantClient)


    const registryClient = new evernode.RegistryClient()
    await registryClient.connect()
    // Get only the hosts which has available slots.
    const hosts = (await registryClient.getActiveHosts()).filter(h => h.maxInstances - h.activeInstances > 0)
    //    console.log('hosts', hosts)
    // Pick a random host.
    const pickedHost = hosts[Math.floor(Math.random() * hosts.length)]
    console.log('pickedHost', pickedHost)

    let instanceName
    try {
        const result = await tenantClient.acquireLease(pickedHost.address, {
            owner_pubkey: "ed2e551183a830b422a5aec5cd5079834c7a5cbb71a79b818e8828f8f05f949445b0955c124248736762e907da797d98688f9caf226fa4d27b9352a44e79d62707", // Replace the public key you've received in Step 3
            contract_id: "dc411912-bcdd-4f73-af43-32ec45844b9a",
            image: "hp.latest-ubt.20.04-njs.16",
            config: {}
        })
        console.log('Tenant received instance ', result.instance)
        instanceName = result.instance.name
    }
    catch (err) {
        console.log("Tenant received acquire error: ", err.reason)
    }

    if (instanceName) {
        try {
            const result = await tenantClient.extendLease(pickedHost.address, 2, instanceName)
            console.log(`Extend ref id: ${result.extendeRefId}, Expiry moments: ${result.expiryMoment}`)
        }
        catch (err) {
            console.log("Tenant received extend error: ", err.reason)
        }
    }


    await tenantClient.disconnect()
    await registryClient.disconnect()
    await xrplApi.disconnect()
}

const getEvers = async (tenantClient) => {
    // Get the available EVR balance.
    let balance = await tenantClient.getEVRBalance()
    // Request EVRs if we do not have enough.
    if (balance < 4) {
        // Create the trustline if not created.
        const lines = await tenantClient.xrplAcc.getTrustLines(evernode.EvernodeConstants.EVR, tenantClient.config.evrIssuerAddress)
        if (!lines || lines.length === 0)
            await tenantClient.xrplAcc.setTrustLine(evernode.EvernodeConstants.EVR, tenantClient.config.evrIssuerAddress, "99999999")

        // Send the EVR request transaction.
        const x = await tenantClient.xrplAcc.makePayment(tenantClient.config.foundationAddress,
            evernode.XrplConstants.MIN_XRP_AMOUNT,
            evernode.XrplConstants.XRP,
            null,
            [{ type: 'giftBetaTenantEvr', format: '', data: '' }])
        // Wait until the EVRs are received.
        let attempts = 0
        while (attempts >= 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            balance = await tenantClient.getEVRBalance()
            if (balance < 4) {
                if (++attempts <= 20)
                    continue;
                throw "EVR funds not received within timeout."
            }
            break
        }
    }

    balance = await tenantClient.getEVRBalance()
}

app().catch(console.error).finally(() => { process.exit(0) })