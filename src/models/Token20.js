import mongoose from '../mongoose'

const Token20Schema = new mongoose.Schema({
    address: { type: String, required: true, unique: true, index: true},
    name: { type: String, index: true},
    symbol: { type: String, index: true},
    decimals: { type: Number},
    type: {type: String, index: true}
})

export default mongoose.wallet_txs_conn.model('Token20', Token20Schema, 'token20')