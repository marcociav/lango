import { useState } from 'react';
import './Components.css';
import logo from './logo.png'

export function Main() {

    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState([]);

    const [detected, setDetected] = useState(false);
    const [showingMore, setShowingMore] = useState(false);

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
                setShowingMore(false);

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

    return (
        <div className="container">
            <img className="logo" src={logo} alt="{Lango}"></img>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="text-bar"
                    minlength="1"
                    maxlength="280"
                    size="80"
                    onChange={(event) => setText(event.target.value)}
                />
                <div className="button-container">
                    <button type="submit">Detect language</button>
                </div>
            </form>
            <div id="more-predictions" className="predictions">
                <ul className="predictions-list">
                    {predictions.slice(0, 1).map(
                        p => {
                            return(
                                <li key={p.language}>
                                    <ul className="predictions-details">
                                        <li>{detected ? p.language : ' '}</li>
                                        <li>{detected ? `Confidence:${p.confidence}%` : ' '}</li>
                                    </ul>
                                </li>
                            )
                        }
                    )}
                </ul>
                <div className="button-container">
                    {
                        detected ? 
                        <button onClick={() => setShowingMore(!showingMore)}>
                            {showingMore ? 'Show Less' : 'Show More'}
                        </button> :
                        ''
                    }
                </div>
                <div id="top-prediction" className="predictions">
                    <ul className="predictions-list">
                        {predictions.slice(1).map(
                            p => {
                                return (
                                    <li key={p.language}>
                                        <ul className="predictions-details">
                                            <li>
                                               {showingMore ? p.language: ' '} 
                                                {showingMore ? `Confidence:${p.confidence}%`: ' '}
                                             
                                            </li>
                                        </ul>
                                    </li>
                                )
                            }
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
} 
