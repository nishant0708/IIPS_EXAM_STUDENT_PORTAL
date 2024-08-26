import React from "react";
import { MdReportProblem } from "react-icons/md";
import merge from "../assets/merge_ex1 1.png";
import "./Questions.css";
const Questions=()=>
{
    return(
        <>
        <div className="compiler-questions">
            <div className="questions-header">
                <MdReportProblem />
                Problem
            </div>
            <div className="questions-content">
                <div className="content-heading">
                    21. Merge Two Sorted Lists
                </div>
                <br/>
                <div className="content-body">
                You are given the heads of two sorted linked lists list1 and list2.
                Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.
                Return the head of the merged linked list.
                <br/><br/>
                Example 1
                <br/><br/>
                <img src={merge} alt="merge" className="questions-image"/>
                <br/><br/>
                Input List1 = [1,2,4], List2 = [1,3,4]
                <br/>
                Output List = [1,1,2,3,4,4]
                </div>
            </div>
        </div>
        </>
    );
}

export default Questions;