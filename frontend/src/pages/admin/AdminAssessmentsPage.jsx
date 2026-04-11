import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';

function headers() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminAssessmentsPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/assessments`, { headers: headers() })
      .then((res) => setList(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else if (err.response?.status === 403) setError('Admin access required.');
        else setError(err.response?.data?.message || 'Failed to load assessments');
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-alignment-accent">Assessments</h2>
      <p className="mt-1 text-sm text-alignment-accent/65">
        Edit titles, activation, and question copy. Changing wording can affect how past responses read — do so deliberately.
      </p>

      {!list.length ? (
        <p className="mt-8 text-alignment-accent/70">Loading…</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {list.map((a) => (
            <li key={a.id}>
              <Link
                to={`/admin/assessments/${a.id}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-5 py-4 hover:border-alignment-primary/25 transition-colors"
              >
                <div>
                  <p className="font-medium text-alignment-accent">{a.title}</p>
                  <p className="mt-1 text-xs text-alignment-accent/55">
                    {a._count?.questions ?? 0} questions · {a._count?.responses ?? 0} responses ·{' '}
                    {a.isActive ? (
                      <span className="text-emerald-800/90">Active</span>
                    ) : (
                      <span className="text-alignment-accent/50">Inactive</span>
                    )}
                  </p>
                </div>
                <span className="text-sm text-alignment-primary font-medium">Edit →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
