;; Utilizo uma maneira muito particular de escrever código, oque acaba deixando os arquivos com
;; uma quantidade não amigável de comentários e pequenos programas em lisp que fazem sentido apenas
;; para mim.

;; Por este motivo procurei maneiras de conseguir manter duas versões do código que eu estiver
;; trabalhando, uma com meus comentários particulares, e outra sem eles.
;; A solução que encontrei foi o seguinte programa em elisp que suporta a manutenção de dois branchs
;; paralelos em um repositório git, um com uma versão do código com comentários que são úteis só para
;; mim, e outra versão sem esses comentários.


;; A ideia é que o branch original (aquele sem meus comentários) não deve ter nenhum commit do branch
;; meta (aquele com meus comentários), como pai. Enquanto o branch meta pode ter commits do branch original
;; como pais.

;; Isso porque quero poder pegar um repositório remoto, clonar na minha máquina, criar meu branch meta,
;; escrever meus meta comentários de forma que eu possa futuramente dar um push pro repositório remoto sem
;; que os outros usuários tenham conhecimento dos meus meta comentários.

;; Para alcançar esse objetivo cunhei a ideia de commit paralelo.
;; Um commit paralelo ocorre quando estou no branch meta, escreví conteúdos que não são apenas comentários
;; meta, e quero que estas mudanças sejam refletidas no branch original.
;; Nesses momentos, chamo uma rotina que:
;;  1. Confere quais arquivos foram modificados desde o último momento em que os branchs estavam sincronizados
;;  2. Confere quais arquivos são filtráveis. (não deve tentar filtrar uma imagem por exemplo)
;;  3. Copia o conteúdo de todos os arquivos filtráveis que foram modificados e armazena na memória ram.
;;  4. Copia todos os arquivos não filtráveis que foram modificados para uma pasta temporária
;;  5. Muda de branch para a branch original
;;  6. Substitui o conteúdo dos arquivos filtráveis pelo conteúdo filtrado
;;  7. Copia os arquivos não filtraveis para o repositório.

;; Para que o programa saiba qual foi o último commit 
(find-metafile "parallel-commit.el" "(defvar _mc-sync-log-file-name" '(mpdbl))
