import React, { useState, useEffect } from 'react';
import { X, Key, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SettingsModal({ isOpen, onClose, onSave }) {
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const storedKey = localStorage.getItem('GEMINI_API_KEY');
        if (storedKey) setApiKey(storedKey);
    }, [isOpen]);

    const handleSave = () => {
        if (!apiKey.trim()) {
            alert("API키를 입력해주세요!");
            return;
        }
        localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
        onSave(apiKey.trim());
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Key className="w-5 h-5 text-yellow-400" />
                                API 설정
                            </h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl flex gap-3 text-blue-200 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>
                                    Google AI Studio에서 발급받은 <strong>Gemini API Key</strong>가 필요합니다.
                                    (브라우저에 로컬 저장되며 서버로 전송되지 않습니다.)
                                </p>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2 font-medium">Google Gemini API Key</label>
                                <input
                                    type="password"
                                    placeholder="AIzaSy..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all placeholder-slate-700"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
                            >
                                <Save className="w-4 h-4" />
                                저장하고 계속하기
                            </button>

                            <div className="text-center">
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-slate-500 hover:text-slate-300 underline"
                                >
                                    API Key 발급받으러 가기 &rarr;
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
