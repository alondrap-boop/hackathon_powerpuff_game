use anchor_lang::prelude::*;

declare_id!("AVcFQ9iyzWnoLiGH1k9NqLgfhyQP1tV3iqwAv1XCKcXc");

#[program]
pub mod powerpuff_game {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, character: u8) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.player = *ctx.accounts.user.key;
        game.character = character;
        game.score = 0;
        Ok(())
    }

    pub fn play(ctx: Context<Play>) -> Result<()> {
        let game = &mut ctx.accounts.game;

        let points = match game.character {
            0 => 10, // Bombón
            1 => 5,  // Burbuja
            2 => 7,  // Bellota
            _ => 1,
        };

        game.score += points;
        Ok(())
    }
}

#[account]
pub struct Game {
    pub player: Pubkey,
    pub character: u8,
    pub score: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32 + 1 + 8)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
}