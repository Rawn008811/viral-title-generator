import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function UploadSection({ onAnalyze, onFileSelect }) {
    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        target: '',
        benefit: '',
        authority: '',
        number: '',
        script: ''
    });

    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) handleFile(files[0]);
    };

    const handleFile = async (file) => {
        if (!file.name.endsWith('.srt') && !file.name.endsWith('.txt')) {
            alert('SRT 또는 TXT 파일만 가능합니다!');
            return;
        }

        const text = await readFile(file);
        // Notify parent to extract data and auto-fill
        // We pass the raw text to parent, parent calls extraction logic, 
        // then parent might call a setter or we handle it here locally if we move logic.
        // For now, let's just update the script field and let user know they can auto-fill.
        setFormData(prev => ({ ...prev, script: text }));

        // Auto-trigger analysis for auto-fill suggestion? 
        // Better pattern: Let parent handle "Auto-Fill" logic 
        if (onFileSelect) {
            const extracted = onFileSelect(text);
            setFormData(prev => ({
                ...prev,
                topic: extracted.keywords.join(', '),
                target: extracted.target,
                benefit: extracted.benefit,
                authority: extracted.authority,
                script: text.slice(0, 200) + (text.length > 200 ? '...' : '')
            }));
        }
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsText(file);
        });
    };

    const handleSubmit = () => {
        if (!formData.topic) {
            alert("주제(키워드)는 필수입니다!");
            return;
        }
        onAnalyze(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Manual Input Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1 font-medium">1. 주제 (콘텐츠 핵심 키워드) *</label>
                        <input
                            type="text"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-slate-600"
                            placeholder="예: 다크서클, 스마트스토어, 다이어트"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1 font-medium">2. 타겟 (누구에게 말하나요?)</label>
                        <input
                            type="text"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-slate-600"
                            placeholder="예: 30대 직장인, 초보자, 주부"
                            value={formData.target}
                            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1 font-medium">3. 목적/이득 (시청자가 얻는 것)</label>
                        <input
                            type="text"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-slate-600"
                            placeholder="예: 월 100만원 수익, 5kg 감량"
                            value={formData.benefit}
                            onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1 font-medium">4. 권위 (직함/경력)</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-slate-600"
                                placeholder="예: 10년차, 현직 의사"
                                value={formData.authority}
                                onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1 font-medium">5. 숫자 (N가지/기간)</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-slate-600"
                                placeholder="예: 3가지, 1주일"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Col: Drag & Drop / Script Preview */}
                <div className="flex flex-col h-full">
                    <label className="block text-slate-400 text-sm mb-1 font-medium">6. 대본/본문 (AI 자동입력 용도)</label>
                    <div
                        className={`flex-1 border-2 border-dashed rounded-xl transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center
                    ${isDragging ? 'border-red-500 bg-red-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}
                `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !formData.script && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files?.length > 0 && handleFile(e.target.files[0])}
                            className="hidden"
                            accept=".srt,.txt"
                        />

                        {formData.script ? (
                            <div className="w-full h-full text-left">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-green-500 text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 파일 분석 완료</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, script: '' }); }}
                                        className="text-xs text-slate-500 hover:text-white"
                                    >
                                        삭제
                                    </button>
                                </div>
                                <textarea
                                    className="w-full h-[calc(100%-2rem)] bg-transparent resize-none text-slate-300 text-sm focus:outline-none"
                                    value={formData.script}
                                    readOnly
                                />
                            </div>
                        ) : (
                            <>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform ${isDragging ? 'bg-red-500' : 'bg-slate-800'}`}>
                                    <Upload className={`w-6 h-6 ${isDragging ? 'text-white' : 'text-slate-400'}`} />
                                </div>
                                <p className="text-slate-300 font-medium mb-1">파일 업로드 (자동입력)</p>
                                <p className="text-slate-500 text-xs">SRT 또는 TXT 파일을 드래그하세요.<br />내용을 분석해 왼쪽 항목을 자동으로 채워줍니다.</p>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="mt-4 w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Wand2 className="w-5 h-5" />
                        제목 생성하기
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
