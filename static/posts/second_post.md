---
title: Helpfull Overlays
slug: helpfull_overlays
sexps: |
    (setq crtm-remote-repo-url "https://github.com/odecam0/.config-emacs-/")
    (crtm-convert-buffer "../static/posts/second_post.md")
    (find-file           "../static/posts/second_post.md")
---

# Helpfull Overlays

É um código em emacs-lisp que me auxilia a me manter ciente do contexto em que algo está inserido.
Me auxilia com minha dificuldade associada à pouca memória de trabalho.

## Funciona assim:
Conforme vou desenvolvendo, acumulo links para trechos relevantes dos arquivos que estou modificando,
armazenando-os em arquivos que passei a chamar de meta-arquivos.
Estes links são armazenados junto de textos que explicam ou dão algum contexto para os links.

Os armazeno de forma que ficam agrupados. Então em um mesmo meta-arquivo, podem existir N grupos diferentes
de links, cada grupo com uma quantidade diferente de links misturados com texto comum.

## Possuo uma séria de funções que auxiliam a interagir com o meta-arquivo

### Habilitando um meta-arquivo
Há uma variável que indica qual o meta-arquivo que está sendo utilizado no momento.

[Source: meta-file-double-link.el L11-L13](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/meta-file-double-link.el#L11-L13))
``` elisp
(defvar _mc-current-meta-file nil
  "Holds the path to the current meta-file.")

```

Há um arquivo especial que contém referências para diversos meta-arquivos. É como um meta-meta-arquivo.
E existem funções para ativar meta-arquivos a partir do meta-meta-arquivo.

[Source: overlay-meta-file.el L35-L47](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/overlay-meta-file.el#L35-L47))
``` elisp
(defun brnm-activate-meta-file (num)
  (interactive "P")
  "Acess the n'th sexp in the file held by brnm-index-to-meta-files-file variable,
   and sets it as the current meta-file.
  (find-evariable '_mc-current-meta-file)
  "
  (if (not num)
      (find-file brnm-index-to-meta-files-file)
    (save-window-excursion
      (mc-meta-file-follow-link-generic num brnm-index-to-meta-files-file)
      (mc-set-current-buffer-as-meta-file "")
      )))

```

### Follow link convention
A função 'brnm-activate-meta-file' segue uma convenção definida em 'brnm-find-element-in-nth-paragraph'.
Onde endereços numéricos são atribuídos aos links pertencentes aos diferentes grupos.

[Source: meta-file-double-link.el L88-L120](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/meta-file-double-link.el#L88-L120))
``` elisp
(defun brnm-find-element-in-nth-paragraph (num regexp)
  ()
  "Goes to the n'th paragraph separated by 2 blank lines, and the
   goes to the m'th element matched by regexp.

   Previou documentation, for previous, more specific, function:
    Receives a number prefix argument N. If N is less than 100, it follows the first link
    in the N'th group of links. If N is greater than 100, than the last 2 digits inform wich
    link in the group is going to be followed, and tha number to the left informs wich group.
    3 is equivalent to 300.
   "
  (if (= (point-max) 1)
      (insert " ")
    (goto-char (point-min))
    (if (< num 100)
	(progn
	  (setq paragraph-num num)
	  (setq link-num 0))
      (setq paragraph-num (/ num 100))
      (setq link-num (mod num 100)))

    (search-forward-regexp "\n\n+\n" nil t (- paragraph-num 1))
    
    (let (group-end-pos)
      (setq group-end-pos (+ 2 (save-excursion
			    (if (search-forward-regexp "\n\n+\n" nil 1)
				(match-beginning 0)
			      (point)))))
    (if (not (search-forward-regexp regexp
			   group-end-pos
			   t (+ link-num 1)))
	     (goto-char group-end-pos)))))

```

O primeiro link do primeiro grupo está associado tanto ao número 1, quanto ao número 100.
O segundo link do primeiro grupo está associado ao número                            101.
O sexto link do primeiro grupo está associado ao número                              105.
O segundo link do segundo grupo está associado ao número                             201.
E assim por diante.

É desta maneira que indico qual meta-arquivo presente no meta-meta-arquivo quero habilitar com o comando 'brnm-activate-meta-file'.
Escrevo o endereço numérico associado ao link, e executo o comando.

Com um meta-arquivo habilitado, as seguintes funções auxiliam-me a interagir com ele: 

### Inserindo links no meta-arquivo

[Source: overlay-meta-file.el L102-L111](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/overlay-meta-file.el#L102-L111))
``` elisp
(defun brnm-insert-link-in-position-in-meta-file (num)
  (interactive "P")
  (if mark-active
      (eeklfs)
    (eeklf))
  (save-window-excursion
    (find-file _mc-current-meta-file)
    (brnm-insert-string-in-nth-position num
					(substring-no-properties (car kill-ring)))))

```

[Source: overlay-meta-file.el L80-L94](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/overlay-meta-file.el#L80-L94))
``` elisp
(defun brnm-insert-string-in-nth-position (num string)
  (interactive "P")
  (save-excursion
    (save-window-excursion
      (if (not num)
	  (progn
	    (goto-char (point-max))
	    (search-backward-regexp "." nil 1)
	    (forward-char 1)
	    (insert (concat "\n" string)))
      (brnm-find-element-in-nth-paragraph num "^(")
      ;; (find-efunction 'brnm-find-element-in-nth-paragraph)
      (backward-char 1)
      (insert string)))))

```

Com essas funções, ao selecionar uma região, escrever um endereço numérico, e executar a segunda função,
um link para aquela região é inserido na posição correta do meta-arquivo.

### Acessando um link por sua posição

[Source: meta-file-double-link.el L55-L62](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/meta-file-double-link.el#L55-L62))
``` elisp
(defun mc-meta-file-follow-link (num)
  (interactive "P")
  "Receives a number prefix argument N. If N is less than 100, it follows the first link
   in the N'th group of links. If N is greater than 100, than the last 2 digits inform wich
   link in the group is going to be followed, and tha number to the left informs wich group.
   3 is equivalent to 300."
  (mc-meta-file-follow-link-generic num _mc-current-meta-file))

```

[Source: meta-file-double-link.el L63-L85](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/meta-file-double-link.el#L63-L85))
``` elisp
(defun mc-meta-file-follow-link-generic (num meta-file)
  (interactive "P")
  "Receives a number prefix argument N. If N is less than 100, it follows the first link
   in the N'th group of links. If N is greater than 100, than the last 2 digits inform wich
   link in the group is going to be followed, and tha number to the left informs wich group.
   3 is equivalent to 300."
  (if num
      (let (paragraph-num link-num link)

	(find-file meta-file)
	(save-buffer)
	(kill-buffer)
	(find-file meta-file)

	(brnm-find-element-in-nth-paragraph num "^(")

	(setq link (buffer-substring-no-properties (line-beginning-position) (line-end-position)))

	;; (save-buffer)
	;; (kill-buffer)

	(eval (read link)))
    (find-file meta-file)))
```

Estas duas funções permitem que, ao escrever o endereço numérico de um link, e executando a
primeira função, o link apropriado seja acessado.

As funções são implementadas de forma que, caso não seja fornecido o endereço numérico, a próprio
meta-arquivo seja acessado, na posição do último link que foi acessado. Dessa forma se quero acessar
o texto com o contexto do link na posição 302, eu escrevo o endereço numérico 302, e executo o
comando duas vezes.

### Ciclando entre links de um mesmo grupo

[Source: overlay-meta-file.el L247-L267](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/overlay-meta-file.el#L247-L267))
``` elisp
(defun brnm-cycle-meta-groups-links ()
  (interactive)
  "Will cicle through all the links, executing them, in a group in the meta file."
  (find-file _mc-current-meta-file)
  (let (original-pos group-separator-pos link-position)
    (setq original-pos (point))
    (if (search-forward "\n\n\n" nil t)
	(setq group-separator-pos (match-beginning 0))
      (setq group-separator-pos (- (point-max) 1)))
    (goto-char original-pos)
    (if (search-forward-regexp "^(.+)" nil t)
	(setq link-position (match-end 0))
      (setq link-position (point-max)))
    (goto-char original-pos)

    (if (> link-position group-separator-pos)
	(search-backward "\n\n\n" nil 1))

    (search-forward-regexp "^(.+)" nil t)
    (eval (read (match-string 0))
	  )))
```

Esta função acessa o próximo link pertencente ao mesmo grupo do último link acessado.
Caso o último link acessado sejam o último link do grupo, acessa o primeiro link do grupo.
Efetivamente executando esta função repetidas vezes, estará passando por todos os links do grupo
repetidas vezes.

### Agora o tal do Helpful Overlay

[Source: overlay-meta-file.el L210-L219](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/overlay-meta-file.el#L210-L219))
``` elisp
(defun brnm-helpfull-overlays ()
  (interactive)
  (save-window-excursion
    (save-excursion
      (brnm-iterate-over-list-of-sexps-with-number-position
       (progn
	 (find-file _mc-current-meta-file)
	 (brnm-get-regexp-positions-numbered "^(.+)"))))))
(define-key global-map (kbd "M-d") #'brnm-helpfull-overlays)

```

Esta função faz uso de outras duas funções, para acessar cada link presente no meta-arquivo e
adicionar um overlay em cada trecho que está sendo apontado pelos links, adicionado um sublinhado
com uma cor que indica pertencimento a um grupo de links, e o endereço ao lado numa fonte menor.

Desta forma, se estou em um arquivo e quero saber onde neste arquivo é possível que haja um contexto
no meta-arquivo, posso acionar esta função, e os pontos que são abordados pelo meta-arquivo aparecem
sublinhados de cores diferentes, e posso acessar o contexto escrevendo o endereço numérico que há
ao lado da região sublinhada.

As duas funções que permitem que isso ocorra são 'brnm-put-overlay-trough-sexp-and-number-position'
e 'brnm-get-regexp-positions-numbered'.

[Source: overlay-meta-file.el L115-L156](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/overlay-meta-file.el#L115-L156))
``` elisp
;; «walk-through-buffer»  (to ".walk-through-buffer")
(defun brnm-get-regexp-positions-numbered (regexp)
  ()
  "Returns the positions of the matches of regexp in the current buffer.
   The position returned are structured as in:
         (find-efunction 'mc-meta-file-follow-link-generic)
  "
  (let ((break-parag-pos t) (regexp-pos t)
	(group-num 1)   (num 0)
	(anchor (point-min))
	(return-value nil)
	(count 1))

    (while (and (or break-parag-pos regexp-pos) (< count 100))
      (setq count (+ 1 count))
      (if (search-forward "\n\n\n" nil t)
	  (setq break-parag-pos `(,(match-beginning 0) . ,(match-end 0)))
	(setq break-parag-pos nil))

      (goto-char anchor) ;; taking care, for we dont know wich happens first
      (if (search-forward-regexp regexp nil t)
	  (setq regexp-pos `(,(match-beginning 0) . ,(match-end 0)))
	(setq regexp-pos nil))

      (if (and break-parag-pos regexp-pos)
	  (if (< (car break-parag-pos) (car regexp-pos))
	      (progn
		(setq group-num (+ 1 group-num))
		(setq       num              0)
		(setq anchor    (cdr break-parag-pos))
		)
	    (setq return-value (cons `(,(substring-no-properties (match-string 0)) .
				       ,(+ (* 100 group-num) num)                    )
				     return-value))
	    (setq num (+ 1 num))
	    (setq anchor (cdr regexp-pos))
	    )))

    ;; (message (prin1-to-string return-value))
    return-value
    ))

```

Esta função gera uma estrutura de dados com uma lista de pares. Onde cada par contém um link
e uma posição numérica.

[Source: overlay-meta-file.el L179-L195](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/overlay-meta-file.el#L179-L195))
``` elisp
(defun brnm-put-overlay-trough-sexp-and-number-position (sexp-number)
  ()
  (save-excursion
    (save-window-excursion
      (let ((overlay-list nil) ovl color)
	(eval (read (car sexp-number)))
	(setq        ovl (make-overlay (match-beginning 0) (match-end 0)))

	(setq color (nth (- (mod (/ (cdr sexp-number) 100) (list-length brnm-color-sequence)) 1) brnm-color-sequence))
	(message color)

	(overlay-put ovl 'after-string (propertize (concat " [" (number-to-string (cdr sexp-number)) "]") 'face `(:height 0.7 :underline ,color))) ;; :background color
	(overlay-put ovl 'face `(:underline ,color))
	ovl
	)))
  )

```

Esta função recebe um par com um link e um número, acessa o link, e baseado no número, aplica um
overlay com um sublinhado de alguma cor, e com o número adicionado à direita da string que está
sendo apontada pelo link.

[Source: overlay-meta-file.el L199-L202](https://github.com/odecam0/.config-emacs-/blob/0e8e51591be4b92a1304b79fadeaa6787c8552c4/meta/overlay-meta-file.el#L199-L202))
``` elisp
(defun brnm-iterate-over-list-of-sexps-with-number-position (list)
  ()
  (mapcar #'brnm-put-overlay-trough-sexp-and-number-position list))

```

Esta função simplesmente aplica a segunda função acima, em cada elemento do resultado da primeira
função acima.




