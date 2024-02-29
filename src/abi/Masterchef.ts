export const MasterchefABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "pid",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "tokenid",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "reward",
                "type": "uint256"
            }
        ],
        "name": "Harvest",
        "type": "event"
    },
]