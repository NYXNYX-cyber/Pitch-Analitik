import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AnalysisCard from '@/Components/AnalysisCard';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Upload, Loader2 } from 'lucide-react';

// Setup worker untuk PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface AnalyzerProps {
    status?: string;
    auth: any;
}

export default function Analyzer({ auth, status }: AnalyzerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pdfFile, setPdfFile] = useState<string | null>(null);

    // Data simulasi lokal untuk memvisualisasikan UI sebelum pipeline asinkron selesai diproses
    const [analysisData, setAnalysisData] = useState<Record<number, any>>({
        1: {
            summary: "Proposal bisnis ini menyajikan platform analitik data diagnostik untuk pitch deck startup menggunakan kecerdasan buatan visual dan pangkalan data vektor lokal.",
            metrics: {
                target_pendanaan: "Rp 5.000.000.000",
                burn_rate_bulanan: "Rp 150.000.000",
                runway: "18 Bulan"
            },
            competitors_enriched: [
                { name: "Evalyze.ai", details: "Layanan berbasis cloud untuk menganalisis kesiapan investasi pitch deck secara otomatis." },
                { name: "PitchLeague.ai", details: "Layanan analitik pitch deck untuk pendiri startup dengan skor evaluasi numerik." }
            ]
        }
    });

    const { data, setData, post, processing, errors } = useForm({
        document: null as File | null,
    });

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => {
            const next = prevPageNumber + offset;
            if (numPages && next >= 1 && next <= numPages) {
                return next;
            }
            return prevPageNumber;
        });
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setData('document', file);
            const objectUrl = URL.createObjectURL(file);
            setPdfFile(objectUrl);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('analyzer.upload'));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-sans text-2xl font-extrabold uppercase tracking-tight text-neo-charcoal">
                    Pitch Deck Diagnostic Audit
                </h2>
            }
        >
            <Head title="Pitch Deck Analyzer" />

            <div className="py-12 bg-neo-sand min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-8">
                    {/* Status Alerts */}
                    {status && (
                        <div className="bg-neo-teal text-white border-4 border-neo-charcoal p-4 shadow-neo font-sans font-bold uppercase">
                            {status}
                        </div>
                    )}

                    {/* Upload Section Neo-Brutalist */}
                    <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg text-neo-charcoal">
                        <h3 className="font-sans text-xl font-extrabold uppercase tracking-wide mb-4">
                            [ Unggah Pitch Deck ]
                        </h3>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
                            <label className="flex-1 w-full flex items-center justify-center gap-3 border-2 border-dashed border-neo-charcoal/40 p-4 bg-neo-sand/20 cursor-pointer hover:bg-neo-sand/40 transition">
                                <Upload size={20} className="text-neo-charcoal" />
                                <span className="font-mono text-xs font-bold uppercase text-neo-charcoal/80">
                                    {data.document ? (data.document as File).name : "Pilih dokumen PDF / DOCX (Max 20MB)"}
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.docx"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={processing || !data.document}
                                className="w-full sm:w-auto bg-neo-orange text-white border-4 border-neo-charcoal px-6 py-4 font-sans text-sm font-extrabold uppercase tracking-wider shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition disabled:opacity-55 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing
                                    </span>
                                ) : (
                                    "Mulai Audit"
                                )}
                            </button>
                        </form>
                        {errors.document && (
                            <p className="mt-2 font-mono text-xs text-neo-crimson font-bold uppercase">
                                {errors.document}
                            </p>
                        )}
                    </div>

                    {/* Split View Analyzer */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Panel PDF (Kiri) */}
                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg text-neo-charcoal flex flex-col items-center">
                            <div className="border-b-4 border-neo-charcoal pb-4 mb-4 w-full flex justify-between items-center">
                                <h4 className="font-sans text-lg font-extrabold uppercase tracking-wide">
                                    [ Penampil Dokumen ]
                                </h4>
                                {numPages && (
                                    <span className="font-mono text-xs font-bold bg-neo-sand border-2 border-neo-charcoal px-2 py-1">
                                        Hal {pageNumber} / {numPages}
                                    </span>
                                )}
                            </div>

                            <div className="border-2 border-neo-charcoal bg-neo-sand/30 p-4 w-full max-h-[600px] overflow-auto flex justify-center items-start">
                                {pdfFile ? (
                                    <Document
                                        file={pdfFile}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        loading={
                                            <div className="font-mono text-xs font-bold uppercase animate-pulse py-8">
                                                Memuat PDF...
                                            </div>
                                        }
                                    >
                                        <Page
                                            pageNumber={pageNumber}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            width={450}
                                        />
                                    </Document>
                                ) : (
                                    <div className="font-sans text-sm italic text-neo-charcoal/60 py-24 text-center">
                                        Belum ada dokumen yang dipilih untuk ditunjukkan.
                                    </div>
                                )}
                            </div>

                            {/* Navigasi Halaman */}
                            {pdfFile && numPages && numPages > 1 && (
                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => changePage(-1)}
                                        disabled={pageNumber <= 1}
                                        className="bg-neo-sand border-4 border-neo-charcoal p-2 shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => changePage(1)}
                                        disabled={pageNumber >= numPages}
                                        className="bg-neo-sand border-4 border-neo-charcoal p-2 shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Panel Analisis (Kanan) */}
                        <div className="flex flex-col gap-6">
                            <AnalysisCard
                                pageNumber={pageNumber}
                                data={analysisData[pageNumber] || null}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}