import React, { useRef, useEffect } from "react";
import "./Editor.css";
import { Editor as Ed } from '@monaco-editor/react';
import { FaCode } from "react-icons/fa";

const Editor = () => {
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
                <FaCode />
                Code
            </div>
            <div className="editor-editor" ref={editorContainerRef}>
                <Ed
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    defaultValue="// Write Code Here"
                    className="editor-monaco"
                    onMount={handleEditorDidMount}
                />
            </div>
        </div>
    );
};

export default Editor;
