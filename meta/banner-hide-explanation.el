;; (crtm-convert-buffer "../static/posts/first_post.md")

;; remote_repo: https://github.com/odecam0/0soil
;; commit_hash: 872e18b9158907b075235f026f7100618bd74328

;; START

;; Este arquivo irá descrever o simples mecanismo implementado em React para exibir condicionalmente
;; uma segunda barra de navegação fixa no topo da tela caso a tela esteja sendo escrolada para cima,
;; e a primeira barra de navegação não esteja visível.


;; É preciso saber qual o tamanho do header da página (banner + barra de navegação), para que nesta
;; região, a segunda barra de navegação não seja exibida.
;; Aqui resolvi descobrir este tamnho dinâmicamente em tempo de execução.
;; Para isso o hook useRef do React foi utilizado.

;; Refs são passados para os componentes do banner, da barra de navegação, e o div que engloba os dois
(find-0soilcfile "headerLayout.js" "const ref" '(mp))
(find-0soilcfile "headerLayout.js" "<>" '(mus "</>"))
;; para que seus tamanhos sejam recuparado em tempo de execução
(find-0soilcfile "headerLayout.js" "const headerHeight = ref.current.offsetHeight;" '(mp))


;; Alguns valores são utilizados para controlar o scroll da página.
;; Temos acesso ao quanto da página já foi escrolado de cima para baixo, como uma distância do topo
;; da página.
(find-0soilcfile "headerLayout.js" "const scrollOffset = window.pageYOffset;" '(ml))
(find-0soilcfile "headerLayout.js" "const [previousScrollOffset, setPreviousScrollOffset]" '(mp))
;; - privousScrollOffset é utilizado para, em um evento de scroll, saber o quanto foi escrolado, e
;;   para qual direção, comparando a altura atual, com a altura anterior.
;; - scrollAccumulator é utilizado para calcular o quanto foi escrolado contínuamente na mesma
;;   direção, acumulando o quanto foi escrolado em diferentes eventos consecutivos de scroll,
;;   desde que sejam na mesma direção.
;; - isScrollingDown indica a direção em que a tela tem sido escrolada nos últimos eventos.


;; A função handleScroll é utilizada como callback para um evento de scroll no objeto window.
;; Esta função é adicionada como callback utilizando o hook useEffect do React, sendo adicionada
;; e removida em cada render do componente, para que possa acessar os estados do componente
;; corretamente
;; 
;; https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state
(find-0soilcfile "headerLayout.js" "useEffect(()" '(mus "});"))


;; No callback é implementada a lógica que determina em que direção está ocorrendo o scroll, se
;; chegou a escrolar o suficiente para que se exiba ou não a barra de navegação fixa, e se está
;; na região onde a primeira barra está sendo exibida ou não..

;; Em primeiro lugar, a quantidade que foi escrolada durante este evento de scroll é calculada.
(find-0soilcfile "headerLayout.js" "const scrollOffset =" '(mp))

;; Em seguida, deltaScrollOffset é utilizado para determinar a direção deste evento de scroll.
;; Um deltaScrollOffset positivo indica que o scroll foi realizado para baixo.
;; Neste caso, verifica-se se os eventos de scroll anterioes também foram para baixo, caso tenham sido
;; , adciona-se o quanto foi escrolado neste evento, ao acumulador. Caso contrário, informa o componente
;; que este scroll foi feito para cima, e reseta o acumulador para possuir apenas o valor do scroll atual.
(find-0soilcfile "headerLayout.js" "deltaScrollOffset > 0" '(mus "scrollAccumulator + deltaScrollOffset"))

;; Caso deltaScrollOffset seja negativo, realizamos o mesmo procedimento na direção inversa.
(find-0soilcfile "headerLayout.js" "deltaScrollOffset < 0" '(mus "scrollAccumulator + deltaScrollOffset"))

;; Em seguida informamos ao componente em altura o scroll deixou a tela neste evento.
(find-0soilcfile "headerLayout.js" "	setPreviousScrollOffset(scrollOffset);" '(ml))

;; Por último, checa-se o caso de o primeiro navbar estar sendo exibido comparando a offset atual
;; (altura), com o tamanho do header, descoberto dinamicamente. Caso esteja, são atribuidos valores
;; à dois estados do componente que refletem esta situação.
;;
;; Estes valores são utilizados no JSX retornado por este componente para determinar quais elementos
;; serão renderizados.
(find-0soilcfile "headerLayout.js" "scrollOffset < headerHeight" '(mus "}"))

;; Caso não esteja exibindo a primeira barra de navegação, checa-se o valor do acumulador, se for
;; menor que 30, significa que foi escrolado 30 unidades para cima. Então deve exibir a segunda
;; barra de navegação. Caso contrário, deve escondela.
(find-0soilcfile "headerLayout.js" "scrollOffset < headerHeight" "else" '(mus "}"))


;; Utilizando os estados descritos acima, e a ferramenta 'clsx', atribuo condicionalmente classes
;; para o elemento html da segunda barra de navegação.
(find-0soilcfile "headerLayout.js" "className={clsx" '(ml))

;; Caso não esteja exibindo a primeira barra de navegação, ou seja, onHeader seja falso,
;; atribuisse a seguinte classe ao elemento, que define uma animação de translação.
(find-0soilcfile "headerLayout.css" ".activeTransitionFixedNavbar" '(mp))

;; Caso a segunda barra não deva ser exibida, a classe hideFixedNavbar é atribuida ao elemento.
;; Efetivamente ela move a barra de navegação para além da margem superior da tela.
;; Como é definida uma animação encima da operação 'translate', ocorre uma animação.
(find-0soilcfile "headerLayout.css" ".hideFixedNavbar" '(mp))

;; Aqui está a classe principal do elemento:
(find-0soilcfile "headerLayout.css" ".fixedNavbar" '(mp))
