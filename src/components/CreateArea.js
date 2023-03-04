import React, {useState} from "react";

function CreateArea() {
    const [inputName, setInputName] = useState("");
    const [inputIntro, setInputIntro] = useState("");

    function nameChange(event) {
        const newValue = event.target.value;
        setInputName(newValue);
        console.log(inputName);
      }

    function introChange(event) {
        const newValue = event.target.value;
        setInputIntro(newValue);
        console.log(inputIntro);
    }

    function onAdd() {
        console.log("clicked");
    }

  return (
    <div>
        <form onSubmit={(event)=> event.preventDefault()}>
            <input name="name" placeholder="Name" onChange={nameChange}/>
            <textarea name="intro" placeholder="Introduce yourself" rows="3" onChange={introChange}/>
            <button onClick={onAdd}>Add</button>
        </form>
    </div>
  );
}

export default CreateArea;