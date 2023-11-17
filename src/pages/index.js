import React, {useRef, useState, useEffect} from "react"
import "./style.css"

// (defun eejump-2 () (interactive) (swiper "//\\W(\\W[0-9]"))

// ( 1.    HIDE-SHOW NAVBAR MECHANISM
// ( 1.1   GET HEIGHT OF NAVBAR + BANNER
// ( 1.2   ADD EVENT LISTENER TO SCROLL EVENT
// ( 1.2.1 IF scrolled up   && navbar not visible THEN show fixed navbar
// ( 1.2.2 IF scrolled down                       THEN hide fixed navbar

// ( This mechanism is going to be placed where?
// ( Is it apropriate to put it on a page-layout component, that is called on
// ( different pages?

const IndexPage = () => {

    const refBanner = useRef(null);
    const refNavbar = useRef(null);

    // ( Eu também quero que não seja ativado o mecanismo, a menos que tenha havido um scroll que passe
    // ( de algum limiar definido. 
    const [previousScrollOffset, setPreviousScrollOffset] = useState(0);
    const [scrollAccumulator, setScrollAccumulator] = useState(0);
    const [isScrollingDown, setIsScrollingDown] = useState(false);

    const [activeFixedNavbar, setActiveFixedNavbar] = useState(false);

    // ( Okay, algo está acontecendo aqui. Acho que talvez não possa utilizar os react states
    // ( dentro de um eventlistener como este daqui, pois as variáveis não estão atualizando lá
    // ( no console.
    const handleScroll = () => {
	// ( Okay, aqui há um grande probleminha.. A altura do banner+navbar não corresponde certinho
	// ( ao que foi scrollado porque tem margens e tal... Por enquanto vou simplesmente adicionar uns
	// ( pixels a mais para contar como a margem. mas não será certinho...
	const headerHeight = 50 + refBanner.current.offsetHeight + refNavbar.current.offsetHeight;
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
		setScrollAccumulator(scrollAccumulator + (deltaScrollOffset));
	}
	setPreviousScrollOffset(scrollOffset);

	if (scrollOffset < headerHeight)
	    setActiveFixedNavbar(false)
	else if (scrollAccumulator < 30)
	    setActiveFixedNavbar(true)
	else if (scrollAccumulator > 0)
	    setActiveFixedNavbar(false)

    }

    useEffect(() => {
	// ( Neste caso, o callback function tem de ser adicionado no window em todas as
	// ( renderizações. Caso contrário, o estado acessado dentro no callback será apenas
	// ( estado inicial do primeiro render.
	// ( https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state

	window.addEventListener("scroll", handleScroll);
	return () => window.removeEventListener("scroll", handleScroll);
    });


    return (
	// (find-odecamsoilfile "src/pages/style.css")
	<div className="banner&navbarContainer" >
	    <div className="banner" ref={refBanner}/>
	    <div className="navbar" ref={refNavbar} style={activeFixedNavbar ?
							   {
							       position: "fixed",
							       top: "0px",
							       left: "0px",
							       width: "-webkit-fill-available"

							   } : {}}>
		<button className="navbutton">About</button>
		<button className="navbutton">Skills</button>
		<button className="navbutton">Projects</button>
	    </div>
	    <div style={{height: "200vh"}}/>
	</div>

    )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
