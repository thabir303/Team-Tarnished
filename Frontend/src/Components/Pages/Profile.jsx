import { useParams } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import PdfCard from "./PdfCard";

const Profile = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [caption, setCaption] = useState("");
  const [transparency, setTransparency] = useState("public");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosSecure.get(`http://localhost:3000/api/v1/user/${id}`);
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    const fetchPdfs = async () => {
      try {
        const res = await axiosSecure.get(`http://localhost:3000/api/v1/pdf`);
        setPdfs(res.data.data);
      } catch (err) {
        console.error("Failed to fetch PDFs:", err);
      }
    };

    fetchUserData();
    fetchPdfs();
  }, [axiosSecure, id]);

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.warn("Web Speech API not supported");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setEditorContent(prev => prev + transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handlePdfSubmit = async () => {
    if (!caption.trim() || !editorContent.trim()) {
      alert("Caption and content are required");
      return;
    }

    try {
      const payload = {
        content: editorContent,
        user: user._id,
        transparency
      };

      await axiosSecure.post("http://localhost:3000/api/v1/pdf/create-pdf", payload);
      
      const updatedPdfs = await axiosSecure.get("http://localhost:3000/api/v1/pdf");
      setPdfs(updatedPdfs.data.data);

      await axiosSecure.patch(`http://localhost:3000/api/v1/user/${id}`, {
        totalPdf: (user.totalPdf || 0) + 1
      });

      setEditorContent("");
      setCaption("");
      setTransparency("public");
    } catch (error) {
      console.error("Error creating PDF:", error);
      alert("Failed to create PDF. Please try again.");
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {user.photo && (
            <img 
              src={user.photo} 
              alt={user.name} 
              className="w-32 h-32 rounded-full object-cover shadow-md"
            />
          )}
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex gap-4 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {user.role}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {user.totalPdf || 0} PDFs
              </span>
            </div>
          </div>
        </div>
      </div>

      {user && id === user._id && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Create New PDF</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter caption"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Visibility</label>
              <select
                value={transparency}
                onChange={(e) => setTransparency(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <Editor
              apiKey="6qm56tt07vwxfxp49ag0k9amhh4kii4ehi5ofx7k8zwr22kg"
              value={editorContent}
              init={{
                height: 400,
                menubar: false,
                plugins: ["link", "lists", "code"],
                toolbar: "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code",
                skin: "oxide",
                content_css: "default",
              }}
              onEditorChange={content => setEditorContent(content)}
            />

            <div className="flex gap-4">
              <button
                onClick={handleVoiceInput}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {isListening ? "Stop Recording" : "Start Voice Input"}
              </button>

              <button
                onClick={handlePdfSubmit}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Create PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Published PDFs</h2>
        {pdfs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs
              .filter(pdf => pdf.user._id === id && pdf.Transparency !== "private")
              .map(pdf => (
                <PdfCard key={pdf._id} pdf={pdf} />
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No PDFs published yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;