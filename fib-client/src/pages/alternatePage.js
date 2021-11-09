import React from "react";
import { Link } from "react-router-dom";

export const AlternatePage = () => {
  return (
    <div style={{ padding: 20, borderRadius: 10, backgroundColor: 'cadetblue'}}>
      <div>
        <Link to="/">Home</Link>
      </div>
      <h1>Alternate Page</h1>
    </div>
  );
}
