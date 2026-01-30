import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaArrowRight } from 'react-icons/fa';

const Activity = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await axios.get('/admin/activity');
                setLogs(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading activity feed...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Connected': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Real-time Activity Stream</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {logs.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">No activity recorded yet.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <div key={log._id} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                        <FaExchangeAlt />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                            <span>{log.sender?.name || 'Unknown'}</span>
                                            <FaArrowRight className="text-gray-300 text-xs" />
                                            <span>{log.receiver?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Requested a skill swap connection
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getStatusColor(log.status)}`}>
                                        {log.status}
                                    </span>
                                    <span className="text-xs text-gray-400 w-24 text-right">
                                        {new Date(log.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activity;
