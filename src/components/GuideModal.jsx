import React from 'react';
import { X, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GuideModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl p-0 shadow-2xl max-h-[85vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-red-500" />
                                사용 방법 가이드
                            </h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                            {/* Section 1: How to use */}
                            <section>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-sm">1</span>
                                    🚀 사용 방법
                                </h3>
                                <div className="space-y-4 text-slate-300 leading-relaxed pl-2 border-l-2 border-slate-800 ml-3">
                                    <div className="flex gap-3">
                                        <div className="min-w-[4px] h-[4px] bg-slate-500 rounded-full mt-2.5"></div>
                                        <p><span className="text-white font-medium">웹사이트에 접속</span>합니다.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="min-w-[4px] h-[4px] bg-slate-500 rounded-full mt-2.5"></div>
                                        <p>우측 상단 <span className="text-yellow-400 font-bold">[API 설정]</span> 버튼을 누릅니다.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="min-w-[4px] h-[4px] bg-slate-500 rounded-full mt-2.5"></div>
                                        <p>본인의 <span className="text-blue-400 font-bold">Google Gemini API Key</span>를 입력합니다.<br /><span className="text-sm text-slate-500">(키 발급 방법은 아래 참조, 무료입니다!)</span></p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="min-w-[4px] h-[4px] bg-slate-500 rounded-full mt-2.5"></div>
                                        <p><span className="text-white font-medium">스크립크를 업로드</span>하거나 내용을 복사-붙여넣기 합니다.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="min-w-[4px] h-[4px] bg-slate-500 rounded-full mt-2.5"></div>
                                        <p><span className="text-red-400 font-bold">[제목 분석하기]</span> 버튼을 클릭하면 5초 뒤에 결과가 나옵니다!</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: API Key Guide */}
                            <section className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-sm">2</span>
                                    🔑 Gemini API Key 발급 방법 (무료)
                                </h3>
                                <div className="space-y-3 text-slate-300 text-sm">
                                    <ol className="list-decimal list-inside space-y-2 marker:text-slate-500">
                                        <li>
                                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                                                Google AI Studio에 접속합니다 <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </li>
                                        <li>구글 계정으로 로그인합니다.</li>
                                        <li><span className="bg-slate-700 px-1.5 py-0.5 rounded text-white text-xs">Create API key</span> 버튼을 클릭합니다.</li>
                                        <li>생성된 키를 복사하여 이 웹사이트 설정창에 붙여넣으세요.</li>
                                    </ol>
                                    <p className="mt-4 text-xs text-slate-500 flex items-center gap-1.5 bg-slate-800/50 p-3 rounded-lg">
                                        <HelpCircle className="w-3 h-3 text-slate-400" />
                                        키는 브라우저에만 저장되며 서버로 전송되지 않아 안전합니다.
                                    </p>
                                </div>
                            </section>

                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-800 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                닫기
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
