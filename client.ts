import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("AVcFQ9iyzWnoLiGH1k9NqLgfhyQP1tV3iqwAv1XCKcXc");

const connection = new Connection("https://api.devnet.solana.com");

export async function setupProgram(provider: anchor.AnchorProvider) {
  const idl = {
    version: "0.1.0",
    name: "powerpuff_game",
    instructions: [
      {
        name: "initialize",
        accounts: [
          { name: "game", isMut: true, isSigner: true },
          { name: "user", isMut: true, isSigner: true },
          { name: "systemProgram", isMut: false, isSigner: false }
        ],
        args: [{ name: "character", type: "u8" }]
      },
      {
        name: "play",
        accounts: [
          { name: "game", isMut: true, isSigner: false }
        ],
        args: []
      }
    ],
    accounts: [
      {
        name: "game",
        type: {
          kind: "struct",
          fields: [
            { name: "player", type: "publicKey" },
            { name: "character", type: "u8" },
            { name: "score", type: "u64" }
          ]
        }
      }
    ]
  };

  const program = new anchor.Program(idl as any, PROGRAM_ID, provider);

  return program;
}

export async function createGame(program: any, provider: any, character: number) {
  const game = Keypair.generate();

  await program.methods.initialize(character)
    .accounts({
      game: game.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([game])
    .rpc();

  return game;
}

export async function playGame(program: any, game: any) {
  await program.methods.play()
    .accounts({
      game: game.publicKey
    })
    .rpc();
}