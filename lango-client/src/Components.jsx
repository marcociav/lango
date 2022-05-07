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
            <div className="logo-container">
                <img className="logo" src={logo} alt="{Lango}"></img>
            </div>
            <div className="bar-container">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        minlength="1"
                        maxlength="280"
                        size="80"
                        onChange={(event) => setText(event.target.value)}
                    />
                    <div className="button-container">
                        <button type="submit">Detect language</button>
                    </div>
                </form>
            </div>
            <div id="top-prediction-container" className="predictions">
                <ul className="predictions-list">
                    {predictions.slice(0, 1).map(
                        p => {
                            return(
                                <PredictionDetails
                                    showing={detected}
                                    language={p.language} confidence={p.confidence}
                                />
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
            </div>
            <div id="more-predictions-container" className="predictions">
                <ul className="predictions-list">
                    {predictions.slice(1).map(
                        p => {
                            return (
                                <PredictionDetails
                                    showing={showingMore}
                                    language={p.language} confidence={p.confidence}
                                />
                            )
                        }
                    )}
                </ul>
            </div>
        </div>
    )
} 


function PredictionDetails(props) {
    return (
        <li key={props.language}>
            <ul className="predictions-details">
                <li>{props.showing ? props.language : ' '}</li>
                <li>{props.showing ? `Confidence:${props.confidence}%` : ' '}</li>
            </ul>
        </li>
    )
}

function Predictions(props) {
    return (
        <div> TODO wrap className=prediction in this function</div>
    )
}