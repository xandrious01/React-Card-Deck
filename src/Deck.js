import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

const Deck = () => {
    const newDeckUrl = 'https://www.deckofcardsapi.com/api/deck/new/';

    const [deckId, setDeckId] = useState('');
    const [newDeckClicked, setNewDeckClicked] = useState(false);
    const [errorExists, setErrorExists] = useState(false);

    useEffect(() => {
        async function openDeck() {
            const response = await axios.get(newDeckUrl);
            setDeckId(response.data.deck_id);
        }
        try {
            openDeck();
        }
        catch (err) {
            setErrorExists({
                err: true,
                msg: "Problem loading deck. Please check connection and try again."
            });
        };
    }, [newDeckClicked]);

    const [currCard, setCurrCard] = useState(null);
    const [drawClicked, setDrawClicked] = useState(false);
    // const [drawBtnDisabled, setDrawBtnDisabled] = useState(false);
    const [shuffleClicked, setShuffleClicked] = useState(false);
    const [shuffleDisabled, setShuffleDisabled] = useState(false);

    useEffect(() => {
        async function drawCard() {
            try {
                const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
                const card = response.data.cards[0].image;
                setCurrCard(card);
            } catch (err) {
                setErrorExists({
                    err: true,
                    msg: "No more cards in deck!"
                });
            };
        };
        drawCard();
        setDrawClicked(false);
    }, [drawClicked])

    // useEffect(() => {
    //     setDrawClicked(false);
    // }, [currCard])

    useEffect(() => {
        async function shuffleDeck() {
            setCurrCard(null);
            await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`);
        }
        async function drawNext() {
            const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            const card = response.data.cards[0].image;
            setCurrCard(card);
        }
        if (shuffleClicked === true) {
            shuffleDeck();
            drawNext();
        }
        return () => {
            setShuffleClicked(false);
            setShuffleDisabled(false);
        };
    }, [shuffleClicked])

    function checkErrorsBeforeRender() {
        return !(errorExists) ? <Card card={currCard} /> : <h1>{errorExists.msg}</h1>
    }

    const mainRender = checkErrorsBeforeRender();

    return (
        <div>
            <div>
                <button onClick={() => setDrawClicked(true)}>Draw a Card</button>
                <button onClick={() => {
                    setShuffleClicked(true)
                    setShuffleDisabled(true)
                }}
                    disabled={shuffleDisabled}>Shuffle Deck</button>
                <button onClick={() => {
                    setNewDeckClicked(true);
                    setErrorExists(false);
                }}>New Deck</button>
            </div>
            <div>
                {mainRender}
            </div>
        </div>
    )
};

export default Deck;