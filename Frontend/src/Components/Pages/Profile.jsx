import { useParams } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import "./Profile.css"; // Create a separate CSS file for styling

const Profile = () => {
	const axiosSecure = useAxiosSecure();
	const [user, setUser] = useState(null);
	const [pdfs, setPdfs] = useState([]);
	const [editorContent, setEditorContent] = useState("");
	const { id } = useParams();

	useEffect(() => {
    	axiosSecure
        	.get(`http://localhost:3000/api/v1/user/${id}`)
        	.then((res) => {
            	setUser(res.data.data);
            	setPdfs(res.data.data.pdfs || []);
        	})
        	.catch((err) => {
            	console.error("Failed to fetch user data:", err);
        	});
	}, [axiosSecure, id]);

	const handleEditorChange = (content) => {
    	setEditorContent(content);
	};

	const handlePdfSubmit = () => {
    	if (!editorContent.trim()) return alert("PDF content cannot be empty.");

    	const newPdf = { content: editorContent, createdAt: new Date() };
    	axiosSecure
        	.post(`http://localhost:3000/api/v1/pdfs`, newPdf)
        	.then((res) => {
            	setPdfs((prev) => [...prev, res.data.pdf]);
            	setUser((prev) => ({ ...prev, totalPdf: (prev.totalPdf || 0) + 1 }));
            	setEditorContent("");
            	alert("PDF added successfully!");
        	})
        	.catch((err) => console.error("Failed to add PDF:", err));
	};

	const { name, email, photo, role, totalPdf } = user || {};

	return (
    	<div className="profile-container">
        	<div className="profile-header">
            	{photo && <img src={photo} alt={name} className="profile-photo" />}
            	<div className="profile-details">
                	<h1 className="profile-name">{name}</h1>
                	<p className="profile-email">Email: {email}</p>
                	<p className="profile-role">Role: {role}</p>
                	<p className="profile-total-pdfs">Total PDFs: {totalPdf || 0}</p>
            	</div>
        	</div>

        	<div className="pdf-section">
            	<h2 className="section-title">Uploaded PDFs</h2>
            	{pdfs.length > 0 ? (
                	<ul className="pdf-list">
                    	{pdfs.map((pdf, index) => (
                        	<li key={index} className="pdf-item">
                            	<a href={pdf.url} target="_blank" rel="noopener noreferrer">
                                	PDF {index + 1}
                            	</a>
                        	</li>
                    	))}
                	</ul>
            	) : (
                	<p className="no-pdfs">No PDFs uploaded yet.</p>
            	)}
        	</div>

        	{user && id === user._id && (
            	<div className="pdf-editor">
                	<h2 className="section-title">Create a New PDF</h2>
                	<Editor
                    	apiKey="6qm56tt07vwxfxp49ag0k9amhh4kii4ehi5ofx7k8zwr22kg"
                    	value={editorContent}
                    	init={{
                        	height: 300,
                        	menubar: false,
                        	plugins: ["link", "lists", "code"],
                        	toolbar:
                            	"undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code",
                    	}}
                    	onEditorChange={handleEditorChange}
                	/>
                	<button className="submit-btn" onClick={handlePdfSubmit}>
                    	Submit PDF
                	</button>
            	</div>
        	)}
    	</div>
	);
};

export default Profile;
