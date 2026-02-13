import React from 'react';
import { Trees as Tree, Flower2, Droplet, Lock } from 'lucide-react';
import { ZenGardenItem } from '../types/wellness';

type ZenGardenProps = {
  items: ZenGardenItem[];
};

const ZenGarden = ({ items }: ZenGardenProps) => {
  return (
    <div className="relative bg-black rounded-lg aspect-video overflow-hidden">
      {/* Garden Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />

      {/* Garden Items */}
      {items.map(item => (
        <div
          key={item.id}
          className={`absolute transition-all duration-500 ${
            item.unlocked ? 'opacity-100' : 'opacity-50'
          }`}
          style={{
            left: `${item.position.x}%`,
            top: `${item.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {item.unlocked ? (
            <div className="animate-pulse-slow">
              {item.type === 'tree' && <Tree className="w-12 h-12 text-green-500" />}
              {item.type === 'flower' && <Flower2 className="w-10 h-10 text-pink-500" />}
              {item.type === 'water' && <Droplet className="w-8 h-8 text-blue-500" />}
            </div>
          ) : (
            <div className="relative group">
              <Lock className="w-8 h-8 text-gray-600" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Keep practicing to unlock
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ZenGarden;