import React, { useState, useEffect } from "react";
import './AllCards.css';

const AllCards = ({ cards, currCard }) => {
    const toRender = cards.filter(card => card !== currCard);
    return (
        <div className='wrapper'>
            {toRender.map(card => {
                const ind = card.slice(-6, -4);
                return (<>
                    <img src={card}
                        className='prev-card'
                        key={ind} />
                </>)
            })}
        </div>
    )
}

export default AllCards;