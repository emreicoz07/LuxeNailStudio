import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        className={`
          input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}
        `}
        {...props}
      />
      {(error || helper) && (
        <p className={`text-sm ${error ? 'text-red-500' : 'text-text-secondary'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
};

export default Input; 