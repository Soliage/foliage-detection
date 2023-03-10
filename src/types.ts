export interface VisionOutput {
    id: string
    mintAddress: string
    value: string
}

export type Soliage = {
    "version": "0.1.0",
    "name": "soliage",
    "instructions": [
      {
        "name": "createOracle",
        "accounts": [
          {
            "name": "oracle",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "oracleProvider",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "nftOwner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "nftAddress",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u32"
          }
        ]
      },
      {
        "name": "update",
        "accounts": [
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracle",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "nftOwner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "cotMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "cotMintAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userCotTokenBag",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "cotMintAuthorityBump",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u32"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "oracleAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "nftOwner",
              "type": "publicKey"
            },
            {
              "name": "oracleProvider",
              "type": "publicKey"
            },
            {
              "name": "nftAddress",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u32"
            },
            {
              "name": "timestamp",
              "type": "u64"
            }
          ]
        }
      }
    ]
  };
  
  export const IDL: Soliage = {
    "version": "0.1.0",
    "name": "soliage",
    "instructions": [
      {
        "name": "createOracle",
        "accounts": [
          {
            "name": "oracle",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "oracleProvider",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "nftOwner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "nftAddress",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u32"
          }
        ]
      },
      {
        "name": "update",
        "accounts": [
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracle",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "nftOwner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "cotMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "cotMintAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userCotTokenBag",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "cotMintAuthorityBump",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u32"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "oracleAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "nftOwner",
              "type": "publicKey"
            },
            {
              "name": "oracleProvider",
              "type": "publicKey"
            },
            {
              "name": "nftAddress",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u32"
            },
            {
              "name": "timestamp",
              "type": "u64"
            }
          ]
        }
      }
    ]
  };
  