/* eslint-disable */

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StateData {
  state: string;
  electoralVotes: number;
  currentOddsBlue: number;
  currentOddsRed: number;
}

interface Selection {
  state: string;
  color: 'blue' | 'red';
}

interface Participant {
  name: string;
  email: string;
  state: string;
  color: 'blue' | 'red';
  timestamp: string;
}

const ElectionPoolBoard = () => {
  const battlegroundStates: StateData[] = [
    { state: 'Arizona', electoralVotes: 11, currentOddsBlue: 1.2, currentOddsRed: 1.8 },
    { state: 'Georgia', electoralVotes: 16, currentOddsBlue: 1.3, currentOddsRed: 1.7 },
    { state: 'Michigan', electoralVotes: 16, currentOddsBlue: 1.4, currentOddsRed: 1.6 },
    { state: 'Nevada', electoralVotes: 6, currentOddsBlue: 1.5, currentOddsRed: 1.5 },
    { state: 'Pennsylvania', electoralVotes: 20, currentOddsBlue: 1.3, currentOddsRed: 1.7 },
    { state: 'Wisconsin', electoralVotes: 10, currentOddsBlue: 1.4, currentOddsRed: 1.6 }
  ];

  const [participants, setParticipants] = useState<Record<string, Participant>>({});
  const [currentName, setCurrentName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);

  const addSelection = () => {
    if (!currentName || !currentEmail || !currentSelection) return;
    
    setParticipants(prev => ({
      ...prev,
      [`${currentSelection.state}-${currentSelection.color}`]: {
        name: currentName,
        email: currentEmail,
        state: currentSelection.state,
        color: currentSelection.color,
        timestamp: new Date().toISOString()
      }
    }));

    setCurrentName('');
    setCurrentEmail('');
    setCurrentSelection(null);
  };

  const isSquareSelected = (state: string, color: 'blue' | 'red'): boolean => {
    return Object.values(participants).some(
      p => p.state === state && p.color === color
    );
  };

  const getParticipantForSquare = (state: string, color: 'blue' | 'red'): Participant | undefined => {
    return Object.values(participants).find(
      p => p.state === state && p.color === color
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Battleground States Pool Board - $5 per square</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Participant Entry Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">New Entry</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
              />
              <Input
                placeholder="Email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                type="email"
              />
            </div>
            <Button 
              onClick={addSelection}
              disabled={!currentName || !currentEmail || !currentSelection}
              className="w-full"
            >
              Add Selection
            </Button>
          </div>

          {/* Pool Board */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border text-left">State</th>
                <th className="p-2 border text-center">Electoral Votes</th>
                <th className="p-2 border text-center">Blue Odds</th>
                <th className="p-2 border text-center">Red Odds</th>
                <th className="p-2 border text-center">Selections</th>
              </tr>
            </thead>
            <tbody>
              {battlegroundStates.map((stateData) => (
                <tr key={stateData.state}>
                  <td className="p-2 border font-medium">{stateData.state}</td>
                  <td className="p-2 border text-center">{stateData.electoralVotes}</td>
                  <td className="p-2 border text-center">{stateData.currentOddsBlue}x</td>
                  <td className="p-2 border text-center">{stateData.currentOddsRed}x</td>
                  <td className="p-2 border">
                    <div className="flex justify-center gap-4">
                      <div className="text-center">
                        <button
                          className={`w-8 h-8 rounded ${
                            isSquareSelected(stateData.state, 'blue')
                              ? 'bg-blue-600 cursor-not-allowed'
                              : currentSelection?.state === stateData.state && currentSelection?.color === 'blue'
                              ? 'bg-blue-400'
                              : 'bg-blue-200 hover:bg-blue-300'
                          }`}
                          onClick={() => setCurrentSelection({state: stateData.state, color: 'blue'})}
                          disabled={isSquareSelected(stateData.state, 'blue')}
                        />
                        <div className="text-xs mt-1">
                          {isSquareSelected(stateData.state, 'blue') && 
                            getParticipantForSquare(stateData.state, 'blue')?.name}
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          className={`w-8 h-8 rounded ${
                            isSquareSelected(stateData.state, 'red')
                              ? 'bg-red-600 cursor-not-allowed'
                              : currentSelection?.state === stateData.state && currentSelection?.color === 'red'
                              ? 'bg-red-400'
                              : 'bg-red-200 hover:bg-red-300'
                          }`}
                          onClick={() => setCurrentSelection({state: stateData.state, color: 'red'})}
                          disabled={isSquareSelected(stateData.state, 'red')}
                        />
                        <div className="text-xs mt-1">
                          {isSquareSelected(stateData.state, 'red') && 
                            getParticipantForSquare(stateData.state, 'red')?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Participants List */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Current Entries</h3>
            <div className="space-y-2">
              {Object.values(participants).map((participant, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{participant.name}</span>
                  <span>{participant.state} - {participant.color}</span>
                  <span>${5}</span>
                </div>
              ))}
            </div>
            <div className="text-right font-medium mt-4">
              Total Pool: ${Object.keys(participants).length * 5}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionPoolBoard;