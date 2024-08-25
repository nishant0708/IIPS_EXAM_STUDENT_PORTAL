import React from "react";
import "flex-splitter-directive"
import "flex-splitter-directive/styles.min.css"
import Questions from "../Questions/Questions";
import Editor from "../Editor/Editor";
import Test from "../Test/Test";
import "./Body.css";
const Body=()=>
{
    return(
        <>
        <div className="compiler-body" data-flex-splitter-horizontal>
            <Questions />
            <div role="separator" tabIndex="1"></div>
            <div className="body-contents" data-flex-splitter-vertical>
                <Editor />
                <div role="separator" tabIndex="1"></div>
                <Test />
            </div>
        </div>
        </>
    );
}
export default Body;