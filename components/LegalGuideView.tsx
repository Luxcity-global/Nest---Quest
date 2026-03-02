import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker using Vite's URL pattern for static assets
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const motionAny: any = motion;

const NestorReadingMascot = () => (
  <div className="relative flex flex-col items-center py-10">
    <div className="relative w-40 h-40 mb-8">
      {/* Nestor the Owl (Blue Legal Variant) */}
      <motionAny.div
        className="w-24 h-24 bg-brand-blue rounded-full mx-auto relative shadow-xl border-4 border-white z-20"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Nestor's Glasses */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex gap-1 z-30">
          <div className="w-8 h-8 border-2 border-gray-900 rounded-full bg-blue-100/30 flex items-center justify-center">
            <motionAny.div
              className="w-2 h-2 bg-gray-900 rounded-full"
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="w-8 h-8 border-2 border-gray-900 rounded-full bg-blue-100/30 flex items-center justify-center">
            <motionAny.div
              className="w-2 h-2 bg-gray-900 rounded-full"
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-900"></div>
        </div>

        {/* Beak */}
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rotate-45 rounded-sm"></div>

        {/* Wings */}
        <motionAny.div
          className="absolute -left-2 top-1/2 w-6 h-10 bg-brand-blue-dark rounded-l-3xl border-l-2 border-white/20"
          animate={{ rotate: [-10, -25, -10] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motionAny.div
          className="absolute -right-2 top-1/2 w-6 h-10 bg-brand-blue-dark rounded-r-3xl border-r-2 border-white/20"
          animate={{ rotate: [10, 25, 10] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motionAny.div>

      {/* The "Legal Document" */}
      <motionAny.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-36 bg-white rounded-lg border-2 border-gray-100 shadow-md z-10 p-4 space-y-2 overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-full h-2 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-1.5 bg-gray-100 rounded"></div>
        <div className="w-full h-1.5 bg-gray-100 rounded"></div>
        <div className="w-5/6 h-1.5 bg-gray-100 rounded"></div>
        <div className="w-full h-1.5 bg-gray-100 rounded"></div>
        <div className="w-2/3 h-1.5 bg-gray-100 rounded"></div>
        <div className="w-full h-1.5 bg-gray-100 rounded"></div>

        {/* Scanning Light Beam */}
        <motionAny.div
          className="absolute left-0 right-0 h-1 bg-brand-blue/30 shadow-[0_0_10px_rgba(19,108,158,0.5)] z-20"
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </motionAny.div>

      {/* Magnifying Glass */}
      <motionAny.div
        className="absolute -right-4 bottom-12 w-12 h-12 z-30 pointer-events-none"
        animate={{
          x: [-10, 10, -10],
          y: [-5, 5, -5],
          rotate: [0, 15, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 rounded-full border-4 border-gray-800 bg-white/20 backdrop-blur-sm relative">
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-6 bg-gray-800 rounded-full origin-top transform -rotate-12"></div>
        </div>
      </motionAny.div>
    </div>

    <div className="text-center">
      <h3 className="text-2xl font-black text-gray-900">Nestor is reading...</h3>
      <p className="text-gray-500 font-bold mt-2">Checking clauses for fairness and student safety.</p>

      {/* Animated Loading Text */}
      <div className="flex justify-center gap-1 mt-4">
        <motionAny.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} />
        <motionAny.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
        <motionAny.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
      </div>
    </div>
  </div>
);

export const LegalGuideView: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n\n';
    }

    return text.trim();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      setIsAnalyzing(true);
      setExplanation(null);

      try {
        let text = '';
        if (file.type === 'application/pdf') {
          text = await extractTextFromPDF(file);
        } else {
          // Fallback for text files
          text = await file.text();
        }

        if (text.length < 50) {
          throw new Error('Contract text too short. Please ensure a complete contract was extracted (min 50 chars).');
        }

        await analyzeContract(text);
      } catch (err) {
        console.error('File processing error:', err);
        setExplanation(err instanceof Error ? err.message : 'Failed to process file');
        setIsAnalyzing(false);
      }
    }
  };

  const analyzeContract = async (contractText: string) => {
    setIsAnalyzing(true);
    setExplanation(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_text: contractText })
      });

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error('Invalid input. Please ensure you are sending a valid contract text (50-50,000 chars).');
        } else if (response.status === 503) {
          throw new Error('AI service is temporarily unavailable. Please try again in an hour.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extended delay for animation
      await new Promise(r => setTimeout(r, 2000));

      // As per the pattern: { analysis: string, model: string }
      setExplanation(data.analysis || "Nestor couldn't read that one. Try again!");
    } catch (err) {
      console.error('Analysis error:', err);
      setExplanation(err instanceof Error ? err.message : "Nestor's legal brain is a bit fuzzy right now. Check back soon!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <motionAny.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-brand-blue/10 text-brand-blue px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            Student Legal Hub
          </motionAny.div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Tenancy Law, <span className="text-brand-blue">Explained.</span></h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            Don't get lost in the jargon. Nestor breaks down your tenancy agreement so you know exactly what you're signing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main AI Tool */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-blue/5 rounded-full blur-2xl"></div>

              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 bg-brand-blue text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-blue-100">
                  <i className="fa-solid fa-file-shield"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Nestor Explains Your Contract</h2>
                  <p className="text-gray-500 font-bold text-sm">Upload your agreement for a student-friendly breakdown.</p>
                </div>
              </div>

              {!explanation && !isAnalyzing ? (
                <div className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-16 text-center group hover:border-brand-blue/30 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Drop your contract here</h3>
                  <p className="text-gray-400 font-medium">Supports PDF or Word documents (.docx)</p>
                  <button className="mt-8 bg-brand-blue text-white px-8 py-3.5 rounded-xl font-black hover:bg-brand-blue-dark transition-all shadow-lg shadow-blue-50">
                    Browse Files
                  </button>
                </div>
              ) : isAnalyzing ? (
                <NestorReadingMascot />
              ) : (
                <motionAny.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-brand-blue/10">
                    <div className="flex items-center gap-3 text-brand-blue font-black text-sm uppercase tracking-widest mb-6">
                      <i className="fa-solid fa-sparkles"></i>
                      Nestor's Summary for {selectedFile}
                    </div>
                    <div className="prose prose-blue max-w-none text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                      {explanation}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setExplanation(null)}
                      className="flex-1 bg-white border-2 border-gray-100 text-gray-500 py-4 rounded-xl font-black hover:bg-gray-50 transition-all"
                    >
                      Analyze Another
                    </button>
                    <button className="flex-1 bg-brand-blue text-white py-4 rounded-xl font-black hover:bg-brand-blue-dark transition-all shadow-lg flex items-center justify-center gap-2">
                      <i className="fa-solid fa-download"></i>
                      Download PDF Guide
                    </button>
                  </div>
                </motionAny.div>
              )}
            </section>
          </div>

          {/* Sidebar Guides */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-brand-orange text-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100">
              <h3 className="text-xl font-black mb-4">Quick Legal Wins</h3>
              <ul className="space-y-4">
                {[
                  { icon: 'fa-shield', text: 'Right to repair' },
                  { icon: 'fa-lock', text: 'Deposit protection' },
                  { icon: 'fa-eye-slash', text: '24h Notice required' },
                  { icon: 'fa-gavel', text: 'Unfair terms' }
                ].map(item => (
                  <li key={item.text} className="flex items-center gap-3 text-sm font-bold opacity-90">
                    <i className={`fa-solid ${item.icon} w-5`}></i>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Need expert help?</h4>
              <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                If your contract looks suspicious, we recommend contacting Citizens Advice or your University Housing Office.
              </p>
              <button className="w-full py-4 rounded-xl border-2 border-brand-blue text-brand-blue font-black text-xs hover:bg-brand-blue hover:text-white transition-all uppercase tracking-widest">
                View Resources
              </button>
            </div>
          </div>
        </div>

        {/* Jargon Buster */}
        <section className="mt-20">
          <h2 className="text-3xl font-black text-gray-900 mb-10 text-center">Legal Jargon Buster</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { term: 'Guarantor', def: 'Someone (usually a parent) who pays your rent if you can\'t.' },
              { term: 'Break Clause', def: 'A magic rule that lets you end your contract early.' },
              { term: 'AST', def: 'Assured Shorthold Tenancy - the standard student contract.' },
              { term: 'Joint Liability', def: 'You\'re responsible for your flatmates\' unpaid rent too!' },
              { term: 'Quiet Enjoyment', def: 'Your legal right to live in peace without the landlord popping in.' },
              { term: 'Inventories', def: 'The "Before" photos you must take to get your deposit back.' }
            ].map(j => (
              <div key={j.term} className="bg-white p-6 rounded-2xl border border-gray-50 hover:shadow-md transition-all">
                <h4 className="font-black text-brand-blue mb-2">{j.term}</h4>
                <p className="text-sm text-gray-500 font-medium">{j.def}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
