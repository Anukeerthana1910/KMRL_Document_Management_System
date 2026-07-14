import {useContext,useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../services/api";
import {AuthContext} from "../context/AuthContext";
import "./Employee.css";


const TABS=[
{ id:"documents", label:"All Documents" },
{ id:"mydocs", label:"My Documents" },
{ id:"profile", label:"Profile" }
];


export default function Employee(){


const {user,logout}=useContext(AuthContext);

const navigate=useNavigate();


// guard: bounce to login if nobody's signed in

useEffect(()=>{

if(!user){
navigate("/login");
}

},[user,navigate]);


const [activeTab,setActiveTab]=useState("documents");

const [documents,setDocuments]=useState([]);

const [myDocuments,setMyDocuments]=useState([]);

const [loading,setLoading]=useState(false);

const [errorMsg,setErrorMsg]=useState("");


const [searchQuery,setSearchQuery]=useState("");

const [selectedDoc,setSelectedDoc]=useState(null);

const [comments,setComments]=useState([]);

const [newComment,setNewComment]=useState("");


const [profileForm,setProfileForm]=useState({
name:user?.name || "",
email:user?.email || ""
});

const [profileMsg,setProfileMsg]=useState("");


// ---- data loading ----

async function loadDocuments(){

setLoading(true);
setErrorMsg("");

try{

const res=await API.get("/documents");
setDocuments(res.data);

}
catch(err){

setErrorMsg("Could not load documents.");

}
finally{

setLoading(false);

}

}


async function loadMyDocuments(){

setLoading(true);
setErrorMsg("");

try{

const res=await API.get(
`/users/my-documents?userId=${user.id}`
);

setMyDocuments(res.data);

}
catch(err){

setErrorMsg("Could not load your documents.");

}
finally{

setLoading(false);

}

}


useEffect(()=>{

if(!user) return;

if(activeTab==="documents") loadDocuments();

if(activeTab==="mydocs") loadMyDocuments();

// eslint-disable-next-line react-hooks/exhaustive-deps
},[activeTab,user]);



async function runSearch(e){

e.preventDefault();

if(!searchQuery.trim()){
loadDocuments();
return;
}

setLoading(true);
setErrorMsg("");

try{

const res=await API.get(
`/documents/search?q=${encodeURIComponent(searchQuery)}`
);

setDocuments(res.data);

}
catch(err){

setErrorMsg("Search failed.");

}
finally{

setLoading(false);

}

}



async function openDocument(doc){

setSelectedDoc(doc);
setComments([]);

try{

const detail=await API.get(`/documents/${doc.id}`);
setSelectedDoc(detail.data);

}
catch(err){
// fall back to the row we already have
}

try{

const res=await API.get(`/documents/${doc.id}/comments`);
setComments(Array.isArray(res.data) ? res.data : []);

}
catch(err){
// comment endpoint may not be ready yet on the backend
setComments([]);

}

}


function closeDocument(){

setSelectedDoc(null);
setComments([]);
setNewComment("");

}


async function downloadDocument(id){

try{

const res=await API.get(
`/documents/${id}/download`,
{ responseType:"blob" }
);

const url=window.URL.createObjectURL(
new Blob([res.data])
);

const link=document.createElement("a");
link.href=url;
link.setAttribute("download","");
document.body.appendChild(link);
link.click();
link.remove();

}
catch(err){

setErrorMsg("Download failed.");

}

}


async function submitComment(e){

e.preventDefault();

if(!newComment.trim() || !selectedDoc) return;

try{

await API.post(
`/documents/${selectedDoc.id}/comments`,
{ comment:newComment }
);

setNewComment("");

const res=await API.get(
`/documents/${selectedDoc.id}/comments`
);

setComments(Array.isArray(res.data) ? res.data : []);

}
catch(err){

setErrorMsg(
"Could not post comment (backend comment endpoint isn't wired up yet)."
);

}

}



async function saveProfile(e){

e.preventDefault();

setProfileMsg("");

try{

await API.put("/users/profile",{
id:user.id,
name:profileForm.name,
email:profileForm.email
});

setProfileMsg("Profile updated.");

}
catch(err){

setProfileMsg("Could not update profile.");

}

}


function handleLogout(){

logout();
navigate("/login");

}


if(!user) return null;


return(

<div className="emp-page">


<header className="emp-topbar">

<div className="emp-logo">
KMRL <span>DMS</span>
</div>

<div className="emp-topbar-right">

<span className="emp-welcome">
Hi, {user.name}
</span>

<button className="emp-logout" onClick={handleLogout}>
Logout
</button>

</div>

</header>


<div className="emp-body">


<nav className="emp-tabs">

{TABS.map(tab=>(

<button
key={tab.id}
className={
"emp-tab" +
(activeTab===tab.id ? " emp-tab-active" : "")
}
onClick={()=>setActiveTab(tab.id)}
>
{tab.label}
</button>

))}

</nav>


<main className="emp-content">


{errorMsg && (
<div className="emp-error">{errorMsg}</div>
)}


{activeTab==="documents" && (

<section>

<form className="emp-search" onSubmit={runSearch}>

<input
placeholder="Search documents by title or category..."
value={searchQuery}
onChange={e=>setSearchQuery(e.target.value)}
/>

<button type="submit">Search</button>

</form>


<DocumentTable
loading={loading}
documents={documents}
onOpen={openDocument}
/>

</section>

)}


{activeTab==="mydocs" && (

<section>

<h2 className="emp-section-title">
My Documents
</h2>

<DocumentTable
loading={loading}
documents={myDocuments}
onOpen={openDocument}
/>

</section>

)}


{activeTab==="profile" && (

<section className="emp-profile">

<h2 className="emp-section-title">
My Profile
</h2>

<form className="emp-profile-form" onSubmit={saveProfile}>

<label>
Name
<input
value={profileForm.name}
onChange={e=>
setProfileForm({
...profileForm,
name:e.target.value
})
}
/>
</label>

<label>
Email
<input
type="email"
value={profileForm.email}
onChange={e=>
setProfileForm({
...profileForm,
email:e.target.value
})
}
/>
</label>

<label>
Role
<input value={user.role} disabled />
</label>

<button type="submit">
Save changes
</button>

{profileMsg && (
<p className="emp-profile-msg">{profileMsg}</p>
)}

</form>

</section>

)}


</main>


</div>


{selectedDoc && (

<div className="emp-modal-backdrop" onClick={closeDocument}>

<div
className="emp-modal"
onClick={e=>e.stopPropagation()}
>

<button className="emp-modal-close" onClick={closeDocument}>
✕
</button>

<h2>{selectedDoc.title}</h2>

<p className="emp-modal-meta">
Category: {selectedDoc.category || "—"} &middot; Status:{" "}
<span className={`emp-status emp-status-${(selectedDoc.status || "pending").toLowerCase()}`}>
{selectedDoc.status || "Pending"}
</span>
</p>

{selectedDoc.summary && (
<p className="emp-modal-summary">
{selectedDoc.summary}
</p>
)}

<button
className="emp-download-btn"
onClick={()=>downloadDocument(selectedDoc.id)}
>
Download
</button>


<div className="emp-comments">

<h3>Comments</h3>

{comments.length===0 && (
<p className="emp-no-comments">No comments yet.</p>
)}

<ul>

{comments.map((c,i)=>(

<li key={c.id || i}>
{c.comment}
</li>

))}

</ul>

<form onSubmit={submitComment} className="emp-comment-form">

<input
placeholder="Add a comment..."
value={newComment}
onChange={e=>setNewComment(e.target.value)}
/>

<button type="submit">Post</button>

</form>

</div>

</div>

</div>

)}


</div>

)

}



function DocumentTable({loading,documents,onOpen}){

if(loading){
return <p className="emp-loading">Loading...</p>;
}

if(!documents || documents.length===0){
return <p className="emp-empty">No documents found.</p>;
}

return(

<table className="emp-table">

<thead>

<tr>
<th>Title</th>
<th>Category</th>
<th>Status</th>
<th></th>
</tr>

</thead>

<tbody>

{documents.map(doc=>(

<tr key={doc.id}>

<td>{doc.title}</td>

<td>{doc.category || "—"}</td>

<td>
<span className={`emp-status emp-status-${(doc.status || "pending").toLowerCase()}`}>
{doc.status || "Pending"}
</span>
</td>

<td>
<button
className="emp-view-btn"
onClick={()=>onOpen(doc)}
>
View
</button>
</td>

</tr>

))}

</tbody>

</table>

)

}