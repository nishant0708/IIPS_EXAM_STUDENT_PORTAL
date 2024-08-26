import React from "react";
import { FaPlay } from "react-icons/fa6";
import { FcUpload } from "react-icons/fc";
import { CgSandClock } from "react-icons/cg";
import "./Navbar.css";
const Navbar=()=>
{
    return(
        <>
        <div className="navbar">
            <div className="navbar-left-margin navbar-name">
                <div>IT-2k21-35</div>
                <div>Niko Vajradanti</div>
            </div>
            <div className="navbar-contents">
                <div className="navbar-run">
                    <FaPlay />
                    <p>Run</p>
                </div>
                <div className="navbar-submit">
                    <FcUpload />
                    <p>Submit</p>
                </div>
            </div>
            <div className="navbar-timer navbar-right-margin">
                <CgSandClock />
                <p>00 : 00 : 00</p>
            </div>
        </div>
        </>
    );
}
export default Navbar;