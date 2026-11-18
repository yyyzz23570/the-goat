'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  Bell,
  ChevronDown,
  ChevronLeft,
  CircleAlert,
  Database,
  FlaskConical,
  GitCompareArrows,
  LayoutDashboard,
  MapPinned,
  MessageSquare,
  Play,
  RefreshCw,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { OpsChart } from '@/components/ops-chart';
import { nycPlaces } from '@/lib/nyc-places';

type SectionId =
  | 'overview'
  | 'places'
  | 'feedback'
  | 'evaluation'
  | 'versions'
  | 'taxonomy'
  | 'release'
  | 'data'
  | 'models'
  | 'settings'
  | 'audit';

type Feedback = {
  itineraryId: string;
  rating: 'helpful' | 'not_helpful';
  trustScore?: number;
  issueType?: string;
  note?: string;
  createdAt: string;
};

type CatalogCheck = {
  label: string;
  constraint: number;
  source: number;
  route: number;
  status: 'pass' | 'review';
};

const navigation: Array<{
  id: SectionId;
  label: string;
  breadcrumb: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'overview', label: 'Overview', breadcrumb: 'Operations dashboard', icon: LayoutDashboard },
  { id: 'places', label: 'Place review', breadcrumb: 'Published place queue', icon: MapPinned },
  { id: 'feedback', label: 'Visitor feedback', breadcrumb: 'Feedback queue', icon: MessageSquare },
  { id: 'evaluation', label: 'Catalog checks', breadcrumb: 'Local catalog verification', icon: FlaskConical },
  { id: 'versions', label: 'Versions', breadcrumb: 'Version comparison', icon: GitCompareArrows },
  { id: 'taxonomy', label: 'Issue taxonomy', breadcrumb: 'Issue signals', icon: Activity },
  { id: 'release', label: 'Release gate', breadcrumb: 'Release decision', icon: ShieldCheck },
  { id: 'data', label: 'Data catalog', breadcrumb: 'NYC catalog', icon: Database },
  { id: 'models', label: 'Models', breadcrumb: 'Model configuration', icon: Sparkles },
  { id: 'settings', label: 'Settings', breadcrumb: 'Console settings', icon: Settings },
  { id: 'audit', label: 'Audit log', breadcrumb: 'Audit records', icon: ScrollText },
];

const issueLabels: Record<string, string> = {
  data: 'Place data', fit: 'Preference fit', route: 'Route', transport: 'Transport',
  budget: 'Budget', walking: 'Walking', other: 'Other',
};

const average = (values: number[]) =>
  values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;

function runCatalogCheck(): CatalogCheck[] {
  return nycPlaces.map((place, index) => {
    const sourceComplete = Boolean(place.sourceName && place.sourceUrl && place.reviewedOn);
    const usable = place.published && sourceComplete && Number.isFinite(place.planningAllowanceUsd);
    return {
      label: `Record ${index + 1}`,
      constraint: usable ? 100 : 0,
      source: sourceComplete ? 100 : 0,
      route: usable ? 100 : 0,
      status: usable ? 'pass' : 'review',
    };
  });
}

export default function OperationsConsole() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [results, setResults] = useState<CatalogCheck[]>([]);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState('');
  const activeNavigation = navigation.find((item) => item.id === activeSection) ?? navigation[0];

  useEffect(() => {
    void fetch('/api/feedback')
      .then((response) => (response.ok ? response.json() : { feedback: [] }))
      .then((payload) => {
        const value = payload as { feedback?: Feedback[] };
        setFeedback(value.feedback ?? []);
      })
      .catch(() => setNotice('Visitor feedback could not be loaded in this preview.'));
  }, []);

  const metrics = useMemo(() => {
    const passed = results.filter((item) => item.status === 'pass').length;
    return {
      passed,
      total: results.length,
      constraint: average(results.map((item) => item.constraint)),
      source: average(results.map((item) => item.source)),
      route: average(results.map((item) => item.route)),
      trust: average(feedback.flatMap((item) => item.trustScore ? [item.trustScore] : [])),
    };
  }, [feedback, results]);

  const runCheck = () => {
    setRunning(true);
    window.setTimeout(() => {
      setResults(runCatalogCheck());
      setNotice('Local NYC catalog check completed. This is not a production release decision.');
      setRunning(false);
    }, 220);
  };

  return (
    <main className="min-h-screen bg-[#f4f6f5] text-[#16211d]">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[#e7ebe9] bg-white lg:flex">
          <div className="flex h-16 items-center gap-2.5 px-5">
            <div className="grid size-8 place-items-center rounded-lg bg-[#0b5d3b] text-sm font-bold text-white">W</div>
            <div>
              <p className="text-[15px] font-bold tracking-[-0.025em]">Wayly <span className="text-[#16a06a]">NYC Ops</span></p>
              <p className="text-[10px] text-[#8a978f]">Quality Console</p>
            </div>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Operations navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const selected = activeSection === item.id;
              return (
                <button
                  className={`flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-left text-[13px] font-medium transition-colors ${selected ? 'bg-[#e7f4ee] text-[#0b5d3b]' : 'text-[#5a6963] hover:bg-[#f4f6f5]'}`}
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setNotice(''); }}
                  type="button"
                >
                  <Icon className="size-[18px]" strokeWidth={1.8} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-[#e7ebe9] px-5 py-3 text-[11px] text-[#8a978f]">NYC catalog preview console</div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-[#e7ebe9] bg-white px-5 md:px-6">
            <div className="min-w-0">
              <p className="truncate text-[11px] text-[#8a978f]">Wayly NYC Ops <span className="px-1.5">/</span><span className="text-[#5a6963]">{activeNavigation.breadcrumb}</span></p>
              <h1 className="text-lg font-semibold tracking-[-0.025em]">{activeNavigation.label}</h1>
            </div>
            <div className="flex items-center gap-2.5 md:gap-3">
              <label className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-[#8a978f]" />
                <input aria-label="Search places" className="h-9 w-56 rounded-lg border border-[#e7ebe9] bg-[#f4f6f5] py-2 pl-8 pr-3 text-[13px] outline-none placeholder:text-[#8a978f] focus:border-[#16a06a]" placeholder="Search coming soon" />
              </label>
              <button aria-label="View notifications" className="relative grid size-9 place-items-center rounded-lg text-[#5a6963] hover:bg-[#f4f6f5]" onClick={() => setNotice('No new operations notifications.')} type="button">
                <Bell className="size-[18px]" strokeWidth={1.8} /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#d9534f]" />
              </button>
              <a href="/ops/login" className="flex h-9 items-center gap-2 rounded-lg px-1.5 text-[13px] font-medium text-[#16211d] hover:bg-[#f4f6f5]">
                <span className="grid size-7 place-items-center rounded-full bg-[#0b5d3b] text-[11px] font-semibold text-white">O</span>
                <span className="hidden lg:inline">Preview operator</span><ChevronDown className="size-4 text-[#8a978f]" />
              </a>
              <a aria-label="Return to visitor experience" className="hidden items-center gap-1 rounded-lg border border-[#e7ebe9] px-2.5 py-2 text-xs text-[#5a6963] hover:bg-[#f4f6f5] xl:inline-flex" href="/"><ChevronLeft className="size-3.5" /> Visitor app</a>
            </div>
          </header>

          <div className="mx-auto max-w-[1280px] px-5 py-6 md:px-6">
            {notice ? <output aria-live="polite" className="mb-4 flex items-center gap-2 rounded-lg border border-[#bce8d3] bg-[#edf9f3] px-3 py-2 text-xs text-[#0b5d3b]"><ShieldCheck className="size-4" />{notice}</output> : null}
            <OpsContent activeSection={activeSection} feedback={feedback} metrics={metrics} results={results} running={running} onNavigate={setActiveSection} onRun={runCheck} />
          </div>
        </div>
      </div>
    </main>
  );
}

function OpsContent({ activeSection, feedback, metrics, results, running, onNavigate, onRun }: {
  activeSection: SectionId;
  feedback: Feedback[];
  metrics: { passed: number; total: number; constraint: number | null; source: number | null; route: number | null; trust: number | null };
  results: CatalogCheck[];
  running: boolean;
  onNavigate: (section: SectionId) => void;
  onRun: () => void;
}) {
  if (activeSection === 'overview') return <Overview feedback={feedback} metrics={metrics} results={results} running={running} onNavigate={onNavigate} onRun={onRun} />;
  if (activeSection === 'places') return <PlacesPanel />;
  if (activeSection === 'feedback') return <FeedbackPanel feedback={feedback} />;
  if (activeSection === 'evaluation') return <EvaluationPanel metrics={metrics} results={results} running={running} onRun={onRun} />;
  if (activeSection === 'release') return <ReleasePanel metrics={metrics} />;
  if (activeSection === 'data') return <DataPanel />;
  if (activeSection === 'taxonomy') return <TaxonomyPanel feedback={feedback} results={results} />;
  const copy: Record<'versions' | 'models' | 'settings' | 'audit', { title: string; detail: string }> = {
    versions: { title: 'Version management', detail: 'This preview records the current NYC catalog version in the repository. It does not create or fabricate version history.' },
    models: { title: 'Model configuration', detail: 'The NYC MVP currently uses a deterministic, source-linked planner. No model endpoint, cost, or latency record is configured here.' },
    settings: { title: 'Console settings', detail: 'This preview has no persistent operations settings or account service.' },
    audit: { title: 'Audit log', detail: 'A production audit log requires server-side identity, timestamps, and immutable records. This preview does not claim to provide them.' },
  };
  return <PlaceholderPanel {...copy[activeSection]} />;
}

function Overview({ feedback, metrics, results, running, onNavigate, onRun }: {
  feedback: Feedback[];
  metrics: { passed: number; total: number; constraint: number | null; source: number | null; route: number | null; trust: number | null };
  results: CatalogCheck[];
  running: boolean;
  onNavigate: (section: SectionId) => void;
  onRun: () => void;
}) {
  const activity = [
    results.length ? { color: 'bg-[#16a06a]', text: `${results.length} NYC catalog records checked in this session`, time: 'Current session' } : { color: 'bg-[#8a978f]', text: 'Waiting for a local catalog check', time: 'Current session' },
    { color: 'bg-[#3a7bd5]', text: `${nycPlaces.length} published New York City places in the catalog`, time: 'Repository data' },
    feedback[0] ? { color: 'bg-[#d98a1f]', text: `Received ${feedback[0].rating === 'helpful' ? 'helpful' : 'review-needed'} visitor feedback`, time: formatTime(feedback[0].createdAt) } : { color: 'bg-[#8a978f]', text: 'No visitor feedback has been submitted', time: 'Feedback queue' },
    { color: 'bg-[#d9534f]', text: 'Production release evidence is still incomplete', time: 'Scope boundary' },
  ];
  return <>
    <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <MetricCard detail="Published, source-linked NYC records" label="Catalog version" value="nyc-poi-v1" />
      <MetricCard detail={metrics.constraint === null ? 'Run a local catalog check to calculate' : `${metrics.passed}/${metrics.total} records passed`} label="Catalog validity" trend={metrics.constraint === null ? undefined : 'Current check'} value={metrics.constraint === null ? '—' : `${metrics.constraint}%`} />
      <MetricCard detail={metrics.source === null ? 'Run a local catalog check to calculate' : 'Source name, link, and review date coverage'} label="Source coverage" trend={metrics.source === null ? undefined : 'Current check'} value={metrics.source === null ? '—' : `${metrics.source}%`} />
      <MetricCard detail="Unavailable in this static preview" label="Live data status" value="Not connected" />
      <MetricCard detail={metrics.trust === null ? 'Waiting for submitted feedback' : 'Submitted visitor trust scores'} label="Visitor trust" value={metrics.trust === null ? '—' : `${metrics.trust} / 5`} />
      <MetricCard detail="Local verification, not a release baseline" label="Current checks" value={results.length ? String(results.length) : '—'} />
    </section>
    <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel className="xl:row-span-2"><PanelHeading title="Catalog quality trend" description="A local completeness check across the published NYC catalog. It does not represent live availability or model quality." /><OpsChart data={results.slice(0, 8)} /><p className="mt-3 text-xs leading-5 text-[#8a978f]">A production gate still needs frozen evaluation cases, reproducible runtime evidence, and human approval.</p></Panel>
      <Panel><PanelHeading title="Open queues" /><div className="mt-4 space-y-2.5"><QueueItem count={String(Math.max(0, nycPlaces.length - metrics.passed))} label="Catalog records to verify" tone="amber" onClick={() => onNavigate('evaluation')} /><QueueItem count={String(feedback.filter((item) => item.rating === 'not_helpful').length)} label="Feedback needing review" tone="blue" onClick={() => onNavigate('feedback')} /><QueueItem count="1" label="Release gate follow-up" tone="green" onClick={() => onNavigate('release')} /></div></Panel>
      <Panel><PanelHeading title="Recent activity" /><div className="mt-4 space-y-3.5">{activity.map((item) => <div className="flex gap-2.5" key={item.text}><span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.color}`} /><div><p className="text-[13px] leading-5 text-[#16211d]">{item.text}</p><p className="text-[11px] text-[#8a978f]">{item.time}</p></div></div>)}</div></Panel>
    </section>
    <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel><PanelHeading title="Current catalog check" description="Only source linkage and local record completeness are calculated here." /><CheckTable results={results.slice(0, 6)} /></Panel>
      <Panel><PanelHeading title="Quick actions" /><div className="mt-4 space-y-2"><ActionButton label={running ? 'Running catalog check…' : 'Run catalog check'} primary disabled={running} icon={running ? RefreshCw : Play} onClick={onRun} /><ActionButton label="Review places" icon={MapPinned} onClick={() => onNavigate('places')} /><ActionButton label="Review feedback" icon={MessageSquare} onClick={() => onNavigate('feedback')} /><ActionButton label="Open release gate" icon={ShieldCheck} onClick={() => onNavigate('release')} /></div></Panel>
    </section>
  </>;
}

function PlacesPanel() {
  return <><section className="grid gap-4 md:grid-cols-3"><MetricCard detail="The only places available to the current planner" label="Published places" value={String(nycPlaces.filter((place) => place.published).length)} /><MetricCard detail="Every record includes a source link and review date" label="Source evidence" value="Covered" /><MetricCard detail="No write API is enabled in this preview" label="Review actions" value="Read-only" /></section><Panel className="mt-4"><PanelHeading title="Published NYC place queue" description="These records are read from nyc-poi-v1. The console does not claim that live hours, fares, or inventory are current." /><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[13px]"><thead className="border-y border-[#eef2f0] text-[11px] text-[#8a978f]"><tr><th className="px-3 py-2.5 font-medium">Place</th><th className="px-3 py-2.5 font-medium">Category</th><th className="px-3 py-2.5 font-medium">Source</th><th className="px-3 py-2.5 font-medium">Reviewed</th><th className="px-3 py-2.5 font-medium">Allowance</th><th className="px-3 py-2.5 font-medium">Status</th></tr></thead><tbody>{nycPlaces.map((place) => <tr className="border-b border-[#eef2f0]" key={place.id}><td className="px-3 py-3 font-medium">{place.name}</td><td className="px-3 py-3 text-[#5a6963]">{place.interests[0]}</td><td className="max-w-48 truncate px-3 py-3 text-[#5a6963]" title={place.sourceName}>{place.sourceName}</td><td className="px-3 py-3 text-[#5a6963]">{place.reviewedOn}</td><td className="px-3 py-3 text-[#5a6963]">${place.planningAllowanceUsd}</td><td className="px-3 py-3"><StatusBadge status="published">Published</StatusBadge></td></tr>)}</tbody></table></div></Panel></>;
}

function FeedbackPanel({ feedback }: { feedback: Feedback[] }) {
  const trust = average(feedback.flatMap((item) => item.trustScore ? [item.trustScore] : []));
  return <><section className="grid gap-4 md:grid-cols-3"><MetricCard detail="Submitted through the visitor feedback form" label="Feedback items" value={String(feedback.length)} /><MetricCard detail="Items marked not helpful" label="Needs review" value={String(feedback.filter((item) => item.rating === 'not_helpful').length)} /><MetricCard detail="Only submitted trust scores are included" label="Average trust" value={trust?.toString() ?? '—'} /></section><Panel className="mt-4"><PanelHeading title="Visitor feedback queue" description="Feedback is held only in preview memory; it is not represented as a persistent operations record." /><div className="mt-4 space-y-2.5">{feedback.length ? feedback.map((item, index) => <article className="rounded-lg border border-[#eef2f0] px-3.5 py-3" key={`${item.itineraryId}-${index}`}><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><StatusBadge status={item.rating === 'helpful' ? 'published' : 'review'}>{item.rating === 'helpful' ? 'Helpful' : 'Needs review'}</StatusBadge><span className="text-xs text-[#5a6963]">{item.issueType ? issueLabels[item.issueType] ?? item.issueType : 'Unclassified'}</span></div><span className="text-[11px] text-[#8a978f]">{formatTime(item.createdAt)}</span></div><p className="mt-2 text-[13px] leading-5 text-[#5a6963]">{item.note || 'The visitor did not leave a note.'}</p></article>) : <EmptyState title="No visitor feedback yet" detail="Submitted feedback will be visible for the current preview session." />}</div></Panel></>;
}

function EvaluationPanel({ metrics, results, running, onRun }: { metrics: { passed: number; total: number; source: number | null }; results: CatalogCheck[]; running: boolean; onRun: () => void }) {
  return <><section className="flex flex-col justify-between gap-4 rounded-xl border border-[#e7ebe9] bg-white p-5 shadow-[0_1px_1px_rgba(16,33,29,0.04)] md:flex-row md:items-center"><div><p className="text-[15px] font-semibold">Local NYC catalog check</p><p className="mt-1 text-[13px] text-[#5a6963]">Checks published status, USD allowance, and source linkage. It does not make claims about live availability, transit, or production behavior.</p></div><button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#16a06a] px-3.5 text-[13px] font-medium text-white shadow-[0_1px_1px_rgba(11,93,59,0.25)] disabled:opacity-60" disabled={running} onClick={onRun} type="button">{running ? <RefreshCw className="size-4 animate-spin" /> : <Play className="size-4" />}{running ? 'Running…' : 'Run catalog check'}</button></section><Panel className="mt-4"><PanelHeading title="Current check results" description={results.length ? `${metrics.passed}/${metrics.total} records passed; source coverage is ${metrics.source}%.` : 'No check has been run in this browser session.'} /><CheckTable results={results} /></Panel></>;
}

function ReleasePanel({ metrics }: { metrics: { passed: number; total: number; source: number | null } }) {
  const catalogPass = metrics.total === nycPlaces.length && metrics.passed === nycPlaces.length;
  const gates: Array<[string, string, boolean]> = [['Published NYC records and source links', catalogPass ? 'Passed' : 'Pending', catalogPass], ['Local catalog completeness check', metrics.total ? 'Completed' : 'Pending', Boolean(metrics.total)], ['Frozen evaluation set and baseline', 'Blocked', false], ['Versioned runtime evidence and human sign-off', 'Blocked', false]];
  return <><section className="grid gap-4 md:grid-cols-3"><MetricCard detail="A preview check is not a production release" label="Release decision" value="Blocked" /><MetricCard detail="Records in the current local check" label="Catalog check" value={metrics.total ? `${metrics.passed}/${metrics.total}` : '—'} /><MetricCard detail="Current local source-link coverage" label="Source coverage" value={metrics.source === null ? '—' : `${metrics.source}%`} /></section><Panel className="mt-4"><PanelHeading title="Release gate" description="A release needs corroborating evidence, not just a green UI indicator." /><div className="mt-4 rounded-lg border border-[#f2c8c5] bg-[#fbeceb] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-[#a63e3a]"><CircleAlert className="size-4" />Not ready for a production release</div><p className="mt-2 text-[13px] leading-5 text-[#7d4b48]">The catalog is present, but a frozen evaluation set, reproducible deployed runtime, and accountable approval have not been provided.</p></div><div className="mt-4 divide-y divide-[#eef2f0]">{gates.map(([label, status, pass]) => <div className="flex items-center justify-between gap-4 py-3" key={label}><span className="text-[13px] text-[#5a6963]">{label}</span><StatusBadge status={pass ? 'published' : status === 'Blocked' ? 'blocked' : 'review'}>{status}</StatusBadge></div>)}</div></Panel></>;
}

function DataPanel() {
  return <><section className="grid gap-4 md:grid-cols-3"><MetricCard detail="The current planner's published candidate set" label="Data version" value="nyc-poi-v1" /><MetricCard detail="Published records ready for local planning" label="Published places" value={String(nycPlaces.filter((place) => place.published).length)} /><MetricCard detail="The app displays estimates only in USD" label="Currency" value="USD" /></section><Panel className="mt-4"><PanelHeading title="NYC data boundary" description="Import, write approval, and rollback operations are not connected in this preview." /><div className="mt-4 grid gap-3 md:grid-cols-3"><InfoBlock label="City scope" value="New York City" /><InfoBlock label="Place status" value="Published" /><InfoBlock label="Traceable fields" value="Source, link, review date" /></div></Panel></>;
}

function TaxonomyPanel({ feedback, results }: { feedback: Feedback[]; results: CatalogCheck[] }) {
  const signals = feedback.reduce<Record<string, number>>((counts, item) => { const label = item.issueType ? issueLabels[item.issueType] ?? item.issueType : 'Unclassified'; counts[label] = (counts[label] ?? 0) + 1; return counts; }, {});
  return <><section className="grid gap-4 md:grid-cols-3"><MetricCard detail="Catalog records flagged for review" label="Check exceptions" value={String(results.filter((item) => item.status === 'review').length)} /><MetricCard detail="Explicit categories in visitor feedback" label="Feedback types" value={String(Object.keys(signals).length)} /><MetricCard detail="No persisted root-cause workflow is connected" label="Issue attribution" value="Preview only" /></section><Panel className="mt-4"><PanelHeading title="Issue signals" description="This page groups feedback labels and local checks. It does not manufacture incident or model-failure records." /><div className="mt-4 grid gap-3 md:grid-cols-2"><InfoBlock label="Feedback signals" value={Object.entries(signals).length ? Object.entries(signals).map(([label, count]) => `${label}: ${count}`).join(' · ') : 'No categorized feedback'} /><InfoBlock label="Catalog review" value={results.length ? `${results.filter((item) => item.status === 'review').length} record(s) need review` : 'No local check run'} /></div></Panel></>;
}

function PlaceholderPanel({ title, detail }: { title: string; detail: string }) { return <Panel><PanelHeading title={title} /><EmptyState title="Console structure retained" detail={detail} /></Panel>; }
function MetricCard({ detail, label, trend, value }: { detail: string; label: string; trend?: string; value: string }) { return <article className="min-w-0 rounded-xl border border-[#e7ebe9] bg-white p-5 shadow-[0_1px_1px_rgba(16,33,29,0.04)]"><p className="text-xs text-[#5a6963]">{label}</p><p className="mt-2 truncate text-[27px] font-semibold tracking-[-0.04em] text-[#16211d]" title={value}>{value}</p><p className={`mt-2 text-[11px] ${trend ? 'text-[#16a06a]' : 'text-[#8a978f]'}`}>{trend ? <span className="mr-1 font-medium">↑</span> : null}{detail}</p></article>; }
function Panel({ children, className = '' }: { children: ReactNode; className?: string }) { return <section className={`rounded-xl border border-[#e7ebe9] bg-white p-5 shadow-[0_1px_1px_rgba(16,33,29,0.04)] ${className}`}>{children}</section>; }
function PanelHeading({ title, description }: { title: string; description?: string }) { return <div><h2 className="text-[15px] font-semibold tracking-[-0.015em]">{title}</h2>{description ? <p className="mt-1 text-xs text-[#8a978f]">{description}</p> : null}</div>; }
function StatusBadge({ children, status }: { children: ReactNode; status: 'published' | 'review' | 'blocked' }) { const styles = { published: 'bg-[#e7f4ee] text-[#0b5d3b]', review: 'bg-[#fff4df] text-[#b26c14]', blocked: 'bg-[#fbeceb] text-[#b3423e]' }; return <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}>{children}</span>; }
function InfoBlock({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-[#eef2f0] p-4"><p className="text-[11px] text-[#8a978f]">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>; }
function EmptyState({ title, detail }: { title: string; detail: string }) { return <div className="mt-4 grid min-h-56 place-items-center rounded-lg border border-dashed border-[#e7ebe9] bg-[#fafcfb] px-5 text-center"><div><p className="text-sm font-medium text-[#5a6963]">{title}</p><p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#8a978f]">{detail}</p></div></div>; }
function QueueItem({ count, label, tone, onClick }: { count: string; label: string; tone: 'amber' | 'blue' | 'green'; onClick: () => void }) { const styles = { amber: 'bg-[#fff4df] text-[#b26c14]', blue: 'bg-[#eaf2fd] text-[#3a7bd5]', green: 'bg-[#e7f4ee] text-[#0b5d3b]' }; return <button className="flex w-full items-center justify-between rounded-lg border border-[#eef2f0] px-3 py-2.5 text-left hover:bg-[#fafcfb]" onClick={onClick} type="button"><span className="text-[13px] text-[#5a6963]">{label}</span><span className={`rounded-md px-2 py-0.5 text-xs font-medium ${styles[tone]}`}>{count}</span></button>; }
function ActionButton({ label, primary = false, disabled = false, icon: Icon, onClick }: { label: string; primary?: boolean; disabled?: boolean; icon: typeof Play; onClick: () => void }) { return <button className={`flex h-9 w-full items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition-colors disabled:opacity-60 ${primary ? 'bg-[#16a06a] text-white shadow-[0_1px_1px_rgba(11,93,59,0.25)] hover:bg-[#0b5d3b]' : 'border border-[#e7ebe9] bg-white text-[#16211d] hover:bg-[#f4f6f5]'}`} disabled={disabled} onClick={onClick} type="button"><Icon className={`size-4 ${label.startsWith('Running') ? 'animate-spin' : ''}`} />{label}</button>; }
function CheckTable({ results }: { results: CatalogCheck[] }) { if (!results.length) return <EmptyState title="No catalog check results" detail="Run the local catalog check to show record-level source and completeness results." />; return <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-[13px]"><thead className="border-y border-[#eef2f0] text-[11px] text-[#8a978f]"><tr><th className="px-3 py-2.5 font-medium">Record</th><th className="px-3 py-2.5 font-medium">Validity</th><th className="px-3 py-2.5 font-medium">Source</th><th className="px-3 py-2.5 font-medium">Planner input</th><th className="px-3 py-2.5 font-medium">Result</th></tr></thead><tbody>{results.map((item) => <tr className="border-b border-[#eef2f0]" key={item.label}><td className="px-3 py-3 font-medium">{item.label}</td><td className="px-3 py-3 text-[#5a6963]">{item.constraint}%</td><td className="px-3 py-3 text-[#5a6963]">{item.source}%</td><td className="px-3 py-3 text-[#5a6963]">{item.route}%</td><td className="px-3 py-3"><StatusBadge status={item.status === 'pass' ? 'published' : 'review'}>{item.status === 'pass' ? 'Passed' : 'Review'}</StatusBadge></td></tr>)}</tbody></table></div>; }
function formatTime(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Unknown time' : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date); }
