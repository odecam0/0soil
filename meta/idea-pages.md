# Idea about the pages and stuff

There are some things that must be done differently in the ABOUT, and SKILLS and PROJECT pages.
https://www.gatsbyjs.com/docs/tutorial/getting-started/part-3/
https://www.gatsbyjs.com/docs/tutorial/getting-started/part-4/#task-use-a-page-query-to-pull-the-list-of-post-filenames-into-your-blog-page

Primeiro devo escrever alguns exemplos de páginas que serão exibidas, e em seguida desenvolver 
o código que irá exibilos no gatsby.



Em um arquivo:
1. Selecionar trecho de código
   1. Sistema irá armazenar hash do commit em que a versão do arquivo se encontra
   2. Sistema irá armazenar path do arquivo
   3. Sistema irá armazenar posição do início e fim da região
2. Indicar como será exibido
   4. Sistema irá armazenar Flag com o tipo de exibição, junto de possíveis parâmetros adicionais,
      como oque será exibido caso a opção seja de substituir o conteúdo.
	  
1. Sistema irá copiar trechos de arquivos para novo arquivo que irá conter o conteúdo pronto para ser exibido
   transformando-o de acordo com a forma indicada de que será exibida.
   
   
   A transição da estrutura de dados para texto pronto para ser exibido será realizada implementando um link
   entre o trecho de código, e uma fonte onde o código pode ser visto em sua integridade completa, como os
   links com seleção do Github.
   
1. Uma forma que será exibida é: sem alterações.
2. Outra forma:                  mostrando outro texto, mas mantendo a relação com o trecho no código fonte.


Como iniciar um post?
O post pode iniciar em um código fonte com os meta comentários.
Seções do source code podem ser selecionados com posições do buffer, 
armazenando o hash do commit em que a região foi selecionada. Com essas informações
deve ser possível de criar uma página com texto em código letrado que quando clicado pode
abrir o trecho de código em seu contexto maior, exibindo-o inteiro no código fonte adequado,
tipo no github.

As partes principais deste código serão a possibilidade de conectar os trechos com o código fonte 
orignal na página gerada, e a possibilidade de selecionar e definir quais trechos serão oque com 
facilidade. Também será interessante poder tratar cada trecho de forma diferente, podendo selecionar 
uns para serem exibidos enquanto outros deverão ser ocultados, sendo substituido por algum outro trecho,
porém ainda conectados à algum trecho do código fonte.

Haverá uma extrutura de dados com o hash do commit, os pontos de início e fim de uma região, 
e uma lista cujo primeiro elemento é uma flag indicando oque deve ser feito com aquele trecho, sendo
os próximos elementos possíveis informações auxiliares para a flag.

Algum mecanismo de extrair trechos do código, de forma que possa ser exibido com uma mensagem do 
tipo: "Trecho de código que implementa blah blah e blah que não está relacionado com a explicação 
deste post."

Haverá uma complexidade com os commits paralelos, Pois o link deve apontar para o branch sem os
comentários, já que os comentários selecionados já estarão na página gerada.

## Em about:

Este é o site pessoal de Bruno Macedo.
A ideia é primariamente expor meu conhecimento em desenvolvimento de software, 
mas pretendo posteriormente não me limitar a isso. 

Aqui estão as útlimas coisas que foram adicionadas neste site:
// ( <<Widget com preview de últimos posts>>


## For the banner
https://fonts.google.com/specimen/Kdam+Thmor+Pro
