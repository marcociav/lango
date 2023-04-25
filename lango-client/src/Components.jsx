import { useState } from 'react';
import './Components.css';
import logo from './logo.png'

export function Lango() {

    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState([]);

    const [detected, setDetected] = useState(false);
    const [showingMore, setShowingMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        fetch(
            'https://lango-api-b3hh67rrkq-pd.a.run.app/lango',
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
                    if (p.confidence === "100.0000") {
                        p.confidence = "~100";
                    }
                    else if (p.confidence === "0.0000") {
                        p.confidence = "~0"
                    }
                    return p;
                }
                )
                setPredictions(json);
                setIsLoading(false);
            }
        )
    }

    return (
        <div className="container">
            <div className="logo-container">
                <h1 style={{fontFamily: "Arial", fontSize: "52px"}}>LANGO</h1>
            </div>
            <div className="bar-container">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        minLength="1"
                        maxLength="280"
                        onChange={(event) => setText(event.target.value)}
                    />
                    <LoadingSpinner isLoading={isLoading}/>
                    <div id="detect-language-button-container" className="button-container">
                        <button type="submit" disabled={isLoading}>Detect language</button>
                    </div>
                </form>
            </div>
            <Predictions
                id="top-predictions-container"
                showing={detected}
                predictions={predictions.slice(0, 1)}
            />
            <div id="show-more-button-container" className="button-container">
                {
                    detected ? 
                    <button onClick={() => setShowingMore(!showingMore)}>
                        {showingMore ? 'Show Less' : 'Show More'}
                    </button> :
                    ''
                }
            </div>
            <Predictions
                id="more-predictions-container"
                showing={showingMore}
                predictions={predictions.slice(1)}
            />
        </div>
    )
} 


function Predictions(props) {
    return (
        <div id={props.id} className="predictions">
                <ul className="predictions-list">
                    {props.predictions.map(
                        p => {
                            return (
                                <li key={p.language}>
                                    <dl className="predictions-details">
                                        <dt>{props.showing ? p.language : ' '}</dt>
                                        <dd>{props.showing ? `Confidence:\n${p.confidence}%` : ' '}</dd>
                                    </dl>
                                </li>
                            )
                        }
                    )}
                </ul>
            </div>
    )
}


function LoadingSpinner(props) {
    let loadingSpinner = props.isLoading ? <div className="loading-spinner"></div>: <div></div>;
    return (
        <div className="spinner-container">
            {loadingSpinner}
        </div>
    )
}