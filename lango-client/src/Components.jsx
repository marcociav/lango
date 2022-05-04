import { React, useState, useEffect } from 'react';


export function Bar() {

    const [text, setText] = useState('')

    return (  
        <form action="/" method="get">
            <input
                type="text"
                id="header-search"
                placeholder="Enter some text"
                name="s" 
            />
            <button type="submit">Detect language</button>
        </form>
    )
} 


export function Results() {
    const [results, setResults] = useState();

    var text = ''; // get it from Bar component somehow

    useEffect(() => {
        fetch(`http://localhost:3001/lango-model/${text}`)
          .then((res) => res.json())
          .then((data) => setResults(data));
      }, [text]);
  
    // Similar to componentDidMount and componentDidUpdate:  useEffect(() => {    // Update the document title using the browser API    document.title = `You clicked ${count} times`;  });
    return (
        <div></div>
    );
  }
