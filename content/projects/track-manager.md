---
title: Track Manager
desc: Web app open source para gerir faixas de áudio e legendas em ficheiros de vídeo (MKV, MP4) através de uma interface visual simples. Sem recompressão, sem linha de comandos.
category: [Web App, Ferramenta, Open Source]
year: 2025
type: Pessoal
duration: Em desenvolvimento
status: Em desenvolvimento
github: https://github.com/Cabacadosinformaticos/Track-Manager
stack: [React, TypeScript, FastAPI, Python, FFmpeg, MKVToolNix, Tailwind CSS, Vite]
cover: ""
---

O Track Manager nasceu de uma frustração muito específica: querer limpar as faixas de áudio e legendas de ficheiros de vídeo sem ter de abrir o terminal. A operação em si é simples do ponto de vista técnico, mas as ferramentas existentes ou exigem conhecimento de FFmpeg em linha de comandos, ou são aplicações pesadas e complexas para aquilo que é uma tarefa de dois minutos. Faltava uma interface web limpa que tratasse disso sem fricção.

## O problema em detalhe

Quando descarregas uma série ou um filme num formato como MKV, o ficheiro pode conter dezenas de faixas: áudio em cinco idiomas, legendas em dez, e talvez uma faixa de vídeo alternativa. Se só queres português e inglês, carregar com todas as outras faixas é desperdício de espaço e cria confusão no reprodutor. Remover faixas com FFmpeg funciona, mas o comando é longo, nada intuitivo e fácil de errar. O MKVToolNix tem uma GUI mas é pesado e claramente pensado para utilizadores avançados.

Queria algo que me deixasse abrir o ficheiro, ver todas as faixas organizadas por tipo, desmarcar as que não quero, e exportar. Sem mais.

## Como funciona

O utilizador carrega um ficheiro de vídeo (MKV ou MP4) através da interface web. O backend em Python analisa o ficheiro com FFmpeg e MKVToolNix e devolve a lista completa de faixas: tipo (vídeo, áudio, legenda), idioma, codec, e se está definida como faixa padrão.

A interface mostra essas faixas organizadas por tipo, com possibilidade de reordenar (drag and drop), remover, e marcar como padrão. Quando o utilizador confirma, o backend executa as operações necessárias no ficheiro sem recomprimir nada: apenas remontagem das faixas selecionadas, o que é quase instantâneo independentemente do tamanho do ficheiro.

O ficheiro resultante é devolvido para download.

## Decisões técnicas

**FastAPI (Python)** para o backend porque é rápido de montar, a tipagem com Pydantic garante que os dados das faixas chegam sempre com a estrutura certa, e gera documentação automática da API. Isso é importante num projeto open source: se alguém quiser contribuir, pode ver exatamente o que cada endpoint espera e devolve sem ler o código.

**React com TypeScript** no frontend porque os tipos das faixas de vídeo são suficientemente complexos para justificar tipagem estrita. Com JavaScript puro é fácil cometer erros silenciosos na manipulação dos objetos de faixa; com TypeScript o compilador apanha esses erros antes de chegarem ao utilizador.

**Vite** como bundler por causa do tempo de arranque do servidor de desenvolvimento. Numa ferramenta que vou usar no dia-a-dia durante o desenvolvimento, um HMR instantâneo faz diferença real.

**Tailwind CSS** para a interface porque preciso de iterar rapidamente no design sem mudar de ficheiro constantemente. Para uma ferramenta utilitária, uma UI funcional e limpa é mais importante que uma UI elaborada.

A comunicação entre frontend e backend é feita via REST. Os ficheiros de vídeo são enviados via `multipart/form-data` e o resultado é devolvido como `application/octet-stream`. Para ficheiros grandes, o backend processa em stream para não carregar o ficheiro inteiro em memória.

## Estado atual e planos

A app está em desenvolvimento ativo. As funcionalidades de base (carregar ficheiro, listar faixas, remover, exportar) estão implementadas. A reordenação por drag and drop e a definição de faixa padrão estão em curso.

Próximos passos: suporte a processamento de múltiplos ficheiros em batch, interface para renomear faixas, e possivelmente um modo de linha de comandos que use a mesma lógica do backend para integração em scripts.
