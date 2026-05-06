import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-24 pb-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary-container/30 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-[1280px] mx-auto px-8 relative z-10 flex flex-col items-center text-center">
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs uppercase tracking-widest">
              Executive Intelligence
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 max-w-4xl mb-6 leading-tight tracking-tight">
              The Future of Executive <br />
              <span className="text-primary">Talent Acquisition</span>
            </h1>
            <p className="text-lg text-secondary max-w-2xl mb-12">
              A curated ecosystem connecting elite organizations with the world's most distinguished executive leaders through precision AI matching and verified insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all shadow-lg active:scale-95">
                Inquire for Access
              </Link>
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95">
                View Talent Network
              </button>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 px-8 max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Refined Precision</h2>
            <p className="text-lg text-secondary">Our suite of tools designed for the modern board and C-suite.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-xl border border-slate-200 premium-shadow hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-indigo-600">auto_awesome</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Precision Matching</h3>
              <p className="text-sm text-secondary leading-relaxed">Advanced AI algorithms analyze 400+ data points to ensure cultural and strategic alignment between executives and organizations.</p>
            </div>
            <div className="bg-white p-10 rounded-xl border border-slate-200 premium-shadow hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-indigo-600">calendar_today</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Automated Scheduling</h3>
              <p className="text-sm text-secondary leading-relaxed">White-glove coordination of multi-stage interviews across global timezones, integrated with executive calendars seamlessly.</p>
            </div>
            <div className="bg-white p-10 rounded-xl border border-slate-200 premium-shadow hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-indigo-600">verified_user</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Verified Referrals</h3>
              <p className="text-sm text-secondary leading-relaxed">Every candidate profile is backed by peer-reviewed endorsements and performance verification from our inner-circle network.</p>
            </div>
          </div>
        </section>

        {/* Talent Pool Preview */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Elite Talent Network</h2>
                <p className="text-lg text-secondary">Preview the calibre of executives currently active in our ecosystem.</p>
              </div>
              <button className="font-bold text-primary flex items-center gap-2 hover:gap-3 transition-all">
                Explore Full Directory <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Candidate Card 1 */}
              <div className="bg-white flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-slate-100 premium-shadow group">
                <div className="w-32 h-32 rounded-lg bg-slate-200 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">Eleanor Vance</h4>
                      <p className="text-sm text-slate-500 mb-3">Chief Technology Officer • 18 Years Exp.</p>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded">Available</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">SaaS Excellence</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">Global Scale</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">IPO Experience</span>
                  </div>
                  <button className="text-primary font-bold text-sm group-hover:underline">View Executive Brief</button>
                </div>
              </div>
              {/* Candidate Card 2 */}
              <div className="bg-white flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-slate-100 premium-shadow group">
                <div className="w-32 h-32 rounded-lg bg-slate-200 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">Marcus Thorne</h4>
                      <p className="text-sm text-slate-500 mb-3">Chief Financial Officer • 22 Years Exp.</p>
                    </div>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded">Confidential</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">M&A Strategy</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">Private Equity</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">FinTech</span>
                  </div>
                  <button className="text-primary font-bold text-sm group-hover:underline">View Executive Brief</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-950 py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]"></div>
          </div>
          <div className="max-w-[1280px] mx-auto px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Secure Your Future Leadership</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
              Access to the Nexus Talent platform is currently by invitation or referral only.
              Inquire today to discuss your organizational needs with a dedicated partner.
            </p>
            <button className="px-10 py-5 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all shadow-xl">
              Request a Private Consultation
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-[1280px] mx-auto px-8 text-center text-slate-400 text-sm">
          <p>© 2024 Nexus Talent Executive Suite. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
