import { FunctionalComponent as FC } from "preact";
import { useState, useRef } from "preact/hooks";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import ReactJson from 'react-json-view';
import Button from "./components/button/button";
import './app.css'
SyntaxHighlighter.registerLanguage('json', json);

// interface HTMLInputElementEvent extends Event {
//   target: HTMLInputElement & EventTarget;
// }

const CollapsibleJSONViewer: FC <{ jsonData: string }> = ({ jsonData }) => {
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

const Home: FC  = () => {
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
      if(jsonData == '') {
        setError('Please Enter Something...')
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

  const exportJson = () => {
    // Implement export functionality here
  };

  const btnData = [
    {'title':'Format JSON',  'event' : formatJson},
    {'title':'Copy to Clipboard',  'event' : handleCopy},
    {'title':'Search',  'event' : handleInputChange},
    {'title':'Filter',  'event' : handleFilter},
    {'title':'Navigate',  'event' : handleNavigation},
    {'title':'Load from URL',  'event' : handleLoadURL},
  ];

  return (
    <div className='container'>
      <h2>JSONIFY</h2>


      <div className='main_section row'>
        <div className='tool_box col-lg-6'>
          <textarea ref={textAreaRef} value={jsonData} onInput={handleInputChange}
            onPaste={handlePaste}  placeholder='Enter Json Data' style={{
              width: "98%",
              height: "400px",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              resize: "none",
            }}
          ></textarea>
          <div className="btn-box" >
            {/* Button Rendering */}
            {
              btnData.map((items) => <Button title={items.title} onClick={items.event} /> )
            }
          </div>
        </div>
        <div className='response_box  col-lg-6'>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div ref={jsonViewerRef} className="json-box" >
              <code >
               {jsonData && <CollapsibleJSONViewer jsonData={jsonData} />}

              </code>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
