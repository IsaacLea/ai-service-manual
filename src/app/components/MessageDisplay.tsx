import React from "react";

interface MessageDisplayProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
  isUserMessage: boolean;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, isUserMessage }) => {
  return (
    <div className={`flex items-center justify-left w-full`}>
      <div
        className={
          isUserMessage
            ? 'mt-4 p-4 rounded-2xl bg-gray-50 text-black max-w-xs break-words shadow-md'
            : 'mt-4 p-4 border rounded bg-gray-100 text-black w-full'
        }
      >
        <p className="whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
};

export default MessageDisplay;