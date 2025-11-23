import React, { useState, useRef, useEffect } from 'react';

interface AmbientMusicWidgetProps {
    // Future: could add onSave for preferences
}

interface Sound {
    id: string;
    name: string;
    emoji: string;
    url: string;
}

const AMBIENT_SOUNDS: Sound[] = [
    {
        id: 'rain',
        name: 'Rain',
        emoji: '🌧️',
        url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3'
    },
    {
        id: 'ocean',
        name: 'Ocean Waves',
        emoji: '🌊',
        url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3'
    },
    {
        id: 'fire',
        name: 'Fireplace',
        emoji: '🔥',
        url: 'https://assets.mixkit.co/active_storage/sfx/2494/2494-preview.mp3'
    },
    {
        id: 'forest',
        name: 'Forest Birds',
        emoji: '🐦',
        url: 'https://assets.mixkit.co/active_storage/sfx/2459/2459-preview.mp3'
    },
    {
        id: 'wind',
        name: 'Wind',
        emoji: '💨',
        url: 'https://assets.mixkit.co/active_storage/sfx/2392/2392-preview.mp3'
    }
];

export const AmbientMusicWidget: React.FC<AmbientMusicWidgetProps> = () => {
    const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const handleSoundSelect = (sound: Sound) => {
        if (selectedSound?.id === sound.id) {
            // Toggle play/pause for same sound
            togglePlayPause();
        } else {
            // Switch to new sound
            setSelectedSound(sound);
            setIsPlaying(true);
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(err => {
                    console.error('Error playing audio:', err);
                    setIsPlaying(false);
                });
                setIsPlaying(true);
            }
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(e.target.value));
    };

    useEffect(() => {
        if (audioRef.current && selectedSound) {
            audioRef.current.src = selectedSound.url;
            if (isPlaying) {
                audioRef.current.play().catch(err => {
                    console.error('Error playing audio:', err);
                    setIsPlaying(false);
                });
            }
        }
    }, [selectedSound]);

    const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
    };

    return (
        <div className="widget ambient-music-widget">
            <div className="widget-content">
                <div className="ambient-header">
                    <h3 className="ambient-title">🎵 Ambient Sounds</h3>
                </div>

                <div className="sound-grid">
                    {AMBIENT_SOUNDS.map((sound) => (
                        <button
                            key={sound.id}
                            className={`sound-btn ${selectedSound?.id === sound.id ? 'active' : ''}`}
                            onClick={() => handleSoundSelect(sound)}
                        >
                            <span className="sound-emoji">{sound.emoji}</span>
                            <span className="sound-name">{sound.name}</span>
                        </button>
                    ))}
                </div>

                {selectedSound && (
                    <div className="player-controls">
                        <button className="play-pause-btn" onClick={togglePlayPause}>
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <div className="volume-control">
                            <span className="volume-icon">🔊</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="volume-slider"
                            />
                            <span className="volume-value">{volume}%</span>
                        </div>
                    </div>
                )}

                <audio ref={audioRef} loop onError={handleAudioError} />
            </div>
        </div>
    );
};

