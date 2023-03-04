import React from "react";

function List(props) {
    

  return (
    <div className="note">
      <h1>{props.name}</h1>
      <p>{props.intro}</p>
    </div>
  );
}

export default List;