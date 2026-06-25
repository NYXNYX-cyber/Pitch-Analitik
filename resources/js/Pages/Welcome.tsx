import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowRight, BarChart2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Pitch Deck Diagnostic Audit" />
            <div className="min-h-screen bg-neo-sand text-neo-charcoal font-sans flex flex-col justify-between selection:bg-neo-orange selection:text-white">

                {/* Header Nav */}
                <header className="border-b-4 border-neo-charcoal bg-white sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-sans text-3xl font-black uppercase tracking-tighter border-4 border-neo-charcoal bg-neo-orange text-white px-4 py-2 shadow-neo">
                                PDA
                            </span>
                            <span className="font-mono text-xs font-black uppercase tracking-widest hidden sm:inline-block">
                                Pitch Deck Audit
                            </span>
                        </div>

                        <nav className="flex gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="border-4 border-neo-charcoal bg-neo-orange text-white font-sans text-xs sm:text-sm font-extrabold uppercase tracking-wider px-5 py-2.5 shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-0 active:translate-y-0 active:shadow-neo transition-all rounded-none"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="border-4 border-neo-charcoal bg-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-2.5 shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-0 active:translate-y-0 active:shadow-neo transition-all rounded-none"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="border-4 border-neo-charcoal bg-neo-orange text-white font-sans text-xs sm:text-sm font-extrabold uppercase tracking-wider px-5 py-2.5 shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-0 active:translate-y-0 active:shadow-neo transition-all rounded-none"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <span className="bg-neo-orange text-white border-2 border-neo-charcoal px-3 py-1 font-mono text-xs font-bold uppercase w-fit shadow-neo">
                                Verifikasi Pitch Asinkron & AI
                            </span>
                            <h1 className="font-sans font-black text-5xl sm:text-7xl uppercase tracking-tighter text-neo-charcoal leading-none">
                                AUDIT PITCH DECK TANPA BASA-BASI
                            </h1>
                            <p className="font-sans text-lg sm:text-xl font-medium leading-relaxed max-w-xl">
                                Diagnostik pitch deck otomatis menggunakan model AI vision **Qwen2.5-VL** & pencarian RAG **Qdrant**. Dapatkan penilaian objektif metrik bisnis dan analisis kompetitor secara real-time.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="inline-flex items-center justify-center gap-2 border-4 border-neo-charcoal bg-neo-orange text-white font-sans text-base font-extrabold uppercase tracking-wider px-8 py-4 shadow-neo-lg hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-neo-xl active:translate-x-0 active:translate-y-0 active:shadow-neo-lg transition-all rounded-none"
                                >
                                    Uji Pitch Deck Sekarang
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Interactive Feature Preview Card */}
                        <div className="lg:col-span-5 bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg relative">
                            <div className="absolute top-[-15px] left-4 bg-neo-charcoal text-white border-2 border-neo-charcoal px-3 py-0.5 font-mono text-xs font-bold uppercase">
                                [ Preview Dashboard Audit ]
                            </div>

                            <div className="border-b-2 border-neo-charcoal/20 pb-4 mb-4 flex justify-between items-center mt-2">
                                <h3 className="font-sans text-lg font-black uppercase">[ SLIDE 1: OVERVIEW ]</h3>
                                <span className="bg-neo-teal text-white border border-neo-charcoal px-2 py-0.5 font-mono text-[10px] font-bold uppercase shadow-neo">
                                    Audited
                                </span>
                            </div>

                            <div className="flex flex-col gap-4 font-mono text-xs text-neo-charcoal">
                                <div className="bg-neo-sand/40 border border-neo-charcoal/20 p-3">
                                    <span className="text-neo-orange font-bold block mb-1">RANGKUMAN:</span>
                                    <span>Model SaaS B2B dengan proyeksi pertumbuhan tinggi. Fokus audit pada target pendanaan dan daya tahan modal.</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="border border-neo-charcoal/20 p-2 bg-white">
                                        <span className="text-neo-charcoal/50 block">FUNDING:</span>
                                        <span className="font-bold">Rp 5.000.000.000</span>
                                    </div>
                                    <div className="border border-neo-charcoal/20 p-2 bg-white">
                                        <span className="text-neo-charcoal/50 block">RUNWAY:</span>
                                        <span className="font-bold">18 Bulan</span>
                                    </div>
                                </div>
                                <div className="border border-neo-charcoal/20 p-3 bg-white">
                                    <span className="text-neo-orange font-bold block mb-1">KOMPETITOR DI-SCRAPE:</span>
                                    <span className="font-bold">PitchLeague.ai, Evalyze.ai</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Matrix Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo">
                            <Zap size={32} className="text-neo-orange mb-4" />
                            <h3 className="font-sans text-lg font-black uppercase mb-2">Asinkron & Cepat</h3>
                            <p className="font-sans text-sm font-medium text-neo-charcoal/80">
                                Proses konversi DOCX ke PDF dan ekstraksi data gambar diproses di latar belakang menggunakan Laravel Horizon Queue.
                            </p>
                        </div>
                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo">
                            <BarChart2 size={32} className="text-neo-orange mb-4" />
                            <h3 className="font-sans text-lg font-black uppercase mb-2">Multimodal AI Vision</h3>
                            <p className="font-sans text-sm font-medium text-neo-charcoal/80">
                                Menggunakan vLLM dengan model Qwen2.5-VL untuk memahami grafik, tabel, dan tata letak slide visual secara akurat.
                            </p>
                        </div>
                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo">
                            <ShieldCheck size={32} className="text-neo-orange mb-4" />
                            <h3 className="font-sans text-lg font-black uppercase mb-2">Scraping Data Terkini</h3>
                            <p className="font-sans text-sm font-medium text-neo-charcoal/80">
                                Integrasi Firecrawl API memastikan informasi, pendanaan, dan aktivitas kompetitor yang ditemukan di-scrape secara real-time.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t-4 border-neo-charcoal bg-white py-8 px-4 sm:px-6 lg:px-8 text-center font-mono text-xs text-neo-charcoal/60">
                    <p>&copy; {new Date().getFullYear()} Pitch Deck Diagnostic Audit. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}