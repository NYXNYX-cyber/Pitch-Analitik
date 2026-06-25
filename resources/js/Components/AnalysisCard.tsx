import React from 'react';

interface AnalysisData {
    summary?: string;
    metrics?: {
        burn_rate?: string;
        revenue?: string;
        [key: string]: any;
    };
    competitors?: string[];
    insufficient_data?: boolean;
    verifications?: Array<{
        claim: string;
        status: 'verified_fact' | 'needs_verification' | 'unverified';
        explanation?: string;
        search_query?: string;
        search_result?: any;
    }>;
    suggested_queries?: string[];
}

interface AnalysisCardProps {
    pageNumber: number;
    data: {
        analysis?: AnalysisData | any[]; // Bisa berupa array kosong jika tidak terdeteksi
        competitors_enriched?: Array<{ name: string; details: string }>;
        benchmarks?: any[];
        fact_check_results?: {
            missing_data_search?: any;
        };
    } | null;
}

export default function AnalysisCard({ pageNumber, data }: AnalysisCardProps) {
    const renderSearchResults = (searchResult: any) => {
        if (!searchResult) {
            return <p className="text-xs italic text-neo-charcoal/60">Tidak ada referensi data eksternal</p>;
        }

        if (searchResult.data && Array.isArray(searchResult.data)) {
            if (searchResult.data.length === 0) {
                return <p className="text-xs italic text-neo-charcoal/60">Tidak ada referensi data eksternal</p>;
            }
            return (
                <div className="flex flex-col gap-2 mt-2">
                    {searchResult.data.map((item: any, idx: number) => (
                        <div key={idx} className="border border-neo-charcoal p-3 bg-white mb-2 shadow-neo-sm text-left font-sans">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neo-orange hover:underline font-bold"
                            >
                                {item.title || item.url}
                            </a>
                            {(item.description || item.snippet) && (
                                <p className="text-xs mt-1 text-neo-charcoal/80 leading-normal">
                                    {item.description || item.snippet}
                                </p>
                            )}
                            <div className="text-[10px] text-neo-charcoal/40 break-all font-mono mt-1">
                                {item.url}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof searchResult === 'string' && searchResult.trim() !== '') {
            return <div className="font-sans text-xs text-neo-charcoal/90 leading-relaxed whitespace-pre-wrap">{searchResult}</div>;
        }

        return <p className="text-xs italic text-neo-charcoal/60">Tidak ada referensi data eksternal</p>;
    };

    if (!data) {
        return (
            <div className="bg-neo-sand border-4 border-neo-charcoal p-6 shadow-neo-lg text-neo-charcoal">
                <h3 className="font-mono text-xl font-bold uppercase tracking-wider mb-2">
                    Slide {pageNumber}
                </h3>
                <p className="font-sans text-sm italic">
                    Belum ada analisis untuk halaman ini. Silakan unggah dokumen terlebih dahulu.
                </p>
            </div>
        );
    }

    // Ambil data analisis dari payload
    const analysis = data.analysis && !Array.isArray(data.analysis) ? data.analysis : null;
    const summary = analysis?.summary;
    const metrics = analysis?.metrics;

    return (
        <div className="bg-neo-sand border-4 border-neo-charcoal p-6 shadow-neo-lg text-neo-charcoal flex flex-col gap-6">
            {/* Header Slide */}
            <div className="border-b-4 border-neo-charcoal pb-4 flex justify-between items-center">
                <h3 className="font-sans text-3xl font-extrabold uppercase tracking-tight">
                    Slide {pageNumber}
                </h3>
                <span className="bg-neo-orange text-white border-2 border-neo-charcoal px-3 py-1 font-mono text-xs font-bold uppercase shadow-neo">
                    Audited
                </span>
            </div>

            {/* Peringatan Data Minim */}
            {analysis?.insufficient_data && (
                <div className="bg-[#E63946] text-white border-4 border-neo-charcoal p-4 shadow-neo-lg font-bold flex flex-col gap-2">
                    <div className="text-lg uppercase tracking-wider flex items-center gap-2">
                        ⚠️ PERINGATAN: DATA MINIM / TIDAK CUKUP
                    </div>
                    <p className="text-sm font-medium">
                        Slide ini kekurangan data pendukung yang memadai untuk analisis mendalam.
                    </p>
                    {data.fact_check_results?.missing_data_search && (
                        <div className="mt-2 bg-white text-neo-charcoal border-2 border-neo-charcoal p-3 font-mono text-xs max-h-40 overflow-y-auto whitespace-pre-wrap font-normal">
                            <div className="font-bold mb-1 uppercase tracking-wider text-red-600">[ Referensi Pencarian Data Tambahan ]</div>
                            {renderSearchResults(data.fact_check_results.missing_data_search)}
                        </div>
                    )}
                </div>
            )}

            {/* Ringkasan Analisis */}
            <div>
                <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-neo-orange mb-2">
                    [ Ringkasan Evaluasi ]
                </h4>
                <p className="font-sans text-base leading-relaxed font-medium">
                    {summary || 'Tidak ada ringkasan analisis untuk halaman ini.'}
                </p>
            </div>

            {/* Metrik Keuangan */}
            {metrics && Object.keys(metrics).length > 0 && (
                <div className="bg-white border-2 border-neo-charcoal p-4 shadow-neo">
                    <h4 className="font-mono text-sm font-bold uppercase tracking-wider mb-3">
                        [ Metrik Keuangan Terdeteksi ]
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(metrics).map(([key, value]) => (
                            <div key={key} className="border border-neo-charcoal/30 p-2">
                                <span className="block font-mono text-xs text-neo-charcoal/60 capitalize">
                                    {key.replace('_', ' ')}
                                </span>
                                <span className="font-mono text-sm font-bold">
                                    {String(value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Analisis Pesaing & Scraping Data */}
            {data.competitors_enriched && data.competitors_enriched.length > 0 && (
                <div>
                    <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-neo-orange mb-3">
                        [ Analisis Lanskap Kompetitor ]
                    </h4>
                    <div className="flex flex-col gap-3">
                        {data.competitors_enriched.map((comp, idx) => (
                            <div key={idx} className="border-2 border-neo-charcoal p-4 bg-white shadow-neo">
                                <h5 className="font-sans text-lg font-extrabold uppercase border-b border-neo-charcoal/20 pb-1 mb-2">
                                    {comp.name}
                                </h5>
                                <div className="font-mono text-xs max-h-40 overflow-y-auto whitespace-pre-wrap leading-tight text-neo-charcoal/80 bg-neo-sand/40 p-2 border border-neo-charcoal/20">
                                    {comp.details}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Audit Fakta (Fact-check) & Verifikasi */}
            {analysis?.verifications && analysis.verifications.length > 0 && (
                <div>
                    <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-neo-orange mb-3">
                        [ Audit Fakta & Verifikasi ]
                    </h4>
                    <div className="flex flex-col gap-4">
                        {analysis.verifications.map((verification, idx) => {
                            let badgeBg = '';
                            let badgeText = '';
                            let textColor = '';

                            switch (verification.status) {
                                case 'verified_fact':
                                    badgeBg = 'bg-[#2A9D8F]';
                                    badgeText = 'FAKTA TERVERIFIKASI';
                                    textColor = 'text-white';
                                    break;
                                case 'needs_verification':
                                    badgeBg = 'bg-[#F4A261]';
                                    badgeText = 'PERLU VERIFIKASI';
                                    textColor = 'text-black';
                                    break;
                                case 'unverified':
                                    badgeBg = 'bg-[#E63946]';
                                    badgeText = 'BELUM TERVERIFIKASI';
                                    textColor = 'text-white';
                                    break;
                                default:
                                    badgeBg = 'bg-neo-charcoal';
                                    badgeText = 'STATUS TIDAK DIKETAHUI';
                                    textColor = 'text-white';
                            }

                            return (
                                <div key={idx} className="border-4 border-neo-charcoal p-4 bg-white shadow-neo-lg flex flex-col gap-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-neo-charcoal pb-2 mb-1">
                                        <span className="font-sans font-bold text-base text-neo-charcoal">
                                            Klaim #{idx + 1}: "{verification.claim}"
                                        </span>
                                        <span className={`${badgeBg} ${textColor} border-2 border-neo-charcoal px-3 py-1 font-mono text-xs font-black tracking-wider shadow-neo`}>
                                            {badgeText}
                                        </span>
                                    </div>
                                    {verification.explanation && (
                                        <p className="font-sans text-sm font-medium text-neo-charcoal/90 leading-relaxed">
                                            {verification.explanation}
                                        </p>
                                    )}
                                    {verification.search_result && (
                                        <div className="font-mono text-xs bg-neo-sand/60 border-2 border-neo-charcoal p-3 mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap">
                                            <div className="font-bold mb-1 uppercase tracking-wider text-neo-charcoal/80">[ Hasil Pencarian Web ]</div>
                                            {renderSearchResults(verification.search_result)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}