import React from 'react';

interface AnalysisCardProps {
    pageNumber: number;
    data: {
        summary?: string;
        metrics?: {
            burn_rate?: string;
            revenue?: string;
            [key: string]: any;
        };
        competitors?: string[];
        competitors_enriched?: Array<{ name: string; details: string }>;
        benchmarks?: any[];
    } | null;
}

export default function AnalysisCard({ pageNumber, data }: AnalysisCardProps) {
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

            {/* Ringkasan Analisis */}
            <div>
                <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-neo-orange mb-2">
                    [ Ringkasan Evaluasi ]
                </h4>
                <p className="font-sans text-base leading-relaxed font-medium">
                    {data.summary || 'Tidak ada ringkasan analisis untuk halaman ini.'}
                </p>
            </div>

            {/* Metrik Keuangan */}
            {data.metrics && Object.keys(data.metrics).length > 0 && (
                <div className="bg-white border-2 border-neo-charcoal p-4 shadow-neo">
                    <h4 className="font-mono text-sm font-bold uppercase tracking-wider mb-3">
                        [ Metrik Keuangan Terdeteksi ]
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(data.metrics).map(([key, value]) => (
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
        </div>
    );
}