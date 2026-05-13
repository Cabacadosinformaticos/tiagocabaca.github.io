---
title: Como este site foi feito
desc: A arquitetura por trás do site, as decisões técnicas e o porquê de tudo funcionar com ficheiros Markdown.
category: Web Dev
date: Mai 2025
readTime: 6 min
cover: /assets/images/posts/como-este-site-foi-feito-cover.jpg
---

Este site não foi feito com WordPress, nem com Next.js, nem com nenhum gerador estático. É HTML, CSS e JavaScript vanilla, e funciona sem um único servidor, sem nenhum processo de build, e sem dependências instaladas localmente.

Isto foi uma escolha deliberada. Queria perceber como as coisas funcionam por baixo antes de usar abstrações que as escondem. E o resultado surpreendeu-me pela positiva.

## O problema que quis resolver

A abordagem mais óbvia para um site como este seria criar uma página HTML para cada projeto e cada post. Funciona, mas escala mal. Cada nova entrada significa duplicar estrutura, remendar estilos, garantir que a navegação está consistente. Com o tempo, o site torna-se difícil de manter.

A alternativa era usar um CMS ou um framework, mas isso introduz complexidade que não justifica o tamanho do projeto, e afasta-me do objetivo: perceber o que estou a construir.

A solução foi criar um motor de conteúdo próprio.

## O motor de conteúdo

O ficheiro `assets/js/content-engine.js` é o núcleo do site. O seu trabalho é simples: quando uma página de projeto ou de post é aberta, ele lê um índice JSON, busca o ficheiro `.md` correspondente, faz o parse do frontmatter, renderiza o Markdown para HTML e injeta tudo num template partilhado.

O fluxo completo de um projeto:

1. `data/projects-index.json` lista os IDs de todos os projetos
2. A página `projects.html` lê esse índice e carrega cada `.md` para construir os cards
3. Ao clicar num card, `project-detail.html` recebe o ID via query string e carrega o `.md` completo
4. O motor faz o parse, renderiza e apresenta

Adicionar um projeto novo é escrever um ficheiro `.md` e registar o ID no JSON. Nenhuma linha de HTML ou CSS precisa de ser tocada.

## A estrutura dos ficheiros Markdown

Cada ficheiro de conteúdo começa com um bloco de frontmatter entre `---`:

```markdown title="content/projects/exemplo.md"
---
title: Nome do Projeto
desc: Descrição curta para o card.
tags: [Web, Python]
date: 2025
status: Concluído
---

Conteúdo em Markdown a partir daqui.
```
O frontmatter é o que alimenta os cards nas páginas de listagem. O corpo é o que aparece na página de detalhe. A separação é total.

## O que o Markdown permite

Para além do texto, o motor reconhece blocos especiais e expande-os para componentes HTML. Um callout:

:::callout
Isto aparece como um bloco destacado com um estilo próprio, útil para notas ou avisos.
:::

Um carrossel de imagens basta listar os caminhos:

```markdown
:::carousel
/assets/images/projects/exemplo/screenshot-1.jpg
/assets/images/projects/exemplo/screenshot-2.jpg
:::
```

O motor transforma isso num componente navegável com setas e indicadores de posição.

## Sem build, sem dependências

O único recurso externo é a biblioteca [marked.js](https://marked.js.org/), carregada via CDN, que faz o parse do Markdown. Tudo o resto é código que escrevi.

Isto significa que o repositório pode ser clonado e aberto diretamente no browser. Não há `npm install`, não há `npm run build`, não há ficheiros gerados para ignorar no `.gitignore`. O que está no repositório é exatamente o que corre no browser.

## Deploy

O site está alojado no GitHub Pages, que serve ficheiros estáticos diretamente de um repositório. Commit, push, e o site está atualizado. Não podia ser mais simples.

## O que aprendi

Construir isto do zero, sem framework, obrigou-me a resolver problemas que normalmente ficam escondidos: como fazer fetch de ficheiros locais no browser, como parsear frontmatter manualmente antes de passar o corpo ao marked, como gerir o estado da navegação com query strings.

Não é a solução mais sofisticada, mas é completamente minha, entendo cada linha, e funciona bem para o que precisa de fazer.
