import React from 'react';
import { Preset } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface PresetSelectorProps {
  presets: Preset[];
  onSelect: (preset: Preset) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ presets, onSelect }) => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">1. Choose a Style</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {presets.map((preset) => (
          <Card 
            key={preset.id} 
            onClick={() => onSelect(preset)}
            className="cursor-pointer hover:border-primary transition-all duration-200 group"
          >
            <CardHeader>
              <img 
                src={preset.preview} 
                alt={preset.name} 
                className="w-full h-64 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl text-center">{preset.name}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PresetSelector;