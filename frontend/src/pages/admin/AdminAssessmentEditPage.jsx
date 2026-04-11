import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';

function headers() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const PILLARS = ['IDENTITY', 'PURPOSE', 'MINDSET', 'HABITS', 'ENVIRONMENT', 'EXECUTION'];
const Q_TYPES = ['STANDARD', 'PENALTY'];

export default function AdminAssessmentEditPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [savingMeta, setSavingMeta] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [qDraft, setQDraft] = useState(null);
  const [savingQ, setSavingQ] = useState(false);

  const load = () => {
    setError(null);
    axios
      .get(`${API_BASE}/admin/assessments/${assessmentId}`, { headers: headers() })
      .then((res) => {
        const a = res.data;
        setAssessment(a);
        setTitle(a.title);
        setDescription(a.description ?? '');
        setIsActive(a.isActive);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else if (err.response?.status === 403) setError('Admin access required.');
        else if (err.response?.status === 404) setError('Assessment not found.');
        else setError(err.response?.data?.message || 'Failed to load');
      });
  };

  useEffect(() => {
    load();
  }, [assessmentId, navigate]);

  const saveMeta = async () => {
    setSavingMeta(true);
    setError(null);
    try {
      const res = await axios.patch(
        `${API_BASE}/admin/assessments/${assessmentId}`,
        { title, description: description || null, isActive },
        { headers: headers() }
      );
      setAssessment(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSavingMeta(false);
    }
  };

  const startEditQuestion = (q) => {
    setEditingId(q.id);
    setQDraft({
      text: q.text,
      order: q.order,
      scaleMin: q.scaleMin,
      scaleMax: q.scaleMax,
      pillar: q.pillar,
      questionType: q.questionType,
    });
  };

  const saveQuestion = async () => {
    if (!editingId || !qDraft) return;
    setSavingQ(true);
    setError(null);
    try {
      const res = await axios.patch(`${API_BASE}/admin/questions/${editingId}`, qDraft, { headers: headers() });
      setAssessment((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions.map((x) => (x.id === res.data.id ? res.data : x)).sort((a, b) => a.order - b.order),
            }
          : prev
      );
      setEditingId(null);
      setQDraft(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Question save failed');
    } finally {
      setSavingQ(false);
    }
  };

  if (error && !assessment) {
    return (
      <div>
        <Link to="/admin/assessments" className="text-sm text-alignment-primary hover:underline">
          ← Assessments
        </Link>
        <div className="mt-6 rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      </div>
    );
  }

  if (!assessment) {
    return <p className="text-alignment-accent/70">Loading…</p>;
  }

  return (
    <div>
      <Link to="/admin/assessments" className="text-sm text-alignment-primary hover:underline">
        ← All assessments
      </Link>

      <h2 className="mt-6 text-lg font-semibold text-alignment-accent">Edit assessment</h2>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/50 px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-alignment-accent/10 bg-alignment-surface p-5 space-y-4 max-w-2xl">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-alignment-accent/55">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-alignment-accent/15 bg-alignment-foundation px-3 py-2 text-sm text-alignment-accent"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-alignment-accent/55">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-alignment-accent/15 bg-alignment-foundation px-3 py-2 text-sm text-alignment-accent"
          />
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-alignment-accent/30 text-alignment-primary focus:ring-alignment-primary"
          />
          <span className="text-sm text-alignment-accent">Active (available for new sessions)</span>
        </label>
        <button
          type="button"
          onClick={saveMeta}
          disabled={savingMeta}
          className="rounded-full bg-alignment-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-alignment-primary/90 disabled:opacity-50"
        >
          {savingMeta ? 'Saving…' : 'Save assessment'}
        </button>
      </div>

      <h3 className="mt-10 text-base font-semibold text-alignment-accent">Questions ({assessment.questions?.length ?? 0})</h3>
      <div className="mt-4 space-y-4">
        {(assessment.questions || []).map((q) => (
          <div key={q.id} className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface p-4">
            {editingId === q.id && qDraft ? (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs text-alignment-accent/55">Text</span>
                  <textarea
                    value={qDraft.text}
                    onChange={(e) => setQDraft({ ...qDraft, text: e.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-alignment-accent/15 bg-alignment-foundation px-3 py-2 text-sm text-alignment-accent"
                  />
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="block">
                    <span className="text-xs text-alignment-accent/55">Order</span>
                    <input
                      type="number"
                      value={qDraft.order}
                      onChange={(e) => setQDraft({ ...qDraft, order: parseInt(e.target.value, 10) || 0 })}
                      className="mt-1 w-full rounded-lg border border-alignment-accent/15 bg-alignment-foundation px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-alignment-accent/55">Min</span>
                    <input
                      type="number"
                      value={qDraft.scaleMin}
                      onChange={(e) => setQDraft({ ...qDraft, scaleMin: parseInt(e.target.value, 10) || 1 })}
                      className="mt-1 w-full rounded-lg border border-alignment-accent/15 bg-alignment-foundation px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-alignment-accent/55">Max</span>
                    <input
                      type="number"
                      value={qDraft.scaleMax}
                      onChange={(e) => setQDraft({ ...qDraft, scaleMax: parseInt(e.target.value, 10) || 5 })}
                      className="mt-1 w-full rounded-lg border border-alignment-accent/15 bg-alignment-foundation px-2 py-1.5 text-sm"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs text-alignment-accent/55">Pillar</span>
                    <select
                      value={qDraft.pillar}
                      onChange={(e) => setQDraft({ ...qDraft, pillar: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-alignment-accent/15 bg-alignment-foundation px-2 py-1.5 text-sm"
                    >
                      {PILLARS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs text-alignment-accent/55">Type</span>
                    <select
                      value={qDraft.questionType}
                      onChange={(e) => setQDraft({ ...qDraft, questionType: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-alignment-accent/15 bg-alignment-foundation px-2 py-1.5 text-sm"
                    >
                      {Q_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveQuestion}
                    disabled={savingQ}
                    className="rounded-full bg-alignment-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {savingQ ? 'Saving…' : 'Save question'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setQDraft(null);
                    }}
                    className="rounded-full border border-alignment-accent/20 px-4 py-2 text-sm text-alignment-accent"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-alignment-accent/45">
                  #{q.order} · {q.pillar} · {q.questionType}
                </p>
                <p className="mt-2 text-sm text-alignment-accent">{q.text}</p>
                <button
                  type="button"
                  onClick={() => startEditQuestion(q)}
                  className="mt-3 text-sm font-medium text-alignment-primary hover:underline"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
