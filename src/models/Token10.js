import mongoose from '../mongoose'

const Token10Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true},
    name: { type: String, index: true},
    abbr: { type: String, index: true},
    precision: { type: Number},
    type: {type: String, index: true}
})

export default mongoose.wallet_txs_conn.model('Token10', Token10Schema, 'token10')