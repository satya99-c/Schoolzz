import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Application Notice</h2>
              <p className="text-xs text-slate-300">
                Schoolzz encountered a transient render state issue. Resetting application memory will restore full functionality.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left font-mono text-[11px] text-red-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#1b4d3e] hover:bg-[#143c30] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer border border-emerald-500/40"
            >
              <RefreshCw className="w-4 h-4 text-emerald-300" />
              <span>Reset & Reload Schoolzz Portal</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
