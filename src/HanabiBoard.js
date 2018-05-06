import React from "react";
import HanabiCard from "./HanabiCard";

function cardStyle(card) {
    if (!card.colorKnown) {
        return { border: "3px solid black", backgroundColor: "grey" };
    }
    switch (card.color) {
        case "Red":
            return { border: "3px solid red", backgroundColor: "#FFEEEE" };
        case "Yellow":
            return { border: "3px solid yellow", backgroundColor: "#FFFFEE" };
        case "Green":
            return { border: "3px solid green", backgroundColor: "#EEFFEE" };
        case "Blue":
            return { border: "3px solid blue", backgroundColor: "#EEEEFF" };
        case "White":
            return {
                border: "3px solid white",
                backgroundColor: "#FFFFFF"
            };
        default:
        return { border: "3px solid black", backgroundColor: "grey" };
    }
}
class HanabiBoard extends React.Component {
    onDiscard(playerId, cardId) {
        if (this.isActive(playerId) &&this.props.G.hintTokens < 8){
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
    onHintColor(hintRecipient, color) {
        if (this.props.G.hintTokens > 0) {

            this.props.moves.hint(hintRecipient, true, color)
            this.props.events.endTurn();
        }
    }
    onHintValue(hintRecipient, value) {
        if (this.props.G.hintTokens > 0) {
            this.props.moves.hint(hintRecipient, false, value)
            this.props.events.endTurn();
        }
    }
    isActive(id) {
        if (!this.props.isActive) return false;
        if (+id !== +this.props.ctx.currentPlayer) return false;
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
                    (card, cardIndex) => (<HanabiCard key={playerIndex+"-"+cardIndex} playerIndex={playerIndex} 
                    card={card} cardIndex={cardIndex} currentPlayer={playerIndex === +this.props.ctx.currentPlayer} 
                    onPlay={this.onPlay.bind(this)} 
                    onDiscard={this.onDiscard.bind(this)} 
                    endTurn={this.props.events.endTurn} 
                    onHintColor={this.onHintColor.bind(this)} 
                    onHintValue={this.onHintValue.bind(this)}/>))
                
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
                        ...cardStyle(card)
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
                Hint Tokens: {this.props.G.hintTokens}
                <br />
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
