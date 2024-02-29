import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

export const sendSlackMessage = async (message: string) => {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) {
        throw new Error("SLACK_WEBHOOK_URL is not defined");
    }
    const response = await axios.post(url, { text: message });
    return response;
}

export const sendLowLiquidityAlert = async (token: string, liquidity: number, explorerUrl: string, contract: string) => {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) {
        throw new Error("SLACK_WEBHOOK_URL is not defined");
    }
    const response = await axios.post(url, {
        blocks: [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Low Liquidity Alert!",
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*Contract:*\n${contract}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Token:*\n${token}`
                    }
                ]
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*Available Liquidity:*\n${liquidity}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Contract:*\n<${explorerUrl}|${contract}>`
                    }
                ]
            }
        ]
    });
    return response;
}

export const sendLowBalanceAlert = async (balance: string, explorerUrl: string) => {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) {
        throw new Error("SLACK_WEBHOOK_URL is not defined");
    }
    const response = await axios.post(url, {
        blocks: [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Bot Low On Balance",
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*Current Balance:*\n${balance}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Contract:*\n<${explorerUrl}>`
                    }
                ]
            }
        ]
    });
    return response;
}