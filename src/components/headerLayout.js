import React, {useRef, useState, useEffect} from "react";
import {Link} from "gatsby";
import clsx from "clsx";
import "./headerLayout.css";

// ( Another couple of things should be implemented now.
// ( 1. DONE The appearing of the navbar when randomly scrolling up, should be an animation.
// ( 2. DONE The buttons on the navbar should lead to different pages.
// ( 3. DONE The navbar + banner should be encapsulated in a Header component.
// ( 4. Make the transition smooth, by making the calculation of header space smooth.
// (    (It is not smooth yet)
// ( 5. Separate banner and navbar and css in this file.

// ( This mechanism is going to be placed where?
// ( Is it apropriate to put it on a page-layout component, that is called on
// ( different pages?

const HeaderLayout = () => {

    const refBanner = useRef(null);
    const refNavbar = useRef(null);
    const ref = useRef(null);

    // ( Variáveis são utilizadas para implementar um mecanismo que só faz com que
    // ( a barra de navegação apareça quando se escrola uma determinada quantidade
    // ( para cima. Em contraste com a implementação trivial onde só de escrolar minimamente
    // ( para cima, o navbar já aparece.
    const [previousScrollOffset, setPreviousScrollOffset] = useState(0);
    const [scrollAccumulator, setScrollAccumulator] = useState(0);
    const [isScrollingDown, setIsScrollingDown] = useState(false);

    const [activeFixedNavbar, setActiveFixedNavbar] = useState(false);

    // ( This state tells wether the window is scrolled outside of the header area or not.
    const [onHeader, setOnHeader] = useState(true);

    const handleScroll = () => {
	// ( Okay, aqui há um grande probleminha.. A altura do banner+navbar não corresponde certinho
	// ( ao que foi scrollado porque tem margens e tal... Por enquanto vou simplesmente adicionar uns
	// ( pixels a mais para contar como a margem. mas não será certinho...
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
	// ( Neste caso, o callback function tem de ser adicionado no window em todas as
	// ( renderizações. Caso contrário, o estado acessado dentro no callback será apenas
	// ( estado inicial do primeiro render.
	// ( https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state

	window.addEventListener("scroll", handleScroll);
	return () => window.removeEventListener("scroll", handleScroll);
    });

    const refBannersText = useRef(null);

    // ( the transition when getting on header area, while fixed navbar is shown is not smooth yet because
    // ( the calculation of the header area is not 100% yet.
    return (
	// (find-odecamsoilfile "src/pages/style.css")
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
	</>
    )
}

export default HeaderLayout;

export const Head = () => <title>Home Page</title>
