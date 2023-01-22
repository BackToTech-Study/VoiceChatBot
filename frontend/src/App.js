import './App.css';
import React, { useState, useEffect } from 'react'
import { VscRecord, VscCircleLargeFilled } from "react-icons/vsc";
import useSound from 'use-sound';
import beep29 from './sounds/beep-29.mp3';
import beep30 from './sounds/beep-30b.mp3';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
    handleListen()
  }, [isListening])


  const [playStart] = useSound(beep29);
  const [playEnd] = useSound(beep30);

  const handleListen = () => {

    if (isListening) {
      mic.start()
      playStart()
      mic.onend = () => {
        console.log('continue');
        mic.start()
      }
    } else {
      mic.stop()
      playEnd()
      mic.onend = () => {
        console.log('Stopped mic on click');
      }
    }
    mic.onstart = () => {
      console.log('Mics on');
    }
    mic.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('')
      console.log(transcript);
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error);
      }
    }
  }

  const handleSavedNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }

  return (
    <>
      <h1>Voice Notes</h1>
      <div className='container'>
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <VscRecord /> : <VscCircleLargeFilled />}
          <button onClick={handleSavedNote} disabled={!note}>Save Note</button>
          <button onClick={() => setIsListening(prevState => !prevState)}>Start/Stop</button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
