---
title: Hiding navbar based on scroll
slug: hiding_navbar_based_on_scroll
sexps: |
    (setq crtm-remote-repo-url "https://github.com/odecam0/0soil/")
    (crtm-convert-buffer "../static/posts/first_post.md")
---

Hiding navbar based on scroll
=============================

Este arquivo irá descrever o simples mecanismo implementado em React para exibir condicionalmente
uma segunda barra de navegação fixa no topo da tela caso a tela esteja sendo escrolada para cima,
e a primeira barra de navegação não esteja visível.

É preciso saber qual o tamanho do header da página (banner + barra de navegação), para que nesta
região, a segunda barra de navegação não seja exibida.
Aqui resolvi descobrir este tamnho dinâmicamente em tempo de execução.
Para isso o hook useRef do React foi utilizado.

Refs são passados para os componentes do banner, da barra de navegação, e o div que engloba os dois

[Source: headerLayout.js L8-L11](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L8-L11)
``` js
    const refBanner = useRef(null);
    const refNavbar = useRef(null);
    const ref = useRef(null);

```

[Source: headerLayout.js L66-L94](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L66-L94)
``` js
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
```

para que seus tamanhos sejam recuparado em tempo de execução

[Source: headerLayout.js L20-L23](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L20-L23)
``` js
    const handleScroll = () => {
	// const headerHeight = 50 + refBanner.current.offsetHeight + refNavbar.current.offsetHeight;
	const headerHeight = ref.current.offsetHeight;

```




Alguns valores são utilizados para controlar o scroll da página.
Temos acesso ao quanto da página já foi escrolado de cima para baixo, como uma distância do topo
da página.

[Source: headerLayout.js L24-L24](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L24-L24)
``` js
	const scrollOffset = window.pageYOffset;
```

[Source: headerLayout.js L12-L15](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L12-L15)
``` js
    const [previousScrollOffset, setPreviousScrollOffset] = useState(0);
    const [scrollAccumulator, setScrollAccumulator] = useState(0);
    const [isScrollingDown, setIsScrollingDown] = useState(false);

```

- privousScrollOffset é utilizado para, em um evento de scroll, saber o quanto foi escrolado, e
  para qual direção, comparando a altura atual, com a altura anterior.
- scrollAccumulator é utilizado para calcular o quanto foi escrolado contínuamente na mesma
  direção, acumulando o quanto foi escrolado em diferentes eventos consecutivos de scroll,
  desde que sejam na mesma direção.
- isScrollingDown indica a direção em que a tela tem sido escrolada nos últimos eventos.

A função handleScroll é utilizada como callback para um evento de scroll no objeto window.
Esta função é adicionada como callback utilizando o hook useEffect do React, sendo adicionada
e removida em cada render do componente, para que possa acessar os estados do componente
corretamente

https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state

[Source: headerLayout.js L56-L60](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L56-L60)
``` js
    useEffect(() => {

	window.addEventListener("scroll", handleScroll);
	return () => window.removeEventListener("scroll", handleScroll);
    });
```




No callback é implementada a lógica que determina em que direção está ocorrendo o scroll, se
chegou a escrolar o suficiente para que se exiba ou não a barra de navegação fixa, e se está
na região onde a primeira barra está sendo exibida ou não..

Em primeiro lugar, a quantidade que foi escrolada durante este evento de scroll é calculada.

[Source: headerLayout.js L24-L26](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L24-L26)
``` js
	const scrollOffset = window.pageYOffset;
	const deltaScrollOffset = scrollOffset - previousScrollOffset;

```

Em seguida, deltaScrollOffset é utilizado para determinar a direção deste evento de scroll.
Um deltaScrollOffset positivo indica que o scroll foi realizado para baixo.
Neste caso, verifica-se se os eventos de scroll anterioes também foram para baixo, caso tenham sido
, adciona-se o quanto foi escrolado neste evento, ao acumulador. Caso contrário, informa o componente
que este scroll foi feito para cima, e reseta o acumulador para possuir apenas o valor do scroll atual.

[Source: headerLayout.js L27-L32](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L27-L32)
``` js
	if (deltaScrollOffset > 0) {
	    if (!isScrollingDown) {
		setIsScrollingDown(true);
		setScrollAccumulator(deltaScrollOffset);
	    } else
		setScrollAccumulator(scrollAccumulator + deltaScrollOffset);
```

Caso deltaScrollOffset seja negativo, realizamos o mesmo procedimento na direção inversa.

[Source: headerLayout.js L33-L38](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L33-L38)
``` js
	} else if (deltaScrollOffset < 0) {
	    if (isScrollingDown) {
		setIsScrollingDown(false);
		setScrollAccumulator(deltaScrollOffset);
	    } else
		setScrollAccumulator(scrollAccumulator + deltaScrollOffset);
```

Em seguida informamos ao componente em altura o scroll deixou a tela neste evento.

[Source: headerLayout.js L40-L40](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L40-L40)
``` js
	setPreviousScrollOffset(scrollOffset);
```

Por último, checa-se o caso de o primeiro navbar estar sendo exibido comparando a offset atual
(altura), com o tamanho do header, descoberto dinamicamente. Caso esteja, são atribuidos valores
à dois estados do componente que refletem esta situação.
;;
Estes valores são utilizados no JSX retornado por este componente para determinar quais elementos
serão renderizados.

[Source: headerLayout.js L42-L45](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L42-L45)
``` js
	if (scrollOffset < headerHeight) {
	    setActiveFixedNavbar(false);
	    setOnHeader(true);
	}
```

Caso não esteja exibindo a primeira barra de navegação, checa-se o valor do acumulador, se for
menor que 30, significa que foi escrolado 30 unidades para cima. Então deve exibir a segunda
barra de navegação. Caso contrário, deve escondela.

[Source: headerLayout.js L46-L52](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L46-L52)
``` js
	else {
	    setOnHeader(false);
	    if (scrollAccumulator < 30)
		setActiveFixedNavbar(true)
	    else if (scrollAccumulator > 0)
		setActiveFixedNavbar(false)
	}
```




Utilizando os estados descritos acima, e a ferramenta 'clsx', atribuo condicionalmente classes
para o elemento html da segunda barra de navegação.

[Source: headerLayout.js L71-L71](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.js#L71-L71)
``` js
		<div className={clsx("fixedNavbar", !onHeader && "activeTransitionFixedNavbar", !activeFixedNavbar && "hideFixedNavbar")} >
```

Caso não esteja exibindo a primeira barra de navegação, ou seja, onHeader seja falso,
atribuisse a seguinte classe ao elemento, que define uma animação de translação.

[Source: headerLayout.css L24-L27](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.css#L24-L27)
``` css
.activeTransitionFixedNavbar {
    transition: translate .5s;
}

```

Caso a segunda barra não deva ser exibida, a classe hideFixedNavbar é atribuida ao elemento.
Efetivamente ela move a barra de navegação para além da margem superior da tela.
Como é definida uma animação encima da operação 'translate', ocorre uma animação.

[Source: headerLayout.css L28-L31](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.css#L28-L31)
``` css
.hideFixedNavbar {
    translate: 0 -100%;
}

```

Aqui está a classe principal do elemento:

[Source: headerLayout.css L6-L23](https://github.com/odecam0/0soil/blob/936bb3117016762b32b3b464ad2d3a990ce35014/src/components/headerLayout.css#L6-L23)
``` css
.fixedNavbar {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    align-content: center;
    padding: .2rem;
    gap:     .2rem;
    border: #1b2e1a;
    border-style: solid;
    border-width: 2px;
    align-content: stretch;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 99%; 
    height: 2.7rem;
}

```

