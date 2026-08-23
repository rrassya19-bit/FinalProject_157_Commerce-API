import React, { useState } from 'react';
import { Terminal, Send, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PlaygroundPage = () => {
  const { activeApiKey, token, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/api/v1/produk');
  const [apiKeyInput, setApiKeyInput] = useState(activeApiKey || '');
  const [jwtInput, setJwtInput] = useState(token || '');
  const [requestBody, setRequestBody] = useState('{\n  "kategori_id": 1,\n  "nama": "Produk Testing Playground",\n  "harga": 150000,\n  "stok": 10\n}');
  
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  const presets = [
    { name: 'GET List Produk', method: 'GET', endpoint: '/api/v1/produk?limit=5', body: '' },
    { name: 'GET List Kategori', method: 'GET', endpoint: '/api/v1/kategori', body: '' },
    { name: 'POST Tambah Produk', method: 'POST', endpoint: '/api/v1/produk', body: '{\n  "nama": "Keyboard Gaming RGB",\n  "harga": 450000,\n  "stok": 15,\n  "status": "active"\n}' },
    { name: 'GET List API Keys', method: 'GET', endpoint: '/api-keys', body: '' },
  ];

  const handleSend = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}${endpoint}`;

    setLoading(true);
    setResponseData(null);
    setResponseStatus(null);
    const startTime = performance.now();

    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (apiKeyInput) {
        headers['x-api-key'] = apiKeyInput;
      }
      if (jwtInput) {
        headers['Authorization'] = `Bearer ${jwtInput}`;
      }

      let dataToSend = null;
      if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody) {
        try {
          dataToSend = JSON.parse(requestBody);
        } catch (e) {
          toast.error('Format JSON body tidak valid!');
          setLoading(false);
          return;
        }
      }

      const res = await axios({
        method,
        url: fullUrl,
        headers,
        data: dataToSend,
      });

      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setResponseData(res.data);
    } catch (err) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(err.response?.status || 500);
      setResponseData(err.response?.data || { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold text-[#1A202C] dark:text-white tracking-tight flex items-center gap-3">
          <Terminal className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          {t('playground.title')}
        </h1>
        <p className="text-sm text-[#718096] dark:text-slate-400 mt-1">
          {t('playground.subtitle')}
        </p>
      </div>

      {/* Guest / No Key Warning Banner */}
      {!isAuthenticated && (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/30 text-slate-800 dark:text-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-[#1A202C] dark:text-white">
                {t('playground.publicPromptTitle')}
              </h2>
              <p className="text-xs text-[#4A5568] dark:text-slate-300">
                {t('playground.publicPromptDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/login">
              <Button variant="secondary" size="sm" icon={LogIn}>
                {t('playground.publicPromptLogin')}
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" icon={UserPlus}>
                {t('playground.publicPromptRegister')}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-[#718096] dark:text-slate-400 uppercase tracking-wider py-1">
          {t('playground.presets')}
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setMethod(p.method);
              setEndpoint(p.endpoint);
              if (p.body) setRequestBody(p.body);
            }}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-[#2D3748] dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/40 transition-colors cursor-pointer shadow-2xs"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Request Form */}
        <div className="lg:col-span-6 bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
          <h2 className="text-base font-bold text-[#1A202C] dark:text-white">{t('playground.reqConfig')}</h2>

          {/* Method & Endpoint Input */}
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 focus:outline-none focus:border-indigo-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/v1/produk"
              className="flex-1 bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-[#1A202C] dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Auth Header inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-400 mb-1">
                {t('playground.apiKeyLabel')}
              </label>
              <input
                type="text"
                placeholder="sk-comm_..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-[#1A202C] dark:text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-400 mb-1">
                {t('playground.jwtLabel')}
              </label>
              <input
                type="text"
                placeholder="JWT Token..."
                value={jwtInput}
                onChange={(e) => setJwtInput(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-[#1A202C] dark:text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Request Body JSON */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-400 mb-1">
                {t('playground.jsonBodyLabel')}
              </label>
              <textarea
                rows={6}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg p-3 text-xs font-mono text-indigo-900 dark:text-indigo-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <Button
            variant="primary"
            className="w-full"
            loading={loading}
            icon={Send}
            onClick={handleSend}
          >
            {t('playground.btnSend')}
          </Button>
        </div>

        {/* Right: Response Output */}
        <div className="lg:col-span-6 bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1A202C] dark:text-white">{t('playground.resViewer')}</h2>
            {responseStatus && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-500/30'
                  }`}
                >
                  Status: {responseStatus}
                </span>
                {responseTime && (
                  <span className="text-xs font-mono text-[#718096] dark:text-slate-500">{responseTime} ms</span>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-[#718096] dark:text-slate-500 gap-3">
              <svg className="animate-spin h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-xs font-mono">{t('playground.calling')}</span>
            </div>
          ) : responseData ? (
            <pre className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto max-h-[480px]">
              <code>{JSON.stringify(responseData, null, 2)}</code>
            </pre>
          ) : (
            <div className="h-64 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-[#718096] dark:text-slate-400 text-xs text-center p-6">
              <Terminal className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              {t('playground.hint')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
