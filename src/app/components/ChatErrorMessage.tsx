import React from "react";

interface MessageDisplayProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
}

const ChatErrorMessage: React.FC<MessageDisplayProps> = ({ message }) => {
  return (
    <div className={`flex items-center justify-left w-full`}>
      <div className="mt-4 p-4 border rounded bg-red-50 text-red-900 border-red-200 w-full">
        <p className="whitespace-pre-line break-words">{message}</p>
      </div>
    </div>
  );
};

export default ChatErrorMessage;