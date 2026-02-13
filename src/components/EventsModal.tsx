import React, { useState } from 'react';
import { X, Calendar, Users, Video, MapPin, Lock, Clock } from 'lucide-react';

type Event = {
  id: string;
  title: string;
  type: 'online' | 'in-person';
  datetime: string;
  location: string;
  participants: number;
  maxParticipants: number;
  premiumOnly: boolean;
};

type EventsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
};

const EventsModal = ({ isOpen, onClose, isPremium }: EventsModalProps) => {
  const [joinedEvents, setJoinedEvents] = useState<string[]>(() => {
    const stored = localStorage.getItem('joinedEvents');
    return stored ? JSON.parse(stored) : [];
  });

  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);

  if (!isOpen) return null;

  const demoEvents: Event[] = [
    {
      id: '1',
      title: 'Group HIIT Session',
      type: 'online',
      datetime: '2024-03-15T18:00:00',
      location: 'Zoom',
      participants: 15,
      maxParticipants: 20,
      premiumOnly: false
    },
    {
      id: '2',
      title: 'Nutrition Workshop',
      type: 'online',
      datetime: '2024-03-16T14:00:00',
      location: 'Google Meet',
      participants: 25,
      maxParticipants: 30,
      premiumOnly: true
    },
    {
      id: '3',
      title: 'Local Running Group',
      type: 'in-person',
      datetime: '2024-03-17T07:00:00',
      location: 'Central Park',
      participants: 8,
      maxParticipants: 15,
      premiumOnly: false
    },
    {
      id: '4',
      title: 'Advanced Yoga Class',
      type: 'online',
      datetime: '2024-03-18T19:00:00',
      location: 'Zoom',
      participants: 12,
      maxParticipants: 20,
      premiumOnly: true
    }
  ];

  const handleJoinEvent = (eventId: string) => {
    if (!joinedEvents.includes(eventId)) {
      const newJoinedEvents = [...joinedEvents, eventId];
      setJoinedEvents(newJoinedEvents);
      localStorage.setItem('joinedEvents', JSON.stringify(newJoinedEvents));
      setShowConfirmation(eventId);
      setTimeout(() => setShowConfirmation(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-dark rounded-lg max-w-2xl w-full p-8">
        {/* Close button - remains functional */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-neon z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-40">
          <Clock className="w-16 h-16 text-neon animate-pulse mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Coming Soon!</h2>
          <p className="text-gray-300 text-center max-w-md px-4">
            We're working hard to bring you an amazing community events experience. 
            Check back soon!
          </p>
        </div>

        {/* Existing content - now behind overlay */}
        <div className="pointer-events-none">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>

          <div className="space-y-4">
            {demoEvents.map(event => {
              const isJoined = joinedEvents.includes(event.id);
              const showEvent = !event.premiumOnly || isPremium;

              if (!showEvent) return null;

              return (
                <div 
                  key={event.id}
                  className="bg-black p-4 rounded-lg relative overflow-hidden"
                >
                  {showConfirmation === event.id && (
                    <div className="absolute inset-0 bg-neon/90 text-black flex items-center justify-center font-bold animate-fade-in">
                      You've joined the event!
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      <div className="space-y-1 text-gray-300">
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(event.datetime).toLocaleString()}
                        </p>
                        <p className="flex items-center">
                          {event.type === 'online' ? (
                            <Video className="w-4 h-4 mr-2" />
                          ) : (
                            <MapPin className="w-4 h-4 mr-2" />
                          )}
                          {event.location}
                        </p>
                        <p className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {event.participants}/{event.maxParticipants} participants
                        </p>
                      </div>
                    </div>
                    <button
                      className={`btn-primary ${
                        isJoined ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              );
            })}

            {!isPremium && (
              <div className="bg-black/50 p-6 rounded-lg text-center">
                <Lock className="w-8 h-8 text-neon mx-auto mb-2" />
                <p className="text-gray-300 mb-4">
                  Upgrade to Premium to access exclusive events and workshops
                </p>
                <button className="btn-primary">
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsModal;