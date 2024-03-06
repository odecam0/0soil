;; ---
;; title: Helpfull Overlays
;; slug: helpfull_overlays
;; sexps: |
;;     (debug-on-entry 'crtm-convert-buffer)
;;     (cancel-debug-on-entry 'crtm-convert-buffer)
;;     (crtm-convert-buffer "../static/posts/second_post.md")
;;     (find-file           "../static/posts/second_post.md")
;; ---

;; # Helpfull Overlays

;; É um código em emacs-lisp que me auxilia a me manter ciente do contexto em que algo está inserido.
;; Me auxilia com minha dificuldade associada à pouca memória de trabalho.


;; ## Funciona assim:
;; Conforme vou desenvolvendo, acumulo links para trechos relevantes dos arquivos que estou modificando,
;; armazenando-os em arquivos que passei a chamar de meta-arquivos.
;; Estes links são armazenados junto de textos que explicam ou dão algum contexto para os links.

;; Os armazeno de forma que ficam agrupados. Então em um mesmo meta-arquivo, podem existir N grupos diferentes
;; de links, cada grupo com uma quantidade diferente de links misturados com texto comum.


;; ## Possuo uma séria de funções que auxiliam a interagir com o meta-arquivo

;; ### Habilitando um meta-arquivo
;; Há uma variável que indica qual o meta-arquivo que está sendo utilizado no momento.
(find-metafile "meta-file-double-link.el" "defvar _mc-current-meta-file" 0 '(mp))

;; Há um arquivo especial que contém referências para diversos meta-arquivos. É como um meta-meta-arquivo.
;; E existem funções para ativar meta-arquivos a partir do meta-meta-arquivo.
(find-metadefun "overlay-meta-file.el" "brnm-activate-meta-file" '(mp))

;; ### Follow link convention
;; A função 'brnm-activate-meta-file' segue uma convenção definida em 'brnm-find-element-in-nth-paragraph'.
;; Onde endereços numéricos são atribuídos aos links pertencentes aos diferentes grupos.
(find-metadefun "meta-file-double-link.el" "brnm-find-element-in-nth-paragraph"    '(mp 4))
;; O primeiro link do primeiro grupo está associado tanto ao número 1, quanto ao número 100.
;; O segundo link do primeiro grupo está associado ao número                            101.
;; O sexto link do primeiro grupo está associado ao número                              105.
;; O segundo link do segundo grupo está associado ao número                             201.
;; E assim por diante.
 
;; É desta maneira que indico qual meta-arquivo presente no meta-meta-arquivo quero habilitar com o comando 'brnm-activate-meta-file'.
;; Escrevo o endereço numérico associado ao link, e executo o comando.

;; Com um meta-arquivo habilitado, as seguintes funções auxiliam-me a interagir com ele: 

;; ### Inserindo links no meta-arquivo
(find-metadefun "overlay-meta-file.el" "brnm-insert-link-in-position-in-meta-file" '(mp))
(find-metadefun "overlay-meta-file.el" "brnm-insert-string-in-nth-position"        '(mp))
;; Com essas funções, ao selecionar uma região, escrever um endereço numérico, e executar a segunda função,
;; um link para aquela região é inserido na posição correta do meta-arquivo.


;; ### Acessando um link por sua posição
(find-metadefun "meta-file-double-link.el" "mc-meta-file-follow-link" '(mp))
(find-metadefun "meta-file-double-link.el" "mc-meta-file-follow-link-generic" '(mpdbl))
;; Estas duas funções permitem que, ao escrever o endereço numérico de um link, e executando a
;; primeira função, o link apropriado seja acessado.

;; As funções são implementadas de forma que, caso não seja fornecido o endereço numérico, a próprio
;; meta-arquivo seja acessado, na posição do último link que foi acessado. Dessa forma se quero acessar
;; o texto com o contexto do link na posição 302, eu escrevo o endereço numérico 302, e executo o
;; comando duas vezes.

;; ### Ciclando entre links de um mesmo grupo
(find-metadefun "overlay-meta-file.el" "brnm-cycle-meta-groups-links" '(mpdbl))
;; Esta função acessa o próximo link pertencente ao mesmo grupo do último link acessado.
;; Caso o último link acessado sejam o último link do grupo, acessa o primeiro link do grupo.
;; Efetivamente executando esta função repetidas vezes, estará passando por todos os links do grupo
;; repetidas vezes.


;; ### Agora o tal do Helpful Overlay
(find-metafile "overlay-meta-file.el" "brnm-helpfull-overlays" '(mp))
;; Esta função faz uso de outras duas funções, para acessar cada link presente no meta-arquivo e
;; adicionar um overlay em cada trecho que está sendo apontado pelos links, adicionado um sublinhado
;; com uma cor que indica pertencimento a um grupo de links, e o endereço ao lado numa fonte menor.

;; Desta forma, se estou em um arquivo e quero saber onde neste arquivo é possível que haja um contexto
;; no meta-arquivo, posso acionar esta função, e os pontos que são abordados pelo meta-arquivo aparecem
;; sublinhados de cores diferentes, e posso acessar o contexto escrevendo o endereço numérico que há
;; ao lado da região sublinhada.


;; As duas funções que permitem que isso ocorra são 'brnm-put-overlay-trough-sexp-and-number-position'
;; e 'brnm-get-regexp-positions-numbered'.

(find-metadefun "overlay-meta-file.el" "brnm-get-regexp-positions-numbered" '(mp 5))
;; Esta função gera uma estrutura de dados com uma lista de pares. Onde cada par contém um link
;; e uma posição numérica.

(find-metadefun "overlay-meta-file.el" "brnm-put-overlay-trough-sexp-and-number-position" '(mp 3))
;; Esta função recebe um par com um link e um número, acessa o link, e baseado no número, aplica um
;; overlay com um sublinhado de alguma cor, e com o número adicionado à direita da string que está
;; sendo apontada pelo link.

(find-metadefun "overlay-meta-file.el" "brnm-iterate-over-list-of-sexps-with-number-position" '(mp))
;; Esta função simplesmente aplica a segunda função acima, em cada elemento do resultado da primeira
;; função acima.



