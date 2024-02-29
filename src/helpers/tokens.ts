import dotenv from 'dotenv';
dotenv.config();

const USDC_MIN_LIQUIDITY = parseInt(process.env.USDC_MIN_LIQUIDITY as string)
const USDT_MIN_LIQUIDITY = parseInt(process.env.USDT_MIN_LIQUIDITY as string)
const WETH_MIN_LIQUIDITY = parseInt(process.env.WETH_MIN_LIQUIDITY as string)

const TOKENS = {
    "0x5622f6dc93e08a8b717b149677930c38d5d50682": "WETHV2",
    "0x620fd5fa44be6af63715ef4e65ddfa0387ad13f5": "USDC",
    "0xa722c13135930332eb3d749b2f0906559d2c5b99": "WETH",
    "0x68c9736781e9316ebf5c3d49fe0c1f45d2d104cd": "USDTV2",
    "0xfadbbf8ce7d5b7041be672561bba99f79c532e10": "USDT",
    "0x28c3d1cd466ba22f6cae51b1a4692a831696391a": "USDCV2"
}

export const getTokenName = (address: string) => {
    // @ts-ignore
    return TOKENS[address]
}

export const getMinLiquidity = (token: string) => {
    if (token === "USDC" || token === "USDCV2") {
        return USDC_MIN_LIQUIDITY;
    } else if (token === "USDT" || token === "USDTV2") {
        return USDT_MIN_LIQUIDITY;
    } else if (token === "WETH" || token === "WETHV2") {
        return WETH_MIN_LIQUIDITY;
    }
    return 0;
}

export const getTokenDecimals = (token: string) => {
    if (token === "USDC" || token === "USDCV2") {
        return 6;
    } else if (token === "USDT" || token === "USDTV2") {
        return 6;
    } else if (token === "WETH" || token === "WETHV2") {
        return 18;
    }
    return 0;
}