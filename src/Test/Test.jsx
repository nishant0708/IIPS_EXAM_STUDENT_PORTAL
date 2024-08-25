import React from "react";
import "./Test.css";
import { IoCheckmarkDone } from "react-icons/io5";

const Test=()=>
{
    return(
        <>
        <div className="compiler-test">
            <div className="test-header">
                <IoCheckmarkDone />
                Test
            </div>
        </div>
        </>
    );
}

export default Test;