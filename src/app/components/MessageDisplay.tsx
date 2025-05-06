import React from "react";
import { QueryResult } from "../types";




interface MessageDisplayProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
  className?: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, className }) => {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-100 w-full">
      <p className="text-black whitespace-pre-line">{message}</p>
    </div>
  );
};

export default MessageDisplay;