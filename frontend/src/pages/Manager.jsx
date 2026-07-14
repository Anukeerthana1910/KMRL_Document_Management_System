import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./Admin.css";

/*
  Manager console.

  Deliberately reuses the "adm-" class names from Admin.css (topbar,
  sidebar, nav, panels, forms, tables, badges, buttons, modals) so this
  page shares the exact same visual language as the Admin console.
  Manager.css only adds a small set of new "mgr-" classes for pieces
  that don't exist on the Admin page (quick-action tiles, the recent
  documents feed, and the report cards).

  Only the endpoints below are used — nothing else:
    GET    /api/manager/dashboard
    GET    /api/manager/users
    POST   /api/manager/documents/upload  (multipart/form-data)
    GET    /api/manager/documents
    PUT    /api/manager/documents/:id/approve
    PUT    /api/manager/documents/:id/reject
    DELETE /api/manager/documents/:id
    GET    /api/manager/reports
*/

const NAV_SECTIONS = [
  { id: "dashboard", label: "Dashboard", icon: IconDashboard },
  { id: "users", label: "Users", icon: IconUsers },
  { id: "upload", label: "Upload Document", icon: IconUpload },
  { id: "documents", label: "Documents", icon: IconDocuments },
  { id: "reports", label: "Reports", icon: IconReports },
];

export default function Manager() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role && user.role !== "MANAGER") {
      navigate(user.role === "ADMIN" ? "/admin" : "/employee");
    }
  }, [user, navigate]);

  const [activeSection, setActiveSection] = useState("dashboard");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!user) return null;

  return (
    <div className="adm-page">
      <header className="adm-topbar">
        <div className="adm-topbar-left">
          <Seal size={34} />
          <div className="adm-logo">
            KMRL <span>DMS</span>
            <span className="adm-logo-tag">Manager Console</span>
          </div>
        </div>

        <div className="adm-topbar-right">
          <span className="adm-role-chip">Manager</span>
          <span className="adm-welcome">Hi, {user.name}</span>
          <button className="adm-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="adm-shell">
        <aside className="adm-sidebar">
          <nav className="adm-nav">
            <span className="adm-nav-label">Department Control</span>
            {NAV_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={
                    "adm-nav-item" +
                    (activeSection === section.id ? " adm-nav-item-active" : "")
                  }
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon />
                  {section.label}
                </button>
              );
            })}
          </nav>

          <div className="adm-sidebar-footer">
            <Seal size={26} />
            <p className="adm-sidebar-footer-text">
              <strong>Kochi Metro Rail Ltd.</strong>
              Document Management System
            </p>
          </div>
        </aside>

        <main className="adm-main">
          {activeSection === "dashboard" && (
            <DashboardSection user={user} onNavigate={setActiveSection} />
          )}
          {activeSection === "users" && <UsersSection />}
          {activeSection === "upload" && <UploadSection onNavigate={setActiveSection} />}
          {activeSection === "documents" && <DocumentsSection />}
          {activeSection === "reports" && <ReportsSection />}
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function DashboardSection({ user, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const [dashRes, reportRes, docsRes] = await Promise.allSettled([
          API.get("/manager/dashboard"),
          API.get("/manager/reports"),
          API.get("/manager/documents"),
        ]);

        if (ignore) return;

        if (dashRes.status === "fulfilled") {
          setStats(dashRes.value.data);
        } else {
          setErrorMsg("Could not load dashboard statistics.");
        }

        if (reportRes.status === "fulfilled") {
          setReport(reportRes.value.data);
        }

        if (docsRes.status === "fulfilled") {
          const list = Array.isArray(docsRes.value.data)
            ? docsRes.value.data
            : docsRes.value.data.documents || [];
          const sorted = [...list].sort((a, b) => {
            const ta = new Date(a.createdAt || a.uploadedAt || 0).getTime();
            const tb = new Date(b.createdAt || b.uploadedAt || 0).getTime();
            return tb - ta;
          });
          setRecentDocs(sorted.slice(0, 5));
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.users, accent: "accent-teal" },
    { label: "Total Documents", value: stats?.documents, accent: "" },
    { label: "Documents (Report)", value: report?.totalDocuments, accent: "accent-amber" },
  ];


  return (
    <section>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Manager Dashboard</h1>
          <p className="adm-page-subtitle">
            Overview of your department's users and documents.
          </p>
        </div>
      </div>

      <div className="adm-hero">
        <MetroIllustration className="adm-hero-illustration" />
        <div className="adm-hero-text">
          <h2>Welcome back, {user?.name?.split(" ")[0] || "Manager"}</h2>
          <p>
            Review incoming documents, keep track of your department's users,
            and stay on top of reporting — all from a single console.
          </p>
        </div>
      </div>

      {errorMsg && <div className="adm-error">{errorMsg}</div>}

      {loading ? (
        <p className="adm-loading">Loading statistics...</p>
      ) : (
        <div className="adm-stat-grid">
          {cards.map((c) => (
            <div key={c.label} className={`adm-stat-card ${c.accent}`}>
              <span className="adm-stat-label">{c.label}</span>
              <span className="adm-stat-value">{c.value ?? "—"}</span>
            </div>
          ))}
        </div>
      )}



      <div className="mgr-section-block">
        <h3 className="adm-panel-title">Recently uploaded documents</h3>
        {loading ? (
          <p className="adm-loading">Loading recent activity...</p>
        ) : recentDocs.length === 0 ? (
          <p className="adm-empty">No documents have been uploaded yet.</p>
        ) : (
          <div className="mgr-recent-list">
            {recentDocs.map((doc, i) => (
              <div className="mgr-recent-item" key={doc.id || i}>
                <span className="adm-audit-dot" />
                <div className="mgr-recent-item-body">
                  <p className="adm-audit-text">
                    <strong>{doc.title}</strong>
                    {doc.category ? ` — ${doc.category}` : ""}
                  </p>
                  <p className="adm-audit-time">
                    {doc.createdAt || doc.uploadedAt
                      ? new Date(doc.createdAt || doc.uploadedAt).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>
                <span className={`adm-badge adm-badge-${(doc.status || "pending").toLowerCase()}`}>
                  {doc.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   USERS
   ============================================================ */

function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await API.get("/manager/users");
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      setErrorMsg("Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q)
    );
  });

  return (
    <section>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Users</h1>
          <p className="adm-page-subtitle">
            All registered user accounts visible to your department.
          </p>
        </div>
      </div>

      {errorMsg && <div className="adm-error">{errorMsg}</div>}

      <div className="adm-toolbar">
        <div className="adm-search">
          <input
            placeholder="Search by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="adm-loading">Loading users...</p>
      ) : filtered.length === 0 ? (
        <p className="adm-empty">No users found.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="adm-row-primary">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.department || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   UPLOAD DOCUMENT
   ============================================================ */

function UploadSection({ onNavigate }) {
  const [form, setForm] = useState({ title: "", category: "", summary: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    setFile(e.target.files?.[0] || null);
  }

  async function submitUpload(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!file) {
      setErrorMsg("Please choose a file to upload.");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("category", form.category);
    payload.append("summary", form.summary);
    payload.append("file", file);

    setUploading(true);
    try {
      await API.post("/manager/documents/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("Document uploaded successfully.");
      setForm({ title: "", category: "", summary: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Could not upload document.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Upload Document</h1>
          <p className="adm-page-subtitle">
            Submit a new document to the system for review and storage.
          </p>
        </div>
      </div>

      {errorMsg && <div className="adm-error">{errorMsg}</div>}
      {successMsg && <div className="adm-success">{successMsg}</div>}

      <div className="adm-panel">
        <h3 className="adm-panel-title">Document details</h3>
        <form className="adm-form" onSubmit={submitUpload}>
          <div className="adm-form-row">
            <label className="adm-field">
              Title
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="adm-field">
              Category
              <input
                required
                placeholder="e.g. Safety Circular"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </label>
          </div>

          <label className="adm-field">
            Summary
            <textarea
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </label>

          <label className="adm-field">
            File
            <div className="mgr-dropzone">
              <input
                ref={fileInputRef}
                type="file"
                required
                onChange={handleFileChange}
                className="mgr-file-input"
              />
              <span className="mgr-dropzone-text">
                {file ? file.name : "Click to choose a file, or drag one here"}
              </span>
            </div>
          </label>

          <div className="adm-form-actions">
            <button
              type="button"
              className="adm-btn adm-btn-ghost"
              onClick={() => onNavigate("dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="adm-btn" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload document"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ============================================================
   DOCUMENTS
   ============================================================ */

function DocumentsSection() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await API.get("/manager/documents");
      setDocuments(Array.isArray(res.data) ? res.data : res.data.documents || []);
    } catch (err) {
      setErrorMsg("Could not load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  async function approveDocument(id) {
    setErrorMsg("");
    setSuccessMsg("");
    setBusyId(id);
    try {
      await API.put(`/manager/documents/${id}/approve`);
      setSuccessMsg("Document approved.");
      loadDocuments();
    } catch (err) {
      setErrorMsg("Could not approve document.");
    } finally {
      setBusyId(null);
    }
  }

  async function rejectDocument(id) {
    setErrorMsg("");
    setSuccessMsg("");
    setBusyId(id);
    try {
      await API.put(`/manager/documents/${id}/reject`);
      setSuccessMsg("Document rejected.");
      loadDocuments();
    } catch (err) {
      setErrorMsg("Could not reject document.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteDocument(id) {
    if (!window.confirm("Permanently delete this document?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    setBusyId(id);
    try {
      await API.delete(`/manager/documents/${id}`);
      setSuccessMsg("Document deleted.");
      loadDocuments();
    } catch (err) {
      setErrorMsg("Could not delete document.");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = documents.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      d.title?.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q)
    );
  });

  return (
    <section>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Documents</h1>
          <p className="adm-page-subtitle">
            Review, approve, reject, or remove submitted documents.
          </p>
        </div>
      </div>

      {errorMsg && <div className="adm-error">{errorMsg}</div>}
      {successMsg && <div className="adm-success">{successMsg}</div>}

      <div className="adm-toolbar">
        <div className="adm-search">
          <input
            placeholder="Search documents by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="adm-loading">Loading documents...</p>
      ) : filtered.length === 0 ? (
        <p className="adm-empty">No documents found.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <span className="adm-row-primary">{doc.title}</span>
                    {doc.summary && <span className="adm-row-sub">{doc.summary}</span>}
                  </td>
                  <td>{doc.category || "—"}</td>
                  <td>
                    <span className={`adm-badge adm-badge-${(doc.status || "pending").toLowerCase()}`}>
                      {doc.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className="adm-table-actions">
                      <button
                        className="adm-btn adm-btn-teal adm-btn-small"
                        disabled={busyId === doc.id}
                        onClick={() => approveDocument(doc.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="adm-btn mgr-btn-warning adm-btn-small"
                        disabled={busyId === doc.id}
                        onClick={() => rejectDocument(doc.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="adm-btn adm-btn-danger adm-btn-small"
                        disabled={busyId === doc.id}
                        onClick={() => deleteDocument(doc.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   REPORTS
   ============================================================ */

function ReportsSection() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await API.get("/manager/reports");
        if (!ignore) setReport(res.data);
      } catch (err) {
        if (!ignore) setErrorMsg("Could not load report data.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Reports</h1>
          <p className="adm-page-subtitle">
            Summary reporting for documents in your department.
          </p>
        </div>
      </div>

      {errorMsg && <div className="adm-error">{errorMsg}</div>}

      {loading ? (
        <p className="adm-loading">Loading report...</p>
      ) : (
        <div className="mgr-report-grid">
          <div className="mgr-report-card">
            <span className="mgr-report-label">Total Documents</span>
            <span className="mgr-report-value">{report?.totalDocuments ?? "—"}</span>
            <p className="mgr-report-desc">
              Total number of documents currently recorded in the system.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   ICONS & ILLUSTRATION
   ============================================================ */

function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="6" height="7" rx="1" />
      <rect x="11" y="3" width="6" height="4" rx="1" />
      <rect x="11" y="9" width="6" height="8" rx="1" />
      <rect x="3" y="12" width="6" height="5" rx="1" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="6.5" r="3" />
      <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 13V3" />
      <path d="M6 7l4-4 4 4" />
      <path d="M4 13v2.4a1.6 1.6 0 0 0 1.6 1.6h8.8a1.6 1.6 0 0 0 1.6-1.6V13" />
    </svg>
  );
}

function IconDocuments() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 2.5h7l3 3V17a.6.6 0 0 1-.6.6H5.6a.6.6 0 0 1-.6-.6V3.1a.6.6 0 0 1 .6-.6Z" />
      <path d="M7 9h6M7 12.2h6M7 5.8h3" />
    </svg>
  );
}

function IconReports() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 16.5V8.2M10 16.5V3.5M16 16.5v-6" />
      <path d="M3 16.5h14" />
    </svg>
  );
}

function Seal({ size = 40 }) {
  const stroke = "#0B2545";
  const fill = "#F7F4EE";

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="30" stroke={stroke} strokeWidth="2" />
      <circle cx="32" cy="32" r="24" stroke={stroke} strokeWidth="1" />
      <path d="M14 36 A18 18 0 0 1 50 36" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="36" r="2.5" fill={stroke} />
      <circle cx="32" cy="20.5" r="2.5" fill={stroke} />
      <circle cx="50" cy="36" r="2.5" fill={stroke} />
      <rect x="26" y="38" width="12" height="15" rx="1.5" stroke={stroke} strokeWidth="2" fill={fill} />
      <line x1="29" y1="43" x2="35" y2="43" stroke={stroke} strokeWidth="1.4" />
      <line x1="29" y1="47" x2="35" y2="47" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}

/* Elevated metro line illustration, styled like the seal: navy line-art on paper */
function MetroIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="58" fill="#F7F4EE" stroke="#DAD4C4" />
      <path d="M14 88h92" stroke="#0B2545" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 88v10M46 88v10M74 88v10M94 88v10" stroke="#0B2545" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="24" y="58" width="72" height="22" rx="6" stroke="#0B2545" strokeWidth="2.4" fill="#fff" />
      <path d="M24 68h72" stroke="#0B2545" strokeWidth="1.4" />
      <rect x="31" y="62" width="12" height="6" rx="1.5" stroke="#C98A2C" strokeWidth="1.8" />
      <rect x="47" y="62" width="12" height="6" rx="1.5" stroke="#C98A2C" strokeWidth="1.8" />
      <rect x="63" y="62" width="12" height="6" rx="1.5" stroke="#C98A2C" strokeWidth="1.8" />
      <rect x="79" y="62" width="12" height="6" rx="1.5" stroke="#C98A2C" strokeWidth="1.8" />
      <circle cx="36" cy="83" r="4" stroke="#0B2545" strokeWidth="2.2" fill="#F7F4EE" />
      <circle cx="84" cy="83" r="4" stroke="#0B2545" strokeWidth="2.2" fill="#F7F4EE" />
      <path d="M50 58V50l8-4 8 4v8" stroke="#0E7C86" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}