import React, { useState, useEffect }  from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export const FibCalc = () => {
    const [currentIndex, setCurrentIndex] = useState('');
    const [currentValues, setCurrentValues] = useState({});
    const [seenIndexes, setSeenIndexes] = useState([]);

    useEffect(() => {
        fetchSeenIndexes();
        fetchCurrentValues();
    }, []);

    const fetchCurrentValues = async () => {
        try {
            const currentValues = await axios.get('/api/values/current');
            Object.entries(currentValues.data).map(([key, value]) => console.log(`key: ${key} - value:${value}`));
            setCurrentValues(currentValues.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSeenIndexes = async () => {
        try {
            const seenIndexes = await axios.get('/api/values/all');
            console.log(seenIndexes.data);
            setSeenIndexes(seenIndexes.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/values', { index: currentIndex });
            setCurrentIndex('');
        } catch (error) {
            console.log(error);
        };
    };

    return (
      <div style={{ padding: 20, borderRadius: 10, backgroundColor: 'cadetblue'}}>
        <div>
          <Link to="/">Home</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Enter your index to be calculated:</label>
          <input
            value={currentIndex}
            onChange={(e) => setCurrentIndex(e.target.value)}
          />
          <button>Submit</button>
        </form>
        <h3>Indexes I have seen:</h3>
        <ul>
          {seenIndexes.map((index) => (
            <li key={`calc-${index}`}>{index}</li>
          ))}
        </ul>
        <h3>Calculated values:</h3>
        <ul>
          {Object.entries(currentValues).map(([key, value]) => (
            <li key={key}>
              For index {key} the fib value is {value}
            </li>
          ))}
        </ul>
      </div>
    );
};
