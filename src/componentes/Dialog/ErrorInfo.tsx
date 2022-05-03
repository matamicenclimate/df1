import { useEffect, useState } from 'react';

export type ErrorInfo = {
  type?: string;
  message?: string;
  visible?: boolean;
};

export const Error = ({ type, message }: ErrorInfo) => {
  const [visible, setIsVisible] = useState(false);
  useEffect(() => {
    // message is empty (meaning no errors). Adjust as needed
    if (!message) {
      setIsVisible(false);
      return;
    }
    // error exists. Display the message and hide after 5 secs
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [message]); // executes every time `message` changes. Adjust as needed
  if (!visible) return null;
  return (
    <div>
      <p>
        <strong>{type}:</strong> {message}
        <br />
      </p>
    </div>
  );
};
