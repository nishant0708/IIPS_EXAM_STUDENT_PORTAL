import React from "react";
import "./Editor.css";
import {Editor as Ed} from '@monaco-editor/react';
import { FaCode } from "react-icons/fa";

const Editor=()=>
{
    return(
        <>
        <div className="compiler-editor">
            <div className="editor-header">
                <FaCode />
                Code
            </div>
            <div>
                <Ed theme="vs-dark" height="90vh" defaultLanguage="javascript" defaultValue="// Write Code Here"/>
            </div>
        </div>
        </>
    );
}

export default Editor;