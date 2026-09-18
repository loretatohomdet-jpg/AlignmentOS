import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import {
  PILLAR_CHIP,
  adminHeaders,
  btnDanger,
  btnGhost,
  btnPrimary,
  confirmDelete,
  fieldClass,
} from './adminShared';

const PILLARS = ['IDENTITY', 'PURPOSE', 'MINDSET', 'HABITS', 'ENVIRONMENT', 'EXECUTION'];
const Q_TYPES = ['STANDARD', 'PENALTY'];

const emptyQuestion = {
  text: '',
  pillar: 'IDENTITY',
  questionType: 'STANDARD',
  scaleMin: 1,
  scaleMax: 5,
};

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
  const [adding, setAdding] = useState(false);
  const [newQ, setNewQ] = useState(emptyQuestion);

  const load = () => {
    setError(null);
    axios
      .get(`${API_BASE}/admin/assessments/${assessmentId}`, { headers: adminHeaders() })
      .then((res) => {
        const a = res.data;
        setAssessment(a);
        setTitle(a.title);
        setDescription(a.description ?? '');
        setIsActive(a.isActive);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else if (err.response?.status === 404) setError('Assessment not found.');
        else setError(err.response?.data?.message || 'Could not load');
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
        { headers: adminHeaders() }
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
      const res = await axios.patch(`${API_BASE}/admin/questions/${editingId}`, qDraft, { headers: adminHeaders() });
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

  const addQuestion = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/admin/assessments/${assessmentId}/questions`, newQ, {
        headers: adminHeaders(),
      });
      setAssessment((prev) =>
        prev ? { ...prev, questions: [...(prev.questions || []), res.data].sort((a, b) => a.order - b.order) } : prev
      );
      setNewQ(emptyQuestion);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add question');
    } finally {
      setAdding(false);
    }
  };

  const removeQuestion = async (q) => {
    if (!confirmDelete(`question #${q.order}`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/questions/${q.id}`, { headers: adminHeaders() });
      setAssessment((prev) => (prev ? { ...prev, questions: prev.questions.filter((x) => x.id !== q.id) } : prev));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete question');
    }
  };

  const removeAssessment = async () => {
    if (!confirmDelete(`“${title}”`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/assessments/${assessmentId}`, { headers: adminHeaders() });
      navigate('/admin/assessments', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete assessment');
    }
  };

  if (error && !assessment) {
    return (
      <div>
        <Link to="/admin/assessments" className="text-sm text-[#3A635C] hover:underline">
          ← Assessment
        </Link>
        <p className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p>
      </div>
    );
  }

  if (!assessment) return <p className="text-alignment-accent/80">Loading…</p>;

  return (
    <div>
      <Link to="/admin/assessments" className="text-sm text-[#3A635C] hover:underline">
        ← All assessments
      </Link>
      <h2 className="mt-4 font-display text-2xl text-[#3A635C]">Edit assessment</h2>
      {error ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p> : null}

      <div className="mt-6 rounded-2xl bg-white p-5 space-y-4 max-w-2xl shadow-apple">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#3A635C]">Title</span>
          <input className={`${fieldClass} mt-1`} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#3A635C]">Description</span>
          <textarea className={`${fieldClass} mt-1`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <span className="text-sm">Active (available for new sessions)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={saveMeta} disabled={savingMeta} className={btnPrimary}>
            {savingMeta ? 'Saving…' : 'Save assessment'}
          </button>
          <button type="button" onClick={removeAssessment} className={btnDanger}>
            Delete assessment
          </button>
        </div>
      </div>

      <h3 className="mt-10 font-display text-xl text-[#3A635C]">Questions ({assessment.questions?.length ?? 0})</h3>
      <div className="mt-4 space-y-3">
        {(assessment.questions || []).map((q) => (
          <div key={q.id} className="rounded-2xl bg-white p-4 shadow-apple">
            {editingId === q.id && qDraft ? (
              <div className="space-y-3">
                <textarea
                  value={qDraft.text}
                  onChange={(e) => setQDraft({ ...qDraft, text: e.target.value })}
                  rows={3}
                  className={fieldClass}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="block text-xs">
                    Order
                    <input
                      type="number"
                      value={qDraft.order}
                      onChange={(e) => setQDraft({ ...qDraft, order: parseInt(e.target.value, 10) || 0 })}
                      className={`${fieldClass} mt-1`}
                    />
                  </label>
                  <label className="block text-xs">
                    Min
                    <input
                      type="number"
                      value={qDraft.scaleMin}
                      onChange={(e) => setQDraft({ ...qDraft, scaleMin: parseInt(e.target.value, 10) || 1 })}
                      className={`${fieldClass} mt-1`}
                    />
                  </label>
                  <label className="block text-xs">
                    Max
                    <input
                      type="number"
                      value={qDraft.scaleMax}
                      onChange={(e) => setQDraft({ ...qDraft, scaleMax: parseInt(e.target.value, 10) || 5 })}
                      className={`${fieldClass} mt-1`}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select className={fieldClass} value={qDraft.pillar} onChange={(e) => setQDraft({ ...qDraft, pillar: e.target.value })}>
                    {PILLARS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    className={fieldClass}
                    value={qDraft.questionType}
                    onChange={(e) => setQDraft({ ...qDraft, questionType: e.target.value })}
                  >
                    {Q_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={saveQuestion} disabled={savingQ} className={btnPrimary}>
                    {savingQ ? 'Saving…' : 'Save question'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setQDraft(null);
                    }}
                    className={btnGhost}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-alignment-accent/60">#{q.order}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${PILLAR_CHIP[q.pillar] || 'bg-alignment-accent text-white'}`}>
                    {q.pillar}
                  </span>
                  <span className="text-xs text-alignment-accent/60">{q.questionType}</span>
                </div>
                <p className="mt-2 text-sm">{q.text}</p>
                <div className="mt-3 flex gap-3">
                  <button type="button" onClick={() => startEditQuestion(q)} className="text-sm font-medium text-[#3A635C] hover:underline">
                    Edit
                  </button>
                  <button type="button" onClick={() => removeQuestion(q)} className="text-sm font-medium text-[#C45C4A] hover:underline">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={addQuestion} className="mt-8 rounded-2xl bg-[#4A7C73]/12 p-5 space-y-3 max-w-2xl">
        <h3 className="font-medium text-[#3A635C]">Add a question</h3>
        <textarea
          required
          rows={3}
          placeholder="Question text"
          className={fieldClass}
          value={newQ.text}
          onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select className={fieldClass} value={newQ.pillar} onChange={(e) => setNewQ({ ...newQ, pillar: e.target.value })}>
            {PILLARS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            className={fieldClass}
            value={newQ.questionType}
            onChange={(e) => setNewQ({ ...newQ, questionType: e.target.value })}
          >
            {Q_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={adding} className={btnPrimary}>
          {adding ? 'Adding…' : 'Add question'}
        </button>
      </form>
    </div>
  );
}
