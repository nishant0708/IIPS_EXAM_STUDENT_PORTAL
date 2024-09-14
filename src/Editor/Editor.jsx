import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./Editor.css";
import { Editor as Ed } from "@monaco-editor/react";
import { FaCode } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";

const Editor = ({ question }) => {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        // Initial layout call
        editor.layout();
    };

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (editorRef.current) {
                editorRef.current.layout();
            }
        });

        if (editorContainerRef.current) {
            observer.observe(editorContainerRef.current);
        }

        // Cleanup on unmount
        return () => {
            if (editorContainerRef.current) {
                observer.unobserve(editorContainerRef.current);
            }
            observer.disconnect();
        };
    }, []);

    return (
        <div className="compiler-editor">
            <div className="editor-header">
                <div className="editor-code">
                    <FaCode/>
                    <div>Code</div>
                </div>
                <div className="editor-run">
                    <FaPlay size={15}/>
                    <div>Run</div>
                </div>
            </div>
            <div className="editor-editor" ref={editorContainerRef}>
                <Ed
                    theme="vs-dark"
                    defaultLanguage={question?.compilerReq}
                    defaultValue= "// Write Code Here"
                    className="editor-monaco"
                    onMount={handleEditorDidMount}
                />
            </div>
        </div>
    );
};

// Define prop types for the Editor component
Editor.propTypes = {
    question: PropTypes.shape({
        compilerReq: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string,
    }),
};

export default Editor;
