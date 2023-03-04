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
     <Header />
     <CreateArea/>
    </div>
  );
}

export default App;
