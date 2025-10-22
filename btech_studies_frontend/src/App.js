import logo from './logo.svg';
import './App.css';
import Uploads from './components/Uploads/Uploads';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  return (
    <div className="App">
      <ChatBot />
      <Uploads />
    </div>
  );
}

export default App;
