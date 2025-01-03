import { useParams } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./Profile.css";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [caption, setCaption] = useState("");
  const [transparency, setTransparency] = useState("public");
  const { id } = useParams();

  useEffect(() => {
    axiosSecure
      .get(`http://localhost:3000/api/v1/user/${id}`)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [axiosSecure, id]);

  useEffect(() => {
    axiosSecure
      .get(`http://localhost:3000/api/v1/pdf`)
      .then((res) => {
        setPdfs(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch PDFs:", err);
      });
  }, [axiosSecure]);

  const { _id, name, email, photo, role, totalPdf } = user || {};

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handlePdfSubmit = async () => {
    if (!caption.trim()) return alert("Caption cannot be empty.");
    if (!editorContent.trim()) return alert("PDF content cannot be empty.");
    
    try {
      const payload = {
        content: editorContent,  // The content from the editor
        user: _id,               // User ID
        transparency,            // Transparency setting
      };
  
      console.log(payload); // Log the payload to verify
  
      await axiosSecure.post(
        "http://localhost:3000/api/v1/pdf/create-pdf",
        payload  // Send as JSON, not FormData
      );
  
      setEditorContent("");
      setCaption("");
      setTransparency("public");
  
      // Fetch updated PDFs
      const res = await axiosSecure.get("http://localhost:3000/api/v1/pdf");
      setPdfs(res.data.data);
  
      // Update user profile with the new PDF count
      await axiosSecure.patch(`http://localhost:3000/api/v1/user/${id}`, {
        totalPdf: totalPdf + 1,
      });
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

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
                  {pdf.caption || `PDF ${index + 1}`}
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
          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="transparency">Transparency</label>
            <select
              id="transparency"
              value={transparency}
              onChange={(e) => setTransparency(e.target.value)}
              className="form-select"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
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
