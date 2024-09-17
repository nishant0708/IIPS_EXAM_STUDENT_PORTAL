import React from "react";
import PropTypes from "prop-types";
import "./Test.css";
import { IoCheckmarkDone } from "react-icons/io5";

const Test = ({ output }) => {
    return (
        <div className="compiler-test">
            <div className="test-header">
                <IoCheckmarkDone />
                Test Output
            </div>
            <div className="test-output">
              {output}
            </div>
        </div>
    );
};

// Define prop types for the Test component
Test.propTypes = {
    output: PropTypes.string.isRequired,  // Ensure 'output' is a required string
};

export default Test;
