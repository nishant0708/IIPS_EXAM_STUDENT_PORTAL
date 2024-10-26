import { useEffect } from 'react';
import { ipcRenderer } from 'electron';

function App() {
  useEffect(() => {
    // Disable specific key events in the renderer process
    const handleKeyDown = (e) => {
      const forbiddenKeys = ['F11', 'Alt', 'Control', 'Meta', 'Escape'];
      if (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        forbiddenKeys.includes(e.key)
      ) {
        e.preventDefault();
        ipcRenderer.send('prevent-key', e.key); // Send the key to the main process if needed
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="App">
      {/* Your React components here */}
      <h1>Exam Interface</h1>
    </div>
  );
}

export default App;
