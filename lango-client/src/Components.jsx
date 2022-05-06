import { useState } from 'react';
import './Components.css'


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
        ).then((res) => { return res.json(); })
        .then(
            (json) => {
                setDetected(true);
                setShowMore(false);

                json = json.slice(0, 5); // get top 5 predictions
                json = json.map((p) => {
                    p.confidence = p.confidence * 100;
                    p.confidence = p.confidence.toLocaleString("en-US", {
                        maximumFractionDigits: 4, minimumFractionDigits: 4
                    });
                    return p;
                }
                )
                setPredictions(json);
            }
        )
    }

    var predictionComponent, showMoreComponent;

    if (showMore) {
        showMoreComponent = 
            <div id="top-prediction" className="predictions">
                <ul className="predictions-list">
                    {predictions.slice(1).map(
                        p => {
                            return (
                                <li key={p.language}>
                                    <ul className="predictions-details">
                                        <li>{p.language}</li>
                                        <li>{`Confidence:${p.confidence}%`}</li>
                                    </ul>
                                </li>
                            )
                        }
                    )}
                </ul>
            </div>
    }

    if (detected) {
        predictionComponent = 
            <div id="more-predictions" className="predictions">
                <ul className="predictions-list">
                    {predictions.slice(0, 1).map(
                        p => {
                            return(
                                <li key={p.language}>
                                    <ul className="predictions-details">
                                        <li>{p.language}</li>
                                        <li>{`Confidence:${p.confidence}%`}</li>
                                    </ul>
                                </li>
                            )
                        }
                    )}
                </ul>
                <button onClick={() => setShowMore(true)}>Show more</button>
            {showMoreComponent}
            </div>
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="text-bar"
                    placeholder="Enter some text"
                    onChange={(event) => setText(event.target.value)}
                />
                <button type="submit">Detect language</button>
            </form>
            {predictionComponent}
        </div>
    )
} 
