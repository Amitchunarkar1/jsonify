import { FunctionalComponent as FC } from "preact";
import { Box, Container, Typography, TextareaAutosize } from "@mui/material";
import { useState, useRef } from "preact/hooks";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import ReactJson from "react-json-view";
import Button from "./components/button/button";
import "./app.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
SyntaxHighlighter.registerLanguage("json", json);

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Customize primary color
    },
    secondary: {
      main: "#f48fb1", // Customize secondary color
    },
    background: {
      default: "#121212", // Customize default background color
      paper: "#212121", // Customize paper background color
    },
    text: {
      primary: "#ffffff", // Customize primary text color
      secondary: "#bdbdbd", // Customize secondary text color
    },
    // You can add more customization options as needed
  },
});

// interface HTMLInputElementEvent extends Event {
//   target: HTMLInputElement & EventTarget;
// }

const CollapsibleJSONViewer: FC<{ jsonData: string }> = ({ jsonData }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <div>
      <div className="button-group">
        <button onClick={toggleCollapsed} className="mb-1">
          {collapsed ? "Expand" : "Collapse"}
        </button>
        <button
          onClick={toggleFullScreen}
          className={`mb-1 ${fullScreen ? "mb-1 full-screen-button" : ""}`}
        >
          {fullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
      </div>
      {!collapsed && (
        <div className={`json-container ${fullScreen ? "full-screen" : ""}`}>
          <ReactJson src={JSON.parse(jsonData)} theme="shapeshifter" />
        </div>
      )}
    </div>
  );
};

const Home: FC = () => {
  const [jsonData, setJsonData] = useState<string>("");
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const jsonViewerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: any) => {
    setJsonData(event.target.value);
    setError(null);
  };

  const formatJson = (data: string) => {
    try {
      if (jsonData == "") {
        setError("Please Enter Something...");
      }
      const formattedJson = JSON.stringify(JSON.parse(data), null, 2);
      return formattedJson;
    } catch (error) {
      setError("Invalid JSON format");
      return data;
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData("text/plain") ?? "";
    const formattedJson = formatJson(pastedText);
    setJsonData(formattedJson);
    handleCopy();
    if (jsonViewerRef.current) {
      // jsonViewerRef.current.scrollIntoView({ behavior: 'smooth' });
      const offset = 10; // Adjust offset value as needed
      const topOffset =
        jsonViewerRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        offset;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const handleCopy = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand("copy");
    }
  };

  // const searchJson = () => {

  // };

  const handleFilter = (key: string) => {
    console.log("key", key);
  };

  const handleNavigation = (section: string) => {
    console.log("section", section);
  };

  const handleLoadURL = async (url: string) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setJsonData(formatJson(JSON.stringify(json)));
      setError(null);
    } catch (error) {
      setError("Error loading JSON from URL");
    }
  };

  // const exportJson = () => {
  //   // Implement export functionality here
  // };

  const btnData = [
    { title: "Format JSON", event: formatJson },
    { title: "Copy to Clipboard", event: handleCopy },
    { title: "Search", event: handleInputChange },
    { title: "Filter", event: handleFilter },
    { title: "Navigate", event: handleNavigation },
    { title: "Load from URL", event: handleLoadURL },
  ];

  const { background, text } = theme.palette;

  return (
    <ThemeProvider theme={theme}>
      <Typography variant="h2">JSONIFY</Typography>
      <Container maxWidth="100%" style={{ height: "100vh", display: "flex" }}>
        <Box className="main_section row" style={{ flex: 1 }}>
          <Box className="tool_box col-lg-6" style={{ width: "50%" }}>
            <TextareaAutosize
              ref={textAreaRef}
              value={jsonData}
              onInput={handleInputChange}
              onPaste={handlePaste}
              placeholder="Enter Json Data"
              style={{
                width: "98%",
                height: "80vh",
                padding: "10px",
                fontSize: "16px",
                border: `1px solid ${background.default}`,
                borderRadius: "5px",
                resize: "none",
                backgroundColor: background.paper,
                color: text.primary,
              }}
            />
            <div className="btn-box">
              {btnData.map((items) => (
                <Button title={items.title} onClick={items.event} />
              ))}
            </div>
          </Box>
          <Box className="tool_box col-lg-6" style={{ width: "50%" }}>
            {error && <Typography style={{ color: "red" }}>{error}</Typography>}
            <Box
              ref={jsonViewerRef}
              className="json-box"
              style={{
                minHeight: "80vh",
              }}
            >
              {jsonData && <CollapsibleJSONViewer jsonData={jsonData} />}
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
