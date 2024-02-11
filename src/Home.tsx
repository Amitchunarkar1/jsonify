import { h, FunctionalComponent } from "preact";
import { useState, useRef } from "preact/hooks";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactJson from 'react-json-view';

SyntaxHighlighter.registerLanguage('json', json);

interface HTMLInputElementEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

const CollapsibleJSONViewer: FunctionalComponent<{ jsonData: string }> = ({ jsonData }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };


  return (
    <div>
      <button onClick={toggleCollapsed} className="mb-1">{collapsed ? "Expand" : "Collapse"}</button>
      {!collapsed && (
        <ReactJson src={JSON.parse(jsonData)} 
        theme="shapeshifter"         
        />
      )}
    </div>
  );
};

const Home: FunctionalComponent = () => {
  const [jsonData, setJsonData] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const jsonViewerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: any) => {
    setJsonData(event.target.value);
    setError(null);
  };

  const formatJson = (data: string) => {
    try {
      const formattedJson = JSON.stringify(JSON.parse(data), null, 2);
      return formattedJson;
    } catch (error) {
      setError("Invalid JSON format");
      return data;
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData("text/plain") ?? '';
    const formattedJson = formatJson(pastedText);
    setJsonData(formattedJson);
    handleCopy();  
    if (jsonViewerRef.current) {
      // jsonViewerRef.current.scrollIntoView({ behavior: 'smooth' });
      const offset = 10; // Adjust offset value as needed
      const topOffset = jsonViewerRef.current.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }    
  };

  const handleCopy = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand("copy");
    }
  };

  const searchJson = () => {
  


  };

  const filterJson = (key: string) => {
    // Implement filtering functionality here
  };

  const navigateToSection = (section: string) => {
    // Implement navigation functionality here
  };

  const loadFromURL = async (url: string) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setJsonData(formatJson(JSON.stringify(json)));
      setError(null);
    } catch (error) {
      setError("Error loading JSON from URL");
    }
  };

  const exportJson = () => {
    // Implement export functionality here
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h2>JSONIFY</h2>
      <textarea
        ref={textAreaRef}
        value={jsonData}
        onInput={handleInputChange}
        onPaste={handlePaste}
        style={{
          width: "95%",
          height: "200px",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          resize: "none",
        }}
      ></textarea>
      <div className="btn-box" >
        <button onClick={() => setJsonData(formatJson(jsonData))}>Format JSON</button>
        <button onClick={handleCopy}>Copy to Clipboard</button>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm((event.target as HTMLInputElement).value ?? '')}
          placeholder="Search"
        />
        <button onClick={searchJson}>Search</button>
        <button onClick={() => filterJson("key")}>Filter</button>
        <button onClick={() => navigateToSection("section")}>Navigate</button>
        <button onClick={() => loadFromURL("url")}>Load from URL</button>
        <button onClick={exportJson}>Export</button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div ref={jsonViewerRef} className="json-box" >
        {jsonData && <CollapsibleJSONViewer jsonData={jsonData} />}
      </div>
    </div>
  );
};

export default Home;
