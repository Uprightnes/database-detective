import React, { useEffect, useState } from 'react';

interface PartnerBarProps {
  message: string;
  isError?: boolean;
  isSuccess?: boolean;
}

const PartnerBar: React.FC<PartnerBarProps> = ({ message, isError, isSuccess }) => {
  const [displayed, setDisplayed] = useState('');
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i <= message.length) {
        setDisplayed(message.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [message]);

  const borderColor = isError
    ? 'border-danger/40'
    : isSuccess
    ? 'border-solved/40'
    : 'border-[#3a3020]';

  const textColor = isError
    ? 'text-red-300'
    : isSuccess
    ? 'text-green-300'
    : 'text-aged';

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 bg-[#1a1710] border-t ${borderColor} min-h-[56px]`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full bg-[#2a2218] border border-aged/30 flex items-center justify-center">
          <span className="text-sm">🕵️</span>
        </div>
      </div>
      <div className="flex-1">
        <span className="text-muted font-mono text-xs uppercase tracking-widest block mb-0.5">
          Partner
        </span>
        <p key={key} className={`font-body text-sm leading-snug ${textColor}`}>
          {displayed}
          {displayed.length < message.length && (
            <span className="animate-pulse">▋</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default PartnerBar;
