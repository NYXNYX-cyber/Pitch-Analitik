import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AnalysisCard from '@/Components/AnalysisCard';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Upload, Loader2, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

// Setup worker untuk PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PitchDeck {
    id: number;
    filename: string;
    original_name: string;
    status: string;
    results: any;
    created_at: string;
}

interface AnalyzerProps {
    status?: string;
    auth: any;
    pitchDecks: PitchDeck[];
    activeDeck: PitchDeck | null;
    pdfUrl: string | null;
}

export default function Analyzer({ auth, status, pitchDecks = [], activeDeck, pdfUrl }: AnalyzerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pdfFile, setPdfFile] = useState<string | null>(null);

    // Muat berkas PDF ketika pdfUrl berubah dari server
    useEffect(() => {
        if (pdfUrl) {
            setPdfFile(pdfUrl);
        } else {
            setPdfFile(null);
        }
        setPageNumber(1);
        setNumPages(null);
    }, [pdfUrl, activeDeck]);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
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
            if (file.size > 10 * 1024 * 1024) {
                setError('document', 'Ukuran berkas tidak boleh melebihi 10MB. Silakan tingkatkan ke Premium untuk batas lebih besar!');
                setData('document', null);
                setPdfFile(null);
                return;
            }
            clearErrors('document');
            setData('document', file);
            const objectUrl = URL.createObjectURL(file);
            setPdfFile(objectUrl);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('analyzer.upload'), {
            onSuccess: () => {
                setData('document', null);
            }
        });
    }

    // Ambil data analisis halaman aktif
    const activePageAnalysis = activeDeck?.results?.[pageNumber] || null;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-sans text-2xl font-extrabold uppercase tracking-tight text-neo-charcoal">
                    Pitch Deck Diagnostic Audit
                </h2>
            }
        >
            <Head title="Pitch Deck Analyzer" />

            <div className="py-12 bg-neo-sand min-h-screen text-neo-charcoal">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-8">
                    {/* Status Alerts */}
                    {status && (
                        <div className="bg-neo-teal text-white border-4 border-neo-charcoal p-4 shadow-neo font-sans font-bold uppercase">
                            {status}
                        </div>
                    )}

                    {/* Upload Section Neo-Brutalist */}
                    <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg">
                        <h3 className="font-sans text-xl font-extrabold uppercase tracking-wide mb-4">
                            [ Unggah Pitch Deck ]
                        </h3>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
                            <label className="flex-1 w-full flex items-center justify-center gap-3 border-2 border-dashed border-neo-charcoal/40 p-4 bg-neo-sand/20 cursor-pointer hover:bg-neo-sand/40 transition">
                                <Upload size={20} className="text-neo-charcoal" />
                                <span className="font-mono text-xs font-bold uppercase text-neo-charcoal/80">
                                    {data.document ? (data.document as File).name : "Pilih dokumen PDF / DOCX (Max 10MB)"}
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
                                        Mengunggah...
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

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Riwayat (Kiri) */}
                        <div className="lg:col-span-1 bg-white border-4 border-neo-charcoal p-6 shadow-neo flex flex-col gap-4">
                            <h4 className="font-sans text-md font-extrabold uppercase tracking-wide border-b-2 border-neo-charcoal pb-2">
                                [ Riwayat Audit ]
                            </h4>
                            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto font-mono text-xs">
                                {pitchDecks.length === 0 ? (
                                    <span className="text-neo-charcoal/50 italic py-4 text-center">Belum ada riwayat.</span>
                                ) : (
                                    pitchDecks.map((deck) => (
                                        <div
                                            key={deck.id}
                                            className="relative group"
                                        >
                                            <Link
                                                href={route('analyzer.index', { id: deck.id })}
                                                className={`p-3 pr-10 border-2 border-neo-charcoal flex flex-col gap-1 transition block ${
                                                    activeDeck?.id === deck.id
                                                        ? 'bg-neo-orange text-white shadow-neo'
                                                        : 'bg-neo-sand/20 hover:bg-neo-sand/40 font-neo-charcoal'
                                                }`}
                                            >
                                                <span className="font-bold truncate block">{deck.original_name}</span>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className={`text-[10px] px-1.5 py-0.5 border border-neo-charcoal font-bold uppercase ${
                                                        deck.status === 'completed'
                                                            ? 'bg-neo-teal text-white'
                                                            : deck.status === 'failed'
                                                            ? 'bg-neo-crimson text-white'
                                                            : 'bg-yellow-400 text-neo-charcoal animate-pulse'
                                                    }`}>
                                                        {deck.status === 'completed' ? 'Selesai' : deck.status === 'failed' ? 'Gagal' : 'Proses'}
                                                    </span>
                                                    <span className="text-[9px] opacity-80">
                                                        {new Date(deck.created_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                </div>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (confirm('Apakah Anda yakin ingin menghapus riwayat audit dokumen ini? Tindakan ini permanen.')) {
                                                        router.delete(route('analyzer.destroy', { pitchDeck: deck.id }));
                                                    }
                                                }}
                                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 border border-neo-charcoal bg-white text-neo-crimson hover:bg-neo-crimson hover:text-white transition shadow-neo-sm ${
                                                    activeDeck?.id === deck.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                }`}
                                                title="Hapus Riwayat"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Split View Analyzer (Kanan) */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Panel PDF */}
                            <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg flex flex-col items-center">
                                <div className="border-b-4 border-neo-charcoal pb-4 mb-4 w-full flex justify-between items-center">
                                    <h4 className="font-sans text-md font-extrabold uppercase tracking-wide truncate max-w-[200px]">
                                        {activeDeck ? activeDeck.original_name : '[ Penampil Dokumen ]'}
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
                                                width={350}
                                            />
                                        </Document>
                                    ) : (
                                        <div className="font-sans text-sm italic text-neo-charcoal/60 py-24 text-center">
                                            {activeDeck && activeDeck.status !== 'completed'
                                                ? 'Dokumen sedang dikonversi / dianalisis. Silakan tunggu...'
                                                : 'Pilih dokumen dari riwayat atau unggah dokumen baru untuk memulai audit.'}
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

                            {/* Panel Analisis */}
                            <div className="flex flex-col gap-6">
                                {activeDeck ? (
                                    activeDeck.status === 'completed' ? (
                                        <AnalysisCard
                                            pageNumber={pageNumber}
                                            data={activePageAnalysis}
                                        />
                                    ) : activeDeck.status === 'failed' ? (
                                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg flex flex-col items-center text-center gap-4">
                                            <AlertCircle size={48} className="text-neo-crimson" />
                                            <h4 className="font-sans text-lg font-black uppercase text-neo-crimson">
                                                {activeDeck.results?.cancelled ? 'Audit Dibatalkan' : 'Analisis Gagal'}
                                            </h4>
                                            <p className="font-sans text-sm font-medium">
                                                {activeDeck.results?.cancelled
                                                    ? 'Proses audit dokumen ini telah dibatalkan secara manual oleh pengguna.'
                                                    : 'Kami mengalami kendala saat memproses dokumen ini. Silakan coba unggah kembali berkas Anda atau pastikan berkas tidak rusak.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg flex flex-col items-center text-center gap-4">
                                            <Loader2 size={48} className="animate-spin text-neo-orange" />
                                            <h4 className="font-sans text-lg font-black uppercase text-neo-orange">
                                                Dokumen Sedang Diproses
                                            </h4>
                                            <p className="font-sans text-sm font-medium">
                                                Kecerdasan Buatan kami sedang melakukan ekstraksi halaman, analisis visual mendalam, penelusuran kompetitor, dan benchmarking data secara asinkron.
                                            </p>
                                            <span className="font-mono text-xs bg-neo-sand border border-neo-charcoal px-3 py-1.5 font-bold uppercase animate-pulse">
                                                Status: {activeDeck.status.toUpperCase()}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm('Apakah Anda yakin ingin membatalkan proses audit ini?')) {
                                                        router.post(route('analyzer.cancel', { pitchDeck: activeDeck.id }));
                                                    }
                                                }}
                                                className="mt-2 bg-neo-crimson text-white border-4 border-neo-charcoal px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition"
                                            >
                                                Hentikan Audit
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg flex flex-col items-center text-center gap-4 py-16">
                                        <FileText size={48} className="text-neo-charcoal/50" />
                                        <h4 className="font-sans text-lg font-black uppercase text-neo-charcoal/60">
                                            Belum Ada Dokumen
                                        </h4>
                                        <p className="font-sans text-sm font-medium text-neo-charcoal/60">
                                            Silakan pilih dokumen dari riwayat audit di sebelah kiri atau unggah berkas baru melalui panel di atas.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}