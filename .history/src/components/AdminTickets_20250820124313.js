import React from "react";

const YourComponent = () => {
  return (
    <div>
      <button className="close-selected-btn">Closed/Completed</button>
      <select>
        <option value="Open">Open</option>
        <option value="Pending">Pending</option>
        <option value="Closed">Closed/Completed</option>
      </select>
      <button className="close-btn">Closed/Completed</button>
    </div>
  );
};

export default YourComponent;