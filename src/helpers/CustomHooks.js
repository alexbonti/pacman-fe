/**
 * Created by Sanchit Dang
 * Helper file for custom hooks
 */

import { useEffect, useState } from 'react';

export const useKeyPress = (targetKey, callback) => {
  /**
  * Custom hook to handleOnKeyPress
  * Example Code : 
  * 
  * useKeyPress('Enter', () => {
  *      perform something cool :) :) 
  * });
  **/

  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // Add event listeners
  useEffect(() => {
    // If pressed key is our target key then set to true
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);
  if (keyPressed) {
    if (typeof callback === 'function') {
      return callback();
    }
  }

  return keyPressed;
};

export const useLocalStorage = (key, initialValue) => {
  /**
  * Custom hook to manageLocalStorage
  * Example Code : 
  *   const [localStorageVariable,setLocalStorageVariable]=useLocalStorage('name':'pikachu');
  * 
  **/

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      //console error
      console.log(error);
    }
  };

  return [storedValue, setValue];
};