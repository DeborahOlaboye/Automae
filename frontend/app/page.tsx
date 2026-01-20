'use client';

import { ArrowRight, Bot, Building2, Coins, TrendingUp, Zap, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Automae
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#agents" className="text-gray-600 hover:text-gray-900 transition-colors">Agents</a>
              <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Built for Cronos x402 Paytech Hackathon</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI Agents That
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Manage Real-World Assets
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              The first autonomous RWA operations platform. Deploy AI agents that handle rent collection,
              expense management, dividends, and compliance—all via x402.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#demo" className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-600 transition-all duration-300">
                Watch Demo
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up delay-200">
            {[
              { label: 'RWA Market', value: '$16T' },
              { label: 'Autonomous', value: '100%' },
              { label: 'Agent Types', value: '6+' },
              { label: 'Blockchain', value: 'Cronos' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything Automated
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From rent collection to compliance reporting, Automae handles the entire RWA lifecycle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Coins className="w-6 h-6" />,
                title: 'Rent Collection',
                description: 'Automatic monthly rent collection with late fees and notifications via x402',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Dividend Distribution',
                description: 'Proportional profit distribution to all token holders automatically',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: 'Expense Manager',
                description: 'Bills, taxes, insurance—all paid automatically on schedule',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Compliance Agent',
                description: 'Monthly reports, tax filing, and regulatory compliance',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Maintenance',
                description: 'Scheduled maintenance and emergency response with escrow payments',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Multi-Asset',
                description: 'Real estate, equipment, invoices, supply chain—all supported',
                color: 'from-indigo-500 to-purple-500'
              },
            ].map((feature, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 card-hover">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple. Powerful. Autonomous.
            </h2>
            <p className="text-xl text-gray-600">Deploy in minutes, run forever</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Asset',
                description: 'Tokenize your real-world asset on Cronos. Define shares, treasury, and metadata.',
              },
              {
                step: '02',
                title: 'Deploy Agents',
                description: 'Select which AI agents you need. Configure schedules and rules. Deploy with one click.',
              },
              {
                step: '03',
                title: 'Sit Back',
                description: 'Agents handle everything autonomously. Rent, expenses, dividends, compliance—all automated.',
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-blue-100 mb-4">{step.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 text-blue-200">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Automate Your Assets?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the future of real-world asset management. Launch your first autonomous asset in minutes.
          </p>
          <Link href="/dashboard" className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300">
            <span>Launch Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Automae
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              Built for Cronos x402 Paytech Hackathon 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
