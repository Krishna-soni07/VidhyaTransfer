import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaLink, FaVideo } from 'react-icons/fa';

const ScheduleMeeting = ({ isOpen, onClose, onSchedule }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [linkType, setLinkType] = useState('internal'); // 'internal' or 'external'
    const [externalLink, setExternalLink] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !date || !time) return;

        const meetingDetails = {
            title,
            date,
            time,
            type: linkType,
            link: linkType === 'internal' ? 'Video Call' : externalLink
        };

        onSchedule(meetingDetails);
        onClose();

        // Reset form
        setTitle('');
        setDate('');
        setTime('');
        setLinkType('internal');
        setExternalLink('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FaCalendarAlt /> Schedule Meeting
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. Project Discussion"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input
                                    type="date"
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <div className="relative">
                                <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input
                                    type="time"
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meeting Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                        <div className="flex gap-4 mb-3">
                            <label className={`flex-1 p-3 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 ${linkType === 'internal' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input
                                    type="radio"
                                    name="linkType"
                                    value="internal"
                                    checked={linkType === 'internal'}
                                    onChange={() => setLinkType('internal')}
                                    className="hidden"
                                />
                                <FaVideo className="text-xl" />
                                <span className="text-xs font-semibold">Video Call</span>
                            </label>
                            <label className={`flex-1 p-3 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 ${linkType === 'external' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input
                                    type="radio"
                                    name="linkType"
                                    value="external"
                                    checked={linkType === 'external'}
                                    onChange={() => setLinkType('external')}
                                    className="hidden"
                                />
                                <FaLink className="text-xl" />
                                <span className="text-xs font-semibold">External Link</span>
                            </label>
                        </div>

                        {linkType === 'external' && (
                            <input
                                type="url"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm animate-fade-in"
                                placeholder="https://meet.google.com/..."
                                value={externalLink}
                                onChange={(e) => setExternalLink(e.target.value)}
                                required
                            />
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-2"
                    >
                        Schedule Meeting
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ScheduleMeeting;
