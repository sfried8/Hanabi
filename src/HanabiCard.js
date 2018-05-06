import React from "react";

function cardStyle(card) {
    if (!card.colorKnown) {
        return { border: "3px solid black", backgroundColor: "grey" };
    }
    switch (card.color) {
        case "Red":
            return { border: "3px solid red", backgroundColor: "#FFDDDD" };
        case "Yellow":
            return { border: "3px solid yellow", backgroundColor: "#FFFFDD" };
        case "Green":
            return { border: "3px solid green", backgroundColor: "#DDFFDD" };
        case "Blue":
            return { border: "3px solid blue", backgroundColor: "#DDDDFF" };
        case "White":
            return {
                border: "3px solid white",
                backgroundColor: "#FFFFFF"
            };
                    default:
        return { border: "3px solid black", backgroundColor: "grey" };
    }
}
class HanabiCard extends React.Component {
    render() {
        const cellStyle = {
            width: "22%",
            height: "80px",
            lineHeight: "80px",
            textAlign: "center",
            boxShadow: "3px 3px 5px #848484, 0 0 10px #CCC",
            borderRadius: "5px",
            backgroundColor: "white"
        };

        const card = this.props.card;
        const cardIndex = this.props.cardIndex;
        const playerIndex = this.props.playerIndex;
        return this.props.currentPlayer ? (
            <div
                style={{
                    ...cellStyle,
                    ...cardStyle(card),
                    display: "flex",
                    justifyContent: "stretch"
                }}
                key={cardIndex}
            >
                <button
                    style={{ width: "25%" }}
                    onClick={() => this.props.onPlay(playerIndex, cardIndex)}
                >
                    Play
                </button>
                <button
                    style={{ width: "25%" }}
                    onClick={() => this.props.onDiscard(playerIndex, cardIndex)}
                >
                    Discard
                </button>
                <button
                    style={{ width: "25%" }}
                    onClick={() => this.props.endTurn()}
                >
                    Pass
                </button>
                {card.colorKnown ? card.color : "?"}
                {card.valueKnown ? card.value : "?"}
            </div>
        ) : (
            <div
                style={{
                    ...cellStyle,
                    ...cardStyle(card)
                }}
                key={cardIndex}
            >
                <button
                    onClick={() =>
                        this.props.onHintColor(
                            this.props.playerIndex,
                            card.color
                        )
                    }
                >
                    Color hint
                </button>
                <button
                    onClick={() =>
                        this.props.onHintValue(playerIndex, card.value)
                    }
                >
                    Number hint
                </button>
                {card.color} {card.value}
            </div>
        );
    }
}
export default HanabiCard;
