import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import AllCards from './AllCards';
import './Deck.css';

const Deck = () => {
    const newDeckUrl = 'https://www.deckofcardsapi.com/api/deck/new/';

    const [deckId, setDeckId] = useState('');
    const [errorExists, setErrorExists] = useState(false);
    const [currCard, setCurrCard] = useState(null);
    const [drawClicked, setDrawClicked] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(true);
    const [prevCards, setPrevCards] = useState([]);

    async function openDeck() {
        const response = await axios.get(newDeckUrl);
        setErrorExists(false);
        setDeckId(response.data.deck_id);
        setButtonsDisabled(false);
    }

    useEffect(() => {
        try {
            openDeck();
        }
        catch (err) {
            setErrorExists({
                err: true,
                msg: "Problem loading deck. Please check connection and try again."
            });
        };
    }, []);



    async function drawCard() {
        try {
            const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            const card = response.data.cards[0].image;
            return setCurrCard(card);
            
        } catch (err) {
            console.log("catching")
            setErrorExists({
                err: true,
                msg: "No more cards in deck!"
            });
        };
    };


    useEffect(() => {
        if (currCard !== null) {
            setPrevCards([currCard, ...prevCards])
        }
    }, [currCard]);
    
    async function shuffleDeck() {
        setPrevCards([]);
        setCurrCard(null);
        await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`);
        drawCard();
        setButtonsDisabled(false);
    }

    function checkErrorsBeforeRender() {
        return !(errorExists) ? <Card card={currCard} /> : <h1>{errorExists.msg}</h1>
    }

    const mainRender = checkErrorsBeforeRender();

    return (
        <div>
            <div>
                <button className="deck-btn" disabled={buttonsDisabled}
                    onClick={() => {
                        setButtonsDisabled(true);
                        shuffleDeck();
                    }}>SHUFFLE DECK</button>

                <button className="deck-btn" disabled={buttonsDisabled}
                    onClick={() => {
                        setButtonsDisabled(true);
                        setPrevCards([]);
                        setCurrCard(null);
                        openDeck();
                    }}>NEW DECK</button>

                <span className="deck-draw-btn-span">
                    <button className="deck-btn deck-draw-btn" disabled={buttonsDisabled}
                        onClick={() => {
                            drawCard()
                        }}>DRAW CARD</button>
                </span>

            </div>
            <div className="deck-cards-div">
                {mainRender}
            </div>
            {(prevCards) ? <AllCards cards={prevCards} currCard={currCard} /> : <></>}
        </div>
    )
};

export default Deck;