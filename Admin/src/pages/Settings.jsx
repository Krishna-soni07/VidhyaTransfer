import React from 'react';

const Settings = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Platform Settings</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">General Configuration</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                        <input type="text" defaultValue="SkillSwap" className="w-full px-4 py-2 border rounded-lg bg-gray-50" readOnly />
                        <p className="text-xs text-gray-400 mt-1">Contact support to change branding.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                        <input type="email" defaultValue="admin@skillswap.com" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                            <p className="text-xs text-gray-500">Disable access for regular users.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" disabled />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="pt-6">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Changes</button>
                    </div>
                </div>
            </div>
            <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100 text-sm text-blue-800">
                <strong>Note:</strong> advanced SEO and backup settings are managed via the cloud infrastructure console.
            </div>
        </div>
    );
};

export default Settings;
