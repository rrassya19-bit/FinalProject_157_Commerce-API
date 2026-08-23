import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  KeyRound,
  Package,
  Shield,
  ArrowRight,
  Code2,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Lock,
  Server,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import IconContainer from '../components/ui/IconContainer';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('get');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success(t('docs.toastCopied'));
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const tabsContent = {
    get: {
      title: 'GET /api/v1/produk',
      method: 'GET',
      badge: '200 OK',
      code: `curl -X GET "https://api.commerceapi.dev/api/v1/produk?status=active&limit=5" \\
  -H "x-api-key: sk-comm_live_9f81a7b3c4e5d6a7"`,
      response: `{
  "success": true,
  "message": "Berhasil mengambil daftar produk",
  "data": {
    "total": 50,
    "page": 1,
    "totalPages": 5,
    "produk": [
      {
        "id": 1,
        "nama": "Smartphone Galaxy X",
        "harga": "7500000.00",
        "stok": 25,
        "sku": "ELK-001",
        "status": "active",
        "kategori": { "nama": "Elektronik" }
      }
    ]
  }
}`
    },
    post: {
      title: 'POST /api/v1/produk',
      method: 'POST',
      badge: '201 Created',
      code: `curl -X POST "https://api.commerceapi.dev/api/v1/produk" \\
  -H "x-api-key: sk-comm_live_9f81a7b3c4e5d6a7" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nama": "Wireless Noise Cancelling Headphone",
    "kategori_id": 1,
    "harga": 899000,
    "stok": 30,
    "sku": "ELK-109",
    "status": "active"
  }'`,
      response: `{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": {
    "id": 51,
    "nama": "Wireless Noise Cancelling Headphone",
    "harga": 899000,
    "stok": 30,
    "sku": "ELK-109",
    "status": "active"
  }
}`
    },
    auth: {
      title: 'x-api-key Verification',
      method: 'HEADER',
      badge: 'Zero-Leak Security',
      code: `// Authorization Architecture
// 1. JWT (Bearer) -> Digunakan untuk login dan kelola API Keys
Authorization: Bearer eyJhbGciOiJIUzI1Ni...

// 2. x-api-key -> Digunakan untuk akses konsumsi data katalog
x-api-key: sk-comm_live_9f81a7b3c4e5d6a7...`,
      response: `{
  "auth_type": "x-api-key",
  "status": "authorized",
  "scope": ["produk:read", "produk:write", "kategori:all"],
  "rate_limit": "unmetered_sandbox"
}`
    },
    response: {
      title: 'Realtime JSON Output',
      method: 'STATUS',
      badge: '24ms Latency',
      code: `// Express.js + Sequelize query speed benchmark
[INFO] GET /api/v1/produk 200 - 24.312 ms
Database Connection: PostgreSQL (Pooled)
Cache-Control: public, max-age=60`,
      response: `{
  "meta": {
    "server": "Express/PostgreSQL",
    "version": "1.0.0",
    "latency": "24ms",
    "timestamp": "${new Date().toISOString()}"
  }
}`
    }
  };

  const currentSnippet = tabsContent[activeTab];

  // Staggered entrance variants harmonized with the IntroSplash (~1.15s total splash + fadeout)
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 1.05, // Starts seamlessly right as splash screen completes fade-out
        staggerChildren: 0.16,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Heading word-by-word staggered container for Entrance only
  const headingContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.04,
      },
    },
  };

  // Word-level clean reveal animation (Static definition, no conflict with loop)
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Split title parts into word arrays
  const line1Words = (t('hero.titleLine1') || '').split(' ').filter(Boolean);
  const line2Words = (t('hero.titleLine2') || '').split(' ').filter(Boolean);
  const highlightWords = (t('hero.titleHighlight') || '').split(' ').filter(Boolean);

  return (
    <div className="space-y-24 md:space-y-32 py-10 md:py-16 overflow-hidden">
      {/* 1. HERO SECTION (Center-aligned Layout) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 max-w-4xl mx-auto text-center"
        >
          {/* 1. Section Badge */}
          <motion.div variants={badgeVariants} className="flex justify-center">
            <Badge variant="section" tone="primary" icon={Zap}>
              {t('hero.badge')}
            </Badge>
          </motion.div>

          {/* 2. Heading: Outer Floating Container + Inner Staggered Word Reveal */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: 1.5, // Starts seamlessly once entrance reveal sequence completes
            }}
            className="will-change-transform"
          >
            <motion.h1
              variants={headingContainerVariants}
              className="text-4xl sm:text-6xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-[1.15] select-none"
            >
              <span className="inline-block">
                {line1Words.map((word, idx) => (
                  <motion.span
                    key={`l1-${idx}-${word}`}
                    variants={wordVariants}
                    className="inline-block mr-[0.25em] last:mr-0"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <br className="hidden sm:inline" />{" "}
              <span className="inline-block">
                {line2Words.map((word, idx) => (
                  <motion.span
                    key={`l2-${idx}-${word}`}
                    variants={wordVariants}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
                <span className="text-indigo-600 dark:text-indigo-400 inline-block">
                  {highlightWords.map((word, idx) => (
                    <motion.span
                      key={`hl-${idx}-${word}`}
                      variants={wordVariants}
                      className="inline-block mr-[0.25em] last:mr-0"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </span>
            </motion.h1>
          </motion.div>

          {/* 3. Subtitle Description */}
          <motion.p
            variants={subtitleVariants}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* 4. Action Buttons (CTA) */}
          <motion.div
            variants={ctaVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" icon={ArrowRight} className="w-full sm:w-auto">
                {t('hero.ctaPrimary')}
              </Button>
            </Link>
            <Link to="/docs" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" icon={Code2} className="w-full sm:w-auto">
                {t('hero.ctaSecondary')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Interactive Live Sandbox Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-4xl lg:max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden"
        >
          {/* Console Header / Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-950/90 px-4 py-2.5 gap-3">
            {/* Window control dots */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                CommerceAPI Live Sandbox
              </span>
            </div>

            {/* Interactive Tab Selectors */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { key: 'get', label: t('hero.tab1') },
                { key: 'post', label: t('hero.tab2') },
                { key: 'auth', label: t('hero.tab3') },
                { key: 'response', label: t('hero.tab4') },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Badge */}
            <div className="hidden lg:flex items-center gap-2">
              <Badge variant="status" tone="success" size="sm">
                {currentSnippet.badge}
              </Badge>
            </div>
          </div>

          {/* Console Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800 bg-[#FAFAFA] dark:bg-[#0A0E17]">
            {/* Request Pane */}
            <div className="p-5 font-mono text-xs space-y-3 relative group">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span className="font-semibold tracking-wider">REQUEST COMMAND</span>
                <button
                  onClick={() => handleCopyCode(currentSnippet.code)}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? t('docs.copied') : t('docs.copy')}</span>
                </button>
              </div>
              <pre className="text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto selection:bg-indigo-500 selection:text-white">
                <code>{currentSnippet.code}</code>
              </pre>
            </div>

            {/* Response Pane */}
            <div className="p-5 font-mono text-xs space-y-3 bg-[#F1F5F9]/60 dark:bg-[#080B12]">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span className="font-semibold tracking-wider">EXAMPLE SERVER RESPONSE</span>
                <Badge variant="status" tone="success" size="sm">
                  {t('hero.status')}
                </Badge>
              </div>
              <pre className="text-emerald-700 dark:text-emerald-300 leading-relaxed overflow-x-auto">
                <code>{currentSnippet.response}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. SECTION CARA KERJA (2-KOLOM LAYOUT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Kolom Kiri */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-3">
              <Badge variant="section" tone="primary">
                {t('workflow.badge')}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                {t('workflow.title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('workflow.subtitle')}
              </p>
            </div>

            {/* Steps Timeline with Unified IconContainer Shape & Size */}
            <div className="space-y-6">
              {[
                {
                  num: '01',
                  title: t('workflow.step1Title'),
                  desc: t('workflow.step1Desc'),
                  icon: Shield,
                },
                {
                  num: '02',
                  title: t('workflow.step2Title'),
                  desc: t('workflow.step2Desc'),
                  icon: KeyRound,
                },
                {
                  num: '03',
                  title: t('workflow.step3Title'),
                  desc: t('workflow.step3Desc'),
                  icon: Terminal,
                },
              ].map((step, idx) => {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4 group"
                  >
                    <IconContainer size="md" className="group-hover:scale-105">
                      {step.num}
                    </IconContainer>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Kolom Kanan: Card Hak Akses */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <Card variant="default" className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {t('workflow.visualTitle')}
                </span>
                <Badge variant="status" tone="success" size="sm">
                  Secured
                </Badge>
              </div>

              {/* JWT Layer Box (Subtle Card) */}
              <Card variant="subtle" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    Administrative Scope
                  </span>
                  <Badge variant="status" tone="auth" size="sm">
                    {t('workflow.visualJwtBadge')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Login & Registrasi <span className="text-indigo-600 dark:text-indigo-400 font-semibold">→</span> Token JWT <span className="text-indigo-600 dark:text-indigo-400 font-semibold">→</span> Kelola API Key
                </p>
              </Card>

              {/* API Key Layer Box (Subtle Card) */}
              <Card variant="subtle" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    Data Consumption Scope
                  </span>
                  <Badge variant="status" tone="success" size="sm">
                    {t('workflow.visualApiKeyBadge')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Header x-api-key <span className="text-indigo-600 dark:text-indigo-400 font-semibold">→</span> CRUD Produk <span className="text-indigo-600 dark:text-indigo-400 font-semibold">→</span> CRUD Kategori
                </p>
              </Card>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                {t('workflow.visualDesc')}
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 3. SECTION FITUR UTAMA (ZIGZAG LAYOUT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <Badge variant="section" tone="primary">
            {t('features.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Fitur 1 */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 space-y-4">
            <IconContainer icon={KeyRound} size="md" />
            <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
              {t('features.feat1Title')}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('features.feat1Desc')}
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('features.feat1Point1')}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('features.feat1Point2')}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <Card variant="default">
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">API Key Label: Production Mobile</span>
                  <Badge variant="status" tone="success" size="sm">
                    Active
                  </Badge>
                </div>
                <Card variant="subtle" className="p-3 text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                  <span>sk-comm_live_4b8f••••••••••••e93c</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Created 2d ago</span>
                </Card>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Fitur 2 */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Card variant="default">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-slate-300">
                  <span>Item</span>
                  <span>Category</span>
                  <span>Price</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="font-semibold text-[#0F172A] dark:text-white">Mechanical Keyboard</span>
                  <span className="text-slate-600 dark:text-slate-400">Elektronik</span>
                  <span className="font-mono text-slate-800 dark:text-slate-300">Rp 650.000</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold text-[#0F172A] dark:text-white">Kemeja Katun Formal</span>
                  <span className="text-slate-600 dark:text-slate-400">Pakaian Pria</span>
                  <span className="font-mono text-slate-800 dark:text-slate-300">Rp 185.000</span>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <IconContainer icon={Package} size="md" />
            <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
              {t('features.feat2Title')}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('features.feat2Desc')}
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('features.feat2Point1')}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('features.feat2Point2')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fitur 3 */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 space-y-4">
            <IconContainer icon={Terminal} size="md" />
            <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
              {t('features.feat3Title')}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('features.feat3Desc')}
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('features.feat3Point1')}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('features.feat3Point2')}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <Card variant="default">
              <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-xs space-y-2">
                <div className="text-indigo-600 dark:text-indigo-400 font-semibold"># Interactive Playground Ready</div>
                <div className="text-slate-600 dark:text-slate-400">&gt; POST /api-keys HTTP/1.1</div>
                <div className="text-slate-600 dark:text-slate-400">&gt; Authorization: Bearer eyJhbG...</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold pt-1">&lt; HTTP/1.1 201 Created</div>
                <div className="text-slate-500 dark:text-slate-400">&lt; content-type: application/json</div>
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/80 dark:from-indigo-950/60 dark:via-[#111622] dark:to-indigo-950/60 border border-indigo-200/80 dark:border-indigo-500/30 rounded-2xl md:rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm dark:shadow-xl"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white">
            {t('cta.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                {t('cta.button')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;

