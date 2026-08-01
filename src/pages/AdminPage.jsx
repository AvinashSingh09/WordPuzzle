import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Clock, 
  Search, 
  Download, 
  Trash2, 
  RefreshCw, 
  ShieldCheck,
  ArrowUpDown,
  CheckCircle2,
  Award
} from 'lucide-react';
import { fetchLeaderboard, deleteResult, clearAllResults } from '../utils/api';

export default function AdminPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'latest' | 'name'

  const loadData = () => {
    setLoading(true);
    fetchLeaderboard().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setResults(res.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete record for participant "${name}"?`)) {
      await deleteResult(id);
      loadData();
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('WARNING: Delete ALL participant records permanently?')) {
      await clearAllResults();
      loadData();
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = ['Rank', 'Player Name', 'Time (Seconds)', 'Formatted Time', 'Words Found', 'Category', 'Date'];
    const rows = filteredResults.map((item, idx) => [
      idx + 1,
      `"${item.playerName}"`,
      item.timeTaken,
      `"${formatTime(item.timeTaken)}"`,
      item.totalWords || 8,
      `"${item.category || 'construction'}"`,
      `"${new Date(item.createdAt).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WordSearch_Participants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredResults = results
    .filter(r => r.playerName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'time') return a.timeTaken - b.timeTaken;
      if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'name') return a.playerName.localeCompare(b.playerName);
      return 0;
    });

  const totalParticipants = results.length;
  const bestTimeSecs = results.length > 0 ? Math.min(...results.map(r => r.timeTaken)) : 0;
  const avgTimeSecs = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.timeTaken, 0) / results.length) : 0;

  return (
    <div className="min-h-screen blueprint-bg text-slate-100 p-4 md:p-8 flex items-center justify-center select-none">
      
      {/* Single Unified Glassmorphism Card */}
      <div className="w-full max-w-6xl bg-slate-900/90 backdrop-blur-2xl border border-sky-400/30 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
        
        {/* Top Header & Actions Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-sky-500/20 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-gradient-to-tr from-cyan-500 to-sky-400 rounded-2xl text-slate-950 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                ADMIN DASHBOARD
              </h1>
              <p className="text-xs md:text-sm text-sky-200/70 font-medium">
                Participant score records & performance analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-sky-400/30 text-cyan-300 transition active:scale-95 cursor-pointer shadow-md"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => navigate('/start')}
              className="flex items-center gap-2 bg-[#3b71f3] hover:bg-[#2a62e5] text-white font-bold text-sm px-4 py-2.5 rounded-xl border border-white/40 shadow-xl transition active:scale-95 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-white drop-shadow-sm"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span>Back to Game</span>
            </button>
          </div>
        </div>

        {/* Inline Compact Stats Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between bg-slate-950/60 border border-sky-400/20 rounded-2xl px-5 py-3.5">
            <div className="flex items-center gap-2.5 text-xs text-sky-300 font-bold uppercase tracking-wider">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Participants</span>
            </div>
            <span className="text-xl font-black font-mono text-white">{totalParticipants}</span>
          </div>

          <div className="flex items-center justify-between bg-slate-950/60 border border-amber-400/20 rounded-2xl px-5 py-3.5">
            <div className="flex items-center gap-2.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Best Record</span>
            </div>
            <span className="text-xl font-black font-mono text-amber-300">
              {bestTimeSecs ? formatTime(bestTimeSecs) : '--:--'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950/60 border border-emerald-400/20 rounded-2xl px-5 py-3.5">
            <div className="flex items-center gap-2.5 text-xs text-emerald-300 font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Average Time</span>
            </div>
            <span className="text-xl font-black font-mono text-emerald-300">
              {avgTimeSecs ? formatTime(avgTimeSecs) : '--:--'}
            </span>
          </div>
        </div>

        {/* Toolbar: Search, Sort & Export Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search participant..."
              className="w-full bg-slate-950 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-sky-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-sky-400/30 rounded-xl px-3 py-2 text-xs text-sky-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer"
              >
                <option value="time" className="bg-slate-900">Fastest Time</option>
                <option value="latest" className="bg-slate-900">Latest Date</option>
                <option value="name" className="bg-slate-900">Name (A-Z)</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={results.length === 0}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={handleClearAll}
              disabled={results.length === 0}
              className="flex items-center gap-1.5 bg-rose-600/80 hover:bg-rose-600 disabled:opacity-40 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Clean Participants Table */}
        <div className="bg-slate-950/70 border border-sky-400/20 rounded-2xl overflow-hidden shadow-inner max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead className="sticky top-0 z-10 bg-slate-950 border-b border-sky-500/20 text-sky-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5 text-center w-20">Rank</th>
                <th className="py-3.5 px-5">Participant Name</th>
                <th className="py-3.5 px-5">Completion Time</th>
                <th className="py-3.5 px-5 text-center">Words Found</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                    {loading ? 'Loading records...' : 'No participant records found.'}
                  </td>
                </tr>
              ) : (
                filteredResults.map((item, idx) => {
                  const rank = idx + 1;
                  let rankBadge = (
                    <span className="font-mono font-bold text-sky-300">
                      #{rank}
                    </span>
                  );

                  if (sortBy === 'time') {
                    if (rank === 1) {
                      rankBadge = (
                        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-xs font-black">
                          <Award className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" /> #1
                        </span>
                      );
                    } else if (rank === 2) {
                      rankBadge = (
                        <span className="inline-flex items-center gap-1 bg-slate-300/20 text-slate-200 border border-slate-300/40 px-2.5 py-0.5 rounded-full text-xs font-black">
                          <Award className="w-3.5 h-3.5 text-slate-300 fill-slate-300/30" /> #2
                        </span>
                      );
                    } else if (rank === 3) {
                      rankBadge = (
                        <span className="inline-flex items-center gap-1 bg-amber-700/20 text-amber-200 border border-amber-600/40 px-2.5 py-0.5 rounded-full text-xs font-black">
                          <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30" /> #3
                        </span>
                      );
                    }
                  }

                  return (
                    <tr 
                      key={item._id || idx}
                      className="hover:bg-cyan-500/10 transition-colors"
                    >
                      <td className="py-3.5 px-5 text-center">
                        {rankBadge}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-white">
                        {item.playerName}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-cyan-300 font-bold">
                        {formatTime(item.timeTaken)}
                      </td>
                      <td className="py-3.5 px-5 text-center font-semibold text-emerald-400">
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          {item.totalWords || 8} / {item.totalWords || 8}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-sky-200/80 font-mono">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <button
                          onClick={() => handleDelete(item._id, item.playerName)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition active:scale-95 cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
