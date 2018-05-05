import React from "react";

class HanabiBoard extends React.Component {
    onDiscard(playerId, cardId) {
        if (this.isActive(playerId)) {
            this.props.moves.discardCard(cardId);
            this.props.events.endTurn();
        }
    }
    onPlay(playerId, cardId) {
        if (this.isActive(playerId)) {
            this.props.moves.playCard(cardId);
            this.props.events.endTurn();
        }
    }

    isActive(id) {
        if (!this.props.isActive) return false;
        if (id !== +this.props.ctx.currentPlayer) return false;
        return true;
    }

    render() {
        let winner = "";
        if (this.props.ctx.gameover !== null) {
            winner = <div>Winner: {this.props.ctx.gameover}</div>;
        }

        const cellStyle = {
            width: "22%",
            height: "80px",
            lineHeight: "80px",
            textAlign: "center",
            boxShadow: "3px 3px 5px #848484, 0 0 10px #CCC",
            borderRadius: "5px",
            backgroundColor: "white"
        };

        const playerRows = this.props.G.players
            .map((player, playerIndex) =>
                player.map(
                    (card, cardIndex) =>
                        playerIndex === +this.props.ctx.currentPlayer ? (
                            <div
                                style={{
                                    ...cellStyle,
                                    border: "3px solid black",
                                    display: "flex",
                                    justifyContent: "stretch"
                                }}
                                key={cardIndex}
                            >
                                <button
                                    style={{ width: "25%" }}
                                    onClick={() =>
                                        this.onPlay(playerIndex, cardIndex)
                                    }
                                >
                                    Play
                                </button>
                                <button
                                    style={{ width: "25%" }}
                                    onClick={() =>
                                        this.onDiscard(playerIndex, cardIndex)
                                    }
                                >
                                    Discard
                                </button>
                                <button
                                    style={{ width: "25%" }}
                                    onClick={() => this.props.events.endTurn()}
                                >
                                    Pass
                                </button>
                                {card.color} {card.value}
                            </div>
                        ) : (
                            <div
                                style={{
                                    ...cellStyle,
                                    border: "3px solid " + card.color
                                }}
                                key={cardIndex}
                                onClick={() =>
                                    this.onClick(playerIndex, cardIndex)
                                }
                            >
                                {card.color} {card.value}
                            </div>
                        )
                )
            )
            .map((playerRow, playerRowIndex) => (
                <div
                    key={playerRowIndex}
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "70%",
                        margin: "20px",
                        padding: "15px",
                        background: "transparent",
                        backgroundColor:
                            playerRowIndex === +this.props.ctx.currentPlayer
                                ? "#DFFFDF"
                                : "white",
                        boxShadow:
                            playerRowIndex === +this.props.ctx.currentPlayer
                                ? "0 0 25px #DFFFDF"
                                : "none"
                    }}
                >
                    {playerRow}
                </div>
            ));
        const discardPile = this.props.G.discardedCards.map(
            (card, cardIndex) => (
                <div
                    style={{
                        ...cellStyle,
                        width: "80px",
                        border: "3px solid " + card.color
                    }}
                    key={"discard" + cardIndex}
                >
                    {card.color} {card.value}
                </div>
            )
        );
        return (
            <div style={{ userSelect: "none" }}>
                {playerRows}
                Stacks:<div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "400px"
                    }}
                >
                    {["Red", "Yellow", "Green", "Blue", "White"].map(color => (
                        <div key={color + "stack"}>
                            {color}: {this.props.G.stacks[color]}
                        </div>
                    ))}
                </div>
                Strikes: {this.props.G.strikes}
                <br />Discard:
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {discardPile}
                </div>
                {winner}
            </div>
        );
    }
}
export default HanabiBoard;
