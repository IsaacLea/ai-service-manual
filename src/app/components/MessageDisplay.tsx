import React from "react";

interface MessageDisplayProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-100 w-full">
      <p className="text-black whitespace-pre-line">{message}</p>
    </div>
  );
};

export default MessageDisplay;