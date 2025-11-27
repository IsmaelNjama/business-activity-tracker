import React from 'react';
import { Target, TrendingUp, Award, Rocket } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const BusinessInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Mission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="text-blue-600" size={20} />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{BUSINESS_INFO.mission}</p>
        </CardContent>
      </Card>
      
      {/* Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="text-blue-600" size={20} />
            Our Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {BUSINESS_INFO.values.map((value, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-700">{value}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Short-term Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="text-green-600" size={20} />
            Short-term Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {BUSINESS_INFO.shortTermGoals.map((goal, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-gray-700">{goal}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Long-term Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="text-purple-600" size={20} />
            Long-term Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {BUSINESS_INFO.longTermGoals.map((goal, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="text-gray-700">{goal}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
