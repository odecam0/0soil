import React, {useRef, useState, useEffect} from "react";
import {Link} from "gatsby";
import clsx from "clsx";
import "./headerLayout.css";

const HeaderLayout = () => {

    const refBanner = useRef(null);
    const refNavbar = useRef(null);
    const ref = useRef(null);

    const [previousScrollOffset, setPreviousScrollOffset] = useState(0);
    const [scrollAccumulator, setScrollAccumulator] = useState(0);
    const [isScrollingDown, setIsScrollingDown] = useState(false);

    const [activeFixedNavbar, setActiveFixedNavbar] = useState(false);

    const [onHeader, setOnHeader] = useState(true);

    const handleScroll = () => {
	// const headerHeight = 50 + refBanner.current.offsetHeight + refNavbar.current.offsetHeight;
	const headerHeight = ref.current.offsetHeight;

	const scrollOffset = window.pageYOffset;
	const deltaScrollOffset = scrollOffset - previousScrollOffset;

	if (deltaScrollOffset > 0) {
	    if (!isScrollingDown) {
		setIsScrollingDown(true);
		setScrollAccumulator(deltaScrollOffset);
	    } else
		setScrollAccumulator(scrollAccumulator + deltaScrollOffset);
	} else if (deltaScrollOffset < 0) {
	    if (isScrollingDown) {
		setIsScrollingDown(false);
		setScrollAccumulator(deltaScrollOffset);
	    } else
		setScrollAccumulator(scrollAccumulator + deltaScrollOffset);
	}
	setPreviousScrollOffset(scrollOffset);

	if (scrollOffset < headerHeight) {
	    setActiveFixedNavbar(false);
	    setOnHeader(true);
	}
	else {
	    setOnHeader(false);
	    if (scrollAccumulator < 30)
		setActiveFixedNavbar(true)
	    else if (scrollAccumulator > 0)
		setActiveFixedNavbar(false)
	}

    }

    useEffect(() => {

	window.addEventListener("scroll", handleScroll);
	return () => window.removeEventListener("scroll", handleScroll);
    });

    const refBannersText = useRef(null);

    return (

	<>
	    <div className="banner&navbarContainer" ref={ref} >
		<div className="banner" ref={refBanner}>
		    <span className="bannerText" ref={refBannersText}>0'Soil</span>
		</div>
		<div className={clsx("fixedNavbar", !onHeader && "activeTransitionFixedNavbar", !activeFixedNavbar && "hideFixedNavbar")} >
		    <Link to="/" className="navbutton">
			About
		    </Link>
		    <Link to="/skills" className="navbutton">
			Skills
		    </Link>
		    <Link to="/projects" className="navbutton">
			Projects
		    </Link>
		</div>
		<div className="navbar" ref={refNavbar} >
		    <Link to="/" className="navbutton">
			About
		    </Link>
		    <Link to="/skills" className="navbutton">
			Skills
		    </Link>
		    <Link to="/projects" className="navbutton">
			Projects
		    </Link>
		</div>
	    </div>
	    <div style={{height: "200vh"}}/>
	</>
    )
}

export default HeaderLayout;

export const Head = () => <title>Home Page</title>
