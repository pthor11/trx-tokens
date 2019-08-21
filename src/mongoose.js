import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const wallet_txs_uri = `mongodb://ovh:Silotech123@54.39.105.77:27017/wallet-txs?authSource=admin`

const opts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    reconnectTries: Number.MAX_VALUE, 
    reconnectInterval: 1000
}

mongoose.wallet_txs_conn = mongoose.createConnection(wallet_txs_uri, opts)

export default mongoose