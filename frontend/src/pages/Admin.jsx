import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./Admin.css";

/*
  This version only talks to the following backend endpoints:
    POST   /api/admin/managers
    DELETE /api/admin/managers/:id
    POST   /api/admin/departments
    GET    /api/admin/documents
    DELETE /api/admin/documents/:id

  Anything that required an endpoint outside that list (listing/viewing
  managers, listing/editing/deleting departments, users management,
  audit log, dashboard stats, document detail fetch, document access
  permissions) has been removed. Where useful, we keep a session-only
  local list built from successful creates/loads so the UI still feels
  complete, but nothing here assumes a GET/PUT endpoint that doesn't
  exist on the backend.
*/

const NAV_SECTIONS = [
  { id: "dashboard", label: "Dashboard", icon: IconDashboard },
  { id: "managers", label: "Managers", icon: IconManagers },
  { id: "departments", label: "Departments", icon: IconDepartments },
  { id: "documents", label: "Documents", icon: IconDocuments },
];

export default function Admin() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role && user.role !== "ADMIN") {
      navigate(user.role === "MANAGER" ? "/manager" : "/employee");
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
            <span className="adm-logo-tag">Administrator Console</span>
          </div>
        </div>

        <div className="adm-topbar-right">
          <span className="adm-role-chip">Admin</span>
          <span className="adm-welcome">Hi, {user.name}</span>
          <button className="adm-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="adm-shell">
        <aside className="adm-sidebar">
          <nav className="adm-nav">
            <span className="adm-nav-label">System Control</span>
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
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "managers" && <ManagersSection />}
          {activeSection === "departments" && <DepartmentsSection />}
          {activeSection === "documents" && <DocumentsSection />}
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   No dashboard-stats endpoint is available, so this is a static
   welcome panel rather than a data-driven one.
   ============================================================ */

function DashboardSection() {
  return (
    <section>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Administrator Dashboard</h1>
          <p className="adm-page-subtitle">
            Welcome to the KMRL Document Management System control panel.
          </p>
        </div>
      </div>

      <div className="adm-hero">
        <MetroIllustration className="adm-hero-illustration" />
        <div className="adm-hero-text">
          <h2>Kochi Metro Rail Limited</h2>
          <p>
            Use the panel on the left to create manager accounts, register
            new departments, and manage documents across the network.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MANAGERS
   Only creation and deletion are supported by the backend, so
   there is no manager listing/detail endpoint. We keep a
   session-only list of managers created (or attempted-deleted)
   during this visit so the admin has something to act on.
   ============================================================ */

function ManagersSection() {
  const [managers, setManagers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  async function createManager(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setCreating(true);
    try {
      const res = await API.post("/admin/managers", form);
      const created = res.data?.manager || res.data || {};
      setManagers((prev) => [
        {
          id: created.id || created._id || `local-${Date.now()}`,
          name: created.name || form.name,
          email: created.email || form.email,
          department: created.department || form.department,
        },
        ...prev,
      ]);
      setSuccessMsg("Manager account created successfully.");
      setForm({ name: "", email: "", password: "", department: "" });
      setShowCreate(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Could not create manager.");
    } finally {
      setCreating(false);
    }
  }

  async function deleteManager(id) {
    if (!window.confirm("Remove this manager account? This cannot be undone.")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await API.delete(`/admin/managers/${id}`);
      setSuccessMsg("Manager deleted.");
      setManagers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setErrorMsg("Could not delete manager.");
    }
  }

  return (
    <section>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Managers</h1>
          <p className="adm-page-subtitle">
            Department heads responsible for reviewing and approving documents.
          </p>
        </div>
        <button className="adm-btn" onClick={() => setShowCreate((s) => !s)}>
          {showCreate ? "Close form" : "+ New manager"}
        </button>
      </div>

      {errorMsg && <div className="adm-error">{errorMsg}</div>}
      {successMsg && <div className="adm-success">{successMsg}</div>}

      {showCreate && (
        <div className="adm-panel">
          <h3 className="adm-panel-title">Create manager account</h3>
          <form className="adm-form" onSubmit={createManager}>
            <div className="adm-form-row">
              <label className="adm-field">
                Full name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="adm-field">
                Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
            </div>
            <div className="adm-form-row">
              <label className="adm-field">
                Temporary password
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>
              <label className="adm-field">
                Department
                <input
                  required
                  placeholder="e.g. Operations"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </label>
            </div>
            <div className="adm-form-actions">
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="adm-btn" disabled={creating}>
                {creating ? "Creating..." : "Create manager"}
              </button>
            </div>
          </form>
        </div>
      )}

      {managers.length === 0 ? (
        <p className="adm-empty">
          No managers created in this session yet. Use "New manager" to add one.
        </p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => (
                <tr key={m.id}>
                  <td className="adm-row-primary">{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.department || "—"}</td>
                  <td>
                    <div className="adm-table-actions">
                      <button className="adm-btn adm-btn-danger adm-btn-small" onClick={() => deleteManager(m.id)}>
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
   DEPARTMENTS
   Only creation is supported by the backend (no list/edit/delete
   endpoint), so this section is create-only. Departments created
   during this session are shown below for reference.
   ============================================================ */

function DepartmentsSection() {
  const [departments, setDepartments] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({ name: "", description: "" });

  async function createDepartment(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setCreating(true);
    try {
      const res = await API.post("/admin/departments", form);
      const created = res.data?.department || res.data || {};
      setDepartments((prev) => [
        {
          id: created.id || created._id || `local-${Date.now()}`,
          name: created.name || form.name,
          description: created.description || form.description,
        },
        ...prev,
      ]);
      setSuccessMsg("Department created.");
      setForm({ name: "", description: "" });
      setShowCreate(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Could not create department.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Departments</h1>
          <p className="adm-page-subtitle">
            Functional divisions across the metro network — Operations,
            Engineering, Finance, HR, and more.
          </p>
        </div>
        <button className="adm-btn" onClick={() => setShowCreate((s) => !s)}>
          {showCreate ? "Close form" : "+ New department"}
        </button>
      </div>

      {errorMsg && <div className="adm-error">{errorMsg}</div>}
      {successMsg && <div className="adm-success">{successMsg}</div>}

      {showCreate && (
        <div className="adm-panel">
          <h3 className="adm-panel-title">Create department</h3>
          <form className="adm-form" onSubmit={createDepartment}>
            <div className="adm-form-row">
              <label className="adm-field">
                Department name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
            </div>
            <label className="adm-field">
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <div className="adm-form-actions">
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="adm-btn" disabled={creating}>
                {creating ? "Creating..." : "Create department"}
              </button>
            </div>
          </form>
        </div>
      )}

      {departments.length === 0 ? (
        <p className="adm-empty">
          No departments created in this session yet. Use "New department" to add one.
        </p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id}>
                  <td className="adm-row-primary">{d.name}</td>
                  <td>{d.description || "—"}</td>
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
   DOCUMENTS
   GET /admin/documents and DELETE /admin/documents/:id are
   supported. Document detail is shown from the already-fetched
   row data (no separate detail endpoint), and access-permission
   management has been removed since there's no supporting API.
   ============================================================ */

function DocumentsSection() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await API.get("/admin/documents");
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

  function openDocument(doc) {
    setSelectedDoc(doc);
  }

  async function deleteDocument(id) {
    if (!window.confirm("Permanently delete this document?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await API.delete(`/admin/documents/${id}`);
      setSuccessMsg("Document deleted.");
      loadDocuments();
    } catch (err) {
      setErrorMsg("Could not delete document.");
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
            Every document uploaded across all departments in the system.
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
                <th>Department</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <span className="adm-row-primary">{doc.title}</span>
                    <span className="adm-row-sub">{doc.category || "Uncategorised"}</span>
                  </td>
                  <td>{doc.department || "—"}</td>
                  <td>
                    <span className={`adm-badge adm-badge-${(doc.status || "pending").toLowerCase()}`}>
                      {doc.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className="adm-table-actions">
                      <button className="adm-btn adm-btn-ghost adm-btn-small" onClick={() => openDocument(doc)}>
                        View
                      </button>
                      <button className="adm-btn adm-btn-danger adm-btn-small" onClick={() => deleteDocument(doc.id)}>
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

      {selectedDoc && (
        <div className="adm-modal-backdrop" onClick={() => setSelectedDoc(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="adm-modal-close" onClick={() => setSelectedDoc(null)}>
              ✕
            </button>
            <h2>{selectedDoc.title}</h2>
            <p className="adm-modal-meta">
              Status:{" "}
              <span className={`adm-badge adm-badge-${(selectedDoc.status || "pending").toLowerCase()}`}>
                {selectedDoc.status || "Pending"}
              </span>
            </p>
            <dl className="adm-detail-grid">
              <div className="adm-detail-item">
                <dt>Category</dt>
                <dd>{selectedDoc.category || "—"}</dd>
              </div>
              <div className="adm-detail-item">
                <dt>Department</dt>
                <dd>{selectedDoc.department || "—"}</dd>
              </div>
              <div className="adm-detail-item">
                <dt>Uploaded by</dt>
                <dd>{selectedDoc.uploadedBy || selectedDoc.uploaderName || "—"}</dd>
              </div>
              <div className="adm-detail-item">
                <dt>Document ID</dt>
                <dd>{selectedDoc.id}</dd>
              </div>
            </dl>
            {selectedDoc.summary && (
              <p style={{ fontSize: "14px", lineHeight: 1.55 }}>{selectedDoc.summary}</p>
            )}
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

function IconManagers() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="7.5" cy="6.5" r="2.7" />
      <path d="M2.5 17c0-3 2.3-5 5-5s5 2 5 5" />
      <circle cx="14.5" cy="7.5" r="2" />
      <path d="M12.8 12.3c2.1.2 3.7 1.9 3.7 4.2" />
    </svg>
  );
}

function IconDepartments() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 17V8l7-4 7 4v9" />
      <path d="M3 17h14" />
      <path d="M8 17v-5h4v5" />
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
      {/* elevated viaduct */}
      <path d="M14 88h92" stroke="#0B2545" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 88v10M46 88v10M74 88v10M94 88v10" stroke="#0B2545" strokeWidth="2.2" strokeLinecap="round" />
      {/* train body */}
      <rect x="24" y="58" width="72" height="22" rx="6" stroke="#0B2545" strokeWidth="2.4" fill="#fff" />
      <path d="M24 68h72" stroke="#0B2545" strokeWidth="1.4" />
      <rect x="31" y="62" width="12" height="6" rx="1.5" stroke="#C98A2C" strokeWidth="1.8" />
      <rect x="47" y="62" width="12" height="6" rx="1.5" stroke="#C98A2C" strokeWidth="1.8" />
      <rect x="63" y="62" width="12" height="6" rx="1.5" stroke="#C98A2C" strokeWidth="1.8" />
      <rect x="79" y="62" width="12" height="6" rx="1.5" stroke="#C98A2C" strokeWidth="1.8" />
      <circle cx="36" cy="83" r="4" stroke="#0B2545" strokeWidth="2.2" fill="#F7F4EE" />
      <circle cx="84" cy="83" r="4" stroke="#0B2545" strokeWidth="2.2" fill="#F7F4EE" />
      {/* pantograph */}
      <path d="M50 58V50l8-4 8 4v8" stroke="#0E7C86" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}