import { useState, useEffect } from 'react';


export function Bar() {

    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState([]);

    const [detected, setDetected] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch(
            'http://localhost:5000/lango',
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({text: text})
            }
        ).then(
            (response) => {
                console.log(response.data);
                setDetected(true);
            }
        )
    }
    var predictionComponent, showMoreComponent;

    if (showMore) {
        showMoreComponent = 
            <div>
                {/* Predictions other than first and related confidence (?) */}
            </div>
    }

    if (detected) {
        predictionComponent = 
            <div>
                {/* First prediction and related confidence (?) */}
            </div>
            showMoreComponent
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="header-search"
                placeholder="Enter some text"
                onChange={(event) => setText(event.target.value)}
            />
            <button type="submit">Detect language</button>
        </form>
    )
} 
