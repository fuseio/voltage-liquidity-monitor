import { ethers } from "ethers";
import { ABI as PegSwapABI } from "../abi/PegSwap";
import { MasterchefABI } from "../abi/Masterchef";
import dotenv from 'dotenv';
import { getTokenName, getMinLiquidity, getTokenDecimals } from "./tokens";
import { getERC20Balance } from "./erc20";
import { sendLowBalanceAlert, sendLowLiquidityAlert } from "./slack";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER as any);
const WFUSE_ADDRESS = "0x0BE9e53fd7EDaC9F859882AfdDa116645287C629";

export const registerListeners = () => {
    registerPegswap()
    registerMasterChef()
}

const registerPegswap = async () => {
    const pegSwapContractAddress = process.env.PEGSWAP_CONTRACT_ADDRESS as string;
    const pegswapContract = new ethers.Contract(pegSwapContractAddress, PegSwapABI, provider);
    pegswapContract.on("TokensSwapped", async (amount: BigInt, source: string, target: string, caller: string) => {
        console.log("TokensSwapped event:", amount.toString(), source, target, caller);
        try {
            const tokenIn = getTokenName(source.toLowerCase());
            const tokenOut = getTokenName(target.toLowerCase());
            const tokenInLiquidity = getMinLiquidity(tokenIn);
            const tokenOutLiquidity = getMinLiquidity(tokenOut);
            const tokenInDecimals = getTokenDecimals(tokenIn);
            const tokenOutDecimals = getTokenDecimals(tokenOut);
            const tokenInAvailableLiquidity = await getERC20Balance(source, pegSwapContractAddress, process.env.WEB3_PROVIDER as string, tokenInDecimals);
            const tokenOutAvailableLiquidity = await getERC20Balance(target, pegSwapContractAddress, process.env.WEB3_PROVIDER as string, tokenOutDecimals);
            if (parseFloat(tokenInAvailableLiquidity) < tokenInLiquidity) {
                console.log(`${tokenIn} liquidity is low, sending alert`);
                sendLowLiquidityAlert(tokenIn, parseFloat(tokenInAvailableLiquidity), `${process.env.EXPLORER_URL}/address/${pegSwapContractAddress}`, "PegSwap");
            }
            if (parseFloat(tokenOutAvailableLiquidity) < tokenOutLiquidity) {
                console.log(`${tokenOut} liquidity is low, sending alert`);
                sendLowLiquidityAlert(tokenOut, parseFloat(tokenOutAvailableLiquidity), `${process.env.EXPLORER_URL}/address/${pegSwapContractAddress}`, "PegSwap");
            }
        } catch (e) {
            console.log("Error in TokensSwapped event:", e);
        }
    });
}

const registerMasterChef = async () => {
    const masterchefContractAddress = process.env.MASTERCHEF_CONTRACT_ADDRESS as string;
    const masterchefContract = new ethers.Contract(masterchefContractAddress, MasterchefABI, provider);
    masterchefContract.on("Harvest", async (sender: string, to: string, pid: BigInt, tokenId: BigInt, token: string, reward: BigInt) => {
        try {
            const wfuseBalance = await getERC20Balance(WFUSE_ADDRESS, masterchefContractAddress, process.env.WEB3_PROVIDER as string, 18);
            if (parseFloat(wfuseBalance) < parseFloat(process.env.WFUSE_MIN_LIQUIDITY as string)) {
                console.log("WFUSE balance is low, sending alert");
                sendLowLiquidityAlert("WFUSE", parseFloat(wfuseBalance), `${process.env.EXPLORER_URL}/address/${masterchefContractAddress}`, "MasterChef");
            }
        } catch (e) {
            console.log("Error in Harvest event:", e);
        }
    })
}

export const checkBalance = async () => {
    const address = process.env.BOT_ADDRESS as string;
    const balance = await provider.getBalance(address);
    const minBalance = process.env.BOT_MIN_BALANCE as string;
    if (balance.lt(ethers.utils.parseEther(minBalance))) {
        console.log("Balance is low, sending alert");
        const explorerUrl = `https://explorer.fuse.io/address/${address}`;
        sendLowBalanceAlert(ethers.utils.formatEther(balance), explorerUrl);
    }
}