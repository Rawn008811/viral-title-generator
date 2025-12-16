import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../lib/templates';
import { generateTitle } from '../lib/analyzer';
import { Copy, Sparkles, AlertTriangle, Lightbulb, TrendingUp, Zap } from 'lucide-react';

export function AnalysisDashboard({ analysis, generatedTitles: externalTitles, onReset }) {
    // Use external (Gemini) titles if available, otherwise generate locally
    const displayTitles = useMemo(() => {
        if (externalTitles) return externalTitles;

        const results = {};

        // Shuffle and pick 5 from each category
        Object.keys(TEMPLATE_CATEGORIES).forEach(catKey => {
            const categoryName = TEMPLATE_CATEGORIES[catKey];
            const categoryTemplates = TEMPLATES.filter(t => t.category === catKey);

            // Random shuffle
            const shuffled = [...categoryTemplates].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 5);

            results[categoryName] = selected.map(t => generateTitle(t, analysis));
        });

        return results;
    }, [analysis, externalTitles]);

    return (
        <div className="w-full max-w-7xl animate-fade-in pb-20">

            {/* Top Section: Analysis Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <SummaryCard icon={<TrendingUp className="text-blue-400" />} label="핵심 키워드" value={analysis.keywords.join(', ')} />
                <SummaryCard icon={<Sparkles className="text-yellow-400" />} label="타겟 시청자" value={analysis.target} />
                <SummaryCard icon={<Zap className="text-purple-400" />} label="권위/신뢰도 요소" value={analysis.authority} />
            </div>

            {/* Main Grid: Titles */}
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="bg-red-600 w-2 h-8 rounded-full inline-block"></span>
                AI 추천 제목 리스트
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
                <CategoryColumn
                    title="긴박형 / 손실회피"
                    titles={displayTitles['긴박형/불안형']}
                    color="border-red-500/50"
                    icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                />
                <CategoryColumn
                    title="실험형 / 호기심"
                    titles={displayTitles['실험형/경험형']}
                    color="border-purple-500/50"
                    icon={<Lightbulb className="w-5 h-5 text-purple-500" />}
                />
                <CategoryColumn
                    title="비교형 / 분석형"
                    titles={displayTitles['비교형/분석형']}
                    color="border-blue-500/50"
                    icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                />
                <CategoryColumn
                    title="어그로형 / 비법공개"
                    titles={displayTitles['어그로형/비법형']}
                    color="border-orange-500/50"
                    icon={<Zap className="w-5 h-5 text-orange-500" />}
                />
            </div>

            {/* Bottom Section: Thumbnails */}
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="bg-red-600 w-2 h-8 rounded-full inline-block"></span>
                썸네일 텍스트 전략
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">추천 문구 (키워드 위주)</h3>
                        <div className="space-y-3">
                            {analysis.thumbnails && analysis.thumbnails.length > 0 ? (
                                analysis.thumbnails.map((text, i) => (
                                    <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-center">
                                        <p className="text-white font-bold text-2xl mb-1 uppercase break-keep">"{text}"</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500">생성된 썸네일 문구가 없습니다.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">썸네일 체크리스트</h3>
                        <ul className="space-y-3">
                            {[
                                "모바일에서도 글씨가 잘 보이는가?",
                                "호기심을 자극하는 이미지를 사용했는가?",
                                "사람의 감정(놀람, 화남, 기쁨)이 드러나는가?",
                                "배경과 글씨의 색상 대비가 확실한가? (검+노, 빨+흰)",
                                "텍스트는 5단어 이하로 짧은가?"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-sm">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button onClick={onReset} className="text-slate-500 hover:text-white underline transition-colors">
                    다른 파일 분석하기
                </button>
            </div>

        </div>
    );
}

function SummaryCard({ icon, label, value }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium">{label}</p>
                <p className="text-white text-lg font-bold leading-tight">{value}</p>
            </div>
        </div>
    );
}

function CategoryColumn({ title, titles, color, icon }) {
    return (
        <div className={`bg-slate-900/40 rounded-3xl p-6 border ${color} backdrop-blur-sm hover:bg-slate-900/60 transition-colors`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800`}>
                    {icon}
                </div>
                <h3 className="font-bold text-lg text-slate-200">{title}</h3>
            </div>

            <div className="space-y-4">
                {titles && titles.map((item, idx) => (
                    <div key={idx} className="group cursor-pointer">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-red-500/50 hover:bg-slate-800 transition-all">
                            {/* Handle both string (legacy) and object (Gemini) formats */}
                            <p className="font-medium text-white leading-snug mb-1">
                                {typeof item === 'string' ? item : item.title}
                            </p>
                            {typeof item !== 'string' && item.reason && (
                                <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                                    <span className="shrink-0 text-yellow-500/80">💡</span>
                                    {item.reason}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                {(!titles || titles.length === 0) && (
                    <p className="text-slate-500 text-sm text-center py-4">제목 생성 실패</p>
                )}
            </div>
        </div>
    );
}
