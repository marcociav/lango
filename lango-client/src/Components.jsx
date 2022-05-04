import { useState, useEffect } from 'react';


export function Bar() {

    const [text, setText] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch(
            'http://localhost:5000/lango',
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({text: text})
            }
        )
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


export function Results() {
    const [results, setResults] = useState();

    var text = ''; // get it from Bar component somehow

    useEffect(() => {
        fetch(`http://localhost:5000/lango-model/${text}`)
          .then((res) => res.json())
          .then((data) => setResults(data));
      }, [text]);
  
    // Similar to componentDidMount and componentDidUpdate:  useEffect(() => {    // Update the document title using the browser API    document.title = `You clicked ${count} times`;  });
    return (
        <div></div>
    );
  }
