import React from 'react';
import './App.css';
import ResumeForm from './components/ResumeForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ResumeBot</h1>
        <p>AI-Powered Resume Generator</p>
      </header>
      <main>
        <ResumeForm />
      </main>
    </div>
  );
}

export default App;