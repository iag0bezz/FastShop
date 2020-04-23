const paypal = require('paypal-rest-sdk')

paypal.configure({
    mode: 'sandbox',
    client_id: 'AbiSeS_c8GA4aawrjNrMfn8B1stExPZzfnYU3uJ2VftozYtBXVBBOPv2ongvYWGb0RUxaSyJa_X-gShC',
    client_secret: 'ED_AoaeO1lmVKbbRZsiYJuoXxXg-dXaqsn5VRyM4nwOtl13hiaFSMRLJQAyB9doQk2pqSi7E7feifjZr'
})

module.exports = paypal