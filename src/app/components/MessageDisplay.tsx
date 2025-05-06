import React from "react";
import { QueryResult } from "../types";


const MessageDisplay: React.FC<QueryResult> = ({ message }) => {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-100">
      <p className="text-black whitespace-pre-line">{message}</p>
    </div>
  );
};

export default MessageDisplay;