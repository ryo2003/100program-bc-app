import React, { useState } from "react";

function CreateArea(props) {
  const [inputFundingGoal, setinputFundingGoal] = useState(0);
  const [inputDeadline, setinputDeadline] = useState(0);

  function fundingGoalChange(event) {
    const newValue = event.target.value;
    setinputFundingGoal(newValue);
    //console.log(inputName);
  }

  function deadlineChange(event) {
    const newValue = event.target.value;
    setinputDeadline(newValue);
    //console.log(inputIntro);
  }

  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()} class="campaignForm">
        <label for="fundingGoal">Funding Goal:</label>
        <input
          type="number"
          id="fundingGoal"
          name="fundingGoal"
          onChange={fundingGoalChange}
          required
        ></input>
        <label for="deadline">Deadline:</label>
        <input
          type="number"
          id="deadline"
          name="deadline"
          onChange={deadlineChange}
          required
        ></input>

        <label for="campaignDescription">Campaign Description:</label>
        <textarea
          id="campaignDescription"
          name="campaignDescription"
        ></textarea>
        <button
          type="submit"
          onClick={() =>
            props.createCampaign(
              inputFundingGoal,
              inputDeadline,
              props.currentAccount
            )
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateArea;
