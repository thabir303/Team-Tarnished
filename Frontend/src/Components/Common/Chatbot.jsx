import { useState, useRef, useEffect, useContext } from "react";
import { Send, Upload, X, File, Sparkles, Trash2 } from "lucide-react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import TextToSpeech from "./TextToSpeech";
import { use } from "react";
import { AuthContext } from "../Authentication/AuthProvider";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dbuser, setUser] = useState(null);
  const [pdfs, setPdf] = useState(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const { user } = useContext(AuthContext);

  const axiosSecure = useAxiosSecure();

  const surpriseOptions = [
    "What are exoplanets and how are they discovered?",
    "What makes an exoplanet potentially habitable?",
    "How does the Habitable Exoplanet Observatory contribute to exoplanet research?",
    "What role does water play in determining if an exoplanet is habitable?",
    "What is the significance of the 'Goldilocks zone' when searching for habitable exoplanets?",
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    axiosSecure
      .get(`http://localhost:3000/api/v1/user?email=${user?.email}`)
      .then((res) => {
        setUser(res.data.data[0]);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [axiosSecure, user]);

  useEffect(() => {
    axiosSecure
      .get(`http://localhost:3000/api/v1/pdf`)
      .then((res) => {
        console.log(res.data.data);
        const pdfs = res.data.data.filter((pdf) => pdf.user?.email === user?.email);
        setPdf(pdfs);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [axiosSecure, user]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const closeChat = () => setIsChatOpen(false);

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  // const cleanResponse = (text) => text.replace(/[*]/g, "").trim();

  const getResponse = async () => {
    if (!value.trim() && !file) {
      setError("Please enter a question or upload a file!");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("prompt", value); // Add the prompt to the form data
      if (file) {
        formData.append("file", file); // Add the file if it exists
      }

      // Add user's message to the chat history immediately
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
          file: file ? URL.createObjectURL(file) : null,
        },
      ]);
      // Prepare the conversation context
      const conversationContext = chatHistory
        .map(
          (chatItem) =>
            `${chatItem.role === "user" ? "User" : "Bot"}: ${chatItem.parts}`
        )
        .join("\n");
      // Send request to backend
      const response = await axiosSecure.post(
        "http://localhost:3000/api/v1/chat/get-chat-response",
        {
          prompt: `${pdfs} ${conversationContext}\nUser: ${value}`,
          user: dbuser?._id,
        }
      );

      // Extract response from backend
      console.log(
        "response",
        response.data.data.response.candidates[0].content.parts[0].text
      );
      const backendResponse =
        response.data.data.response.candidates[0].content.parts[0].text;

      // Append backend's response to chat history
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "model",
          parts: backendResponse,
        },
      ]);

      setValue(""); // Clear the input
      setFile(null); // Clear the file
      setFileName(""); // Clear the file name
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    } catch (error) {
      console.error(error);
      setError(`Something went wrong! ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const validMimeTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "video/mp4",
      "video/x-matroska",
    ];
    const selectedFile = e.target.files[0];
    if (selectedFile && !validMimeTypes.includes(selectedFile.type)) {
      setError(
        "Invalid file format. Please upload a PDF, PNG, JPEG, MP4, or MKV file."
      );
      setFile(null);
      setFileName("");
    } else {
      setError("");
      setFile(selectedFile);
      setFileName(selectedFile ? selectedFile.name : "");
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
    setFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const dragChatWindow = (e) => {
    const chatWindow = chatWindowRef.current;
    const offsetX = e.clientX - chatWindow.offsetLeft;
    const offsetY = e.clientY - chatWindow.offsetTop;

    const handleMouseMove = (moveEvent) => {
      chatWindow.style.left = `${moveEvent.clientX - offsetX}px`;
      chatWindow.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8">
      {/* Chat Icon */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
        aria-label="Toggle chat"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden sm:bottom-28 sm:right-8 md:w-[448px] lg:w-[512px]"
          style={{ maxHeight: "calc(100vh - 100px)" }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <button
              onClick={surprise}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">Surprise Me</span>
            </button>
            <button
              onClick={closeChat}
              className="p-1.5 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat History */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {chatHistory.map((chatItem, index) => (
              <div
                key={index}
                className={`flex ${
                  chatItem.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    chatItem.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {chatItem.file && (
                    <img
                      src={chatItem.file}
                      alt="Uploaded file"
                      className="max-w-full rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm">{chatItem.parts || "No content"}</p>
                  {/* Add TextToSpeech button for model responses */}
                  {chatItem.role === "model" && (
                    <div className="mt-2">
                      <TextToSpeech text={chatItem.parts} lang="en-US" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={clear}
                  disabled={isLoading}
                  className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:text-gray-700"
                  aria-label="Clear chat"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => fileInputRef?.current?.click()}
                  disabled={isLoading}
                  className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:text-gray-700"
                  aria-label="Upload file"
                >
                  <Upload size={20} />
                </button>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all duration-200">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/png,image/jpeg,video/mp4,video/x-matroska"
                  onChange={handleFileChange}
                />
                <input
                  value={value}
                  placeholder="Ask me anything..."
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === "Enter" && getResponse()}
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
                />
                <button
                  onClick={getResponse}
                  disabled={isLoading}
                  className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 transform hover:scale-105 flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send size={20} className="transform rotate-45" />
                </button>
              </div>
            </div>

            {fileName && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                <File size={16} className="text-gray-500" />
                <span className="flex-1 truncate">{fileName}</span>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
