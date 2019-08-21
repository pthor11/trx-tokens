import axios from 'axios'
import Token10 from './models/Token10'
import Token20 from './models/Token20'
import cron from 'node-cron'
import config from './config'

const limit = parseInt(config.limit)
const cron_string = config.cron_string

const getTRC20 = async () => {
    try {
        let token20s = []

        const res = await axios.get(`https://apilist.tronscan.org/api/token_trc20?limit=${limit}&start=0`)
        token20s = [...token20s, ...res.data.trc20_tokens]

        const total = res.data.total

        const num_page = Math.floor(total / limit)

        for (let i = 1; i <= num_page; i++) {
            const res = await axios.get(`https://apilist.tronscan.org/api/token_trc20?limit=${limit}&start=${i * limit}`)
            if (res.data.trc20_tokens) {
                token20s = [...token20s, ...res.data.trc20_tokens]
            }
        }

        return Promise.all(token20s.map(token20 => {
            const trc20 = {
                address: token20.contract_address,
                name: token20.name,
                symbol: token20.symbol,
                decimals: token20.decimals,
                type: 'trc20'
            }
            return Token20.findOneAndUpdate({ address: trc20.address }, trc20, { upsert: true, new: true })
        }))
    } catch (error) {
        throw new Error(error)
    }
}

const getTRC10 = async () => {
    try {
        let token10s = []

        const res = await axios.get(`https://apilist.tronscan.org/api/token?sort=-name&limit=${limit}&start=0&status=ico`)
        token10s = [...token10s, ...res.data.data]

        const total = res.data.total

        const num_page = Math.floor(total / limit)

        for (let i = 1; i <= num_page; i++) {
            const res = await axios.get(`https://apilist.tronscan.org/api/token?sort=-name&limit=${limit}&start=${i * limit}&status=ico`)
            if (res.data.data) {
                token10s = [...token10s, ...res.data.data]
            } else {
                console.log('error');
                console.log({ res: res.data })

            }
        }

        return Promise.all(token10s.map(token10 => {
            const trc10 = {
                id: token10.id,
                name: token10.name,
                abbr: token10.abbr,
                precision: token10.precision,
                type: 'trc10'
            }
            // console.log(trc10);

            return Token10.findOneAndUpdate({ id: trc10.id }, trc10, { upsert: true, new: true })
        }))
    } catch (error) {
        throw new Error(error)
    }
}

const start = () => {
    cron.schedule(cron_string, async () => {
        console.log(`start getting...`)
        const [trc10s, trc20s] = await Promise.all([
            getTRC10(),
            getTRC20()
        ]) 
        console.log(`get and saved ${trc10s.length} trc10, ${trc20s.length} trc20`)
    })
}

start()