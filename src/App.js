import { Client } from "boardgame.io/react";
import { Game } from "boardgame.io/core";
import HanabiBoard from "./HanabiBoard";
import Shuffle from "shuffle-array";

const COLORS = ["Red", "Yellow", "Green", "Blue", "White"];
function score(stacks) {
    return COLORS.reduce((acc, color) => acc + stacks[color], 0);
}
const Hanabi = Game({
    setup: () => {
        const deck = Shuffle(
            [].concat.apply(
                [],
                COLORS.map(color =>
                    [1, 1, 1, 2, 2, 3, 3, 4, 4, 5].map(value => ({
                        color,
                        value
                    }))
                )
            )
        );
        const players = Array(4)
            .fill(null)
            .map(() => deck.splice(0, 4));
        return {
            deck,
            players,
            discardedCards: [],
            strikes: 0,
            hintTokens: 8,
            stacks: { Red: 0, Yellow: 0, Green: 0, Blue: 0, White: 0 }
        };
    },

    moves: {
        discardCard(G, ctx, card) {
            if (G.hintTokens < 8) {
                let deck = [...G.deck];
                let players = [...G.players]; // don't mutate original state.
                let discardedCards = [...G.discardedCards];
                let playersCards = [...players[ctx.currentPlayer]];
                discardedCards.push(playersCards.splice(card, 1)[0]);

                players[ctx.currentPlayer] = [
                    ...playersCards,
                    deck.splice(0, 1)[0]
                ];
                return {
                    ...G,
                    players,
                    discardedCards,
                    deck,
                    hintTokens: G.hintTokens + 1
                }; // don't mutate original state.
            }
        },
        playCard(G, ctx, cardIndex) {
            const players = [...G.players];
            const cards = [...players[ctx.currentPlayer]];
            const deck = [...G.deck];
            const playedCard = cards.splice(cardIndex, 1)[0];
            players[ctx.currentPlayer] = [...cards, deck.splice(0, 1)[0]];
            const stacks = { ...G.stacks };
            const discardedCards = [...G.discardedCards];
            let strikes = G.strikes;
            let hintTokens = G.hintTokens;
            if (stacks[playedCard.color] === playedCard.value - 1) {
                stacks[playedCard.color]++;
                if (playedCard.value === 5 && hintTokens < 8) {
                    hintTokens++;
                }
            } else {
                discardedCards.push(playedCard);
                strikes++;
            }

            return {
                ...G,
                deck,
                players,
                stacks,
                discardedCards,
                strikes,
                hintTokens
            };
        },
        hint(G, ctx, playerIndex, isColor, hintValue) {
            if (G.hintTokens > 0) {
                const players = [...G.players];
                players[playerIndex] = [...players[playerIndex]].map(card => ({
                    value: card.value,
                    color: card.color,
                    colorKnown:
                        card.colorKnown ||
                        (isColor && card.color === hintValue),
                    valueKnown:
                        card.valueKnown ||
                        (!isColor && card.value === hintValue)
                }));
                return { ...G, players, hintTokens: G.hintTokens - 1 };
            }
        }
    },
    flow: {
        endGameIf: (G, ctx) => {
            if (G.strikes === 3 || score(G.stacks) === 25) {
                return score(G.stacks);
            }
        }
    }
});

const App = Client({
    game: Hanabi,
    numPlayers: 4,
    board: HanabiBoard,
    debug: true
});

export default App;
