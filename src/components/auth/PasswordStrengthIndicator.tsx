import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    
    // Determine strength level
    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 5) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-green-500' };
  };
  
  const strength = calculateStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              level <= strength.score ? strength.color : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium", {
        "text-red-600": strength.score === 1,
        "text-amber-600": strength.score === 2,
        "text-blue-600": strength.score === 3,
        "text-green-600": strength.score === 4,
      })}>
        Password strength: {strength.label}
      </p>
    </div>
  );
};
