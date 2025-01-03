import { useParams } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./Profile.css";
import Swal from "sweetalert2";
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [caption, setCaption] = useState("");
  const [transparency, setTransparency] = useState("public");
  const { id } = useParams();

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 12,
    },
    section: {
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    content: {
      lineHeight: 1.5,
    },
  });
  

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
        setPdfs(res.data.data); // Assuming the data is in `data.data`
      })
      .catch((err) => {
        console.error("Failed to fetch PDFs:", err);
      });
  }, [axiosSecure]);

  const { _id, name, email, photo, role, totalPdf } = user || {};

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const getTranslation = async (content) => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Add instruction to the prompt for Bangla-only responses
    const enhancedPrompt = `
        The following text is written in Banglish. Convert it to Bangla and provide your response strictly in Bangla:
         "${content}"
        `;

    const result = await model.generateContent(enhancedPrompt);

    return result;
  };

  const generatePdfFromContent = async (geminiTranslation) => {
    // console.log(geminiTranslation);
    // Define the PDF document
    const MyDocument = (
      <Document>
        <Page style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Generated PDF</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.content}>{geminiTranslation}</Text>
          </View>
        </Page>
      </Document>
    );

    console.log(MyDocument);
  
    // Generate the PDF Blob
    const pdfBlob = await pdf(MyDocument).toBlob();
    return pdfBlob;
  };
  

  const handlePdfSubmit = async () => {
    if (!caption.trim()) return alert('Caption cannot be empty.');
    if (!editorContent.trim()) return alert('PDF content cannot be empty.');
  
    try {
      const translatedContent = await getTranslation(editorContent);
      const geminiTranslation = translatedContent.response.candidates[0].content.parts[0].text;
      const pdfBlob = await generatePdfFromContent(geminiTranslation);
      console.log('PDF Blob:', pdfBlob);
  
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('content', editorContent);
      formData.append('user', _id);
      formData.append('transparency', transparency);
      formData.append('file', pdfBlob, `${caption}.pdf`);
  
      await axiosSecure.post('http://localhost:3000/api/v1/pdf/create-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      setEditorContent('');
      setCaption('');
      setTransparency('public');
      Swal.fire('Success!', 'PDF created successfully.', 'success');
  
      const res = await axiosSecure.get('http://localhost:3000/api/v1/pdf');
      setPdfs(res.data.data);
  
      await axiosSecure.patch(`http://localhost:3000/api/v1/user/${id}`, {
        totalPdf: totalPdf + 1,
      });
    } catch (error) {
      console.error('Error creating PDF:', error);
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
