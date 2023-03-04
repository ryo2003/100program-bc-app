import '../App.css';
import Header from './Header';
import CreateArea from './CreateArea';
import React, {useState} from "react";


function App() {
  const [items, setItems] = useState([]);

    function addItem(inputText) {
        setItems((prevItems) => {
          return [...prevItems, inputText];
        });
      }

  return (
    <div>
      <h1>Hello World!</h1>
     <Header />
     <CreateArea/>
    </div>
  );
}

export default App;
