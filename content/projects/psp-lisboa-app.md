---
title: PSP Lisboa App
desc: Aplicação Android nativa desenvolvida em 48 horas no hackathon Tech 4 Good 2026 do IADE, em resposta a um desafio real da PSP. Permite aos cidadãos localizar esquadras, aceder a serviços, submeter participações e gerir documentos digitais.
category: [Android, Mobile, Hackathon, Open Source]
year: 2026
type: Hackathon
duration: 48 horas
status: Concluído
github: https://github.com/Cabacadosinformaticos/psp-lisboa-app
stack: [Kotlin, Firebase Authentication, Firebase Firestore, Google Maps SDK, Google Places SDK, Material Design 3, Android Navigation Component]
cover: ""
---

O PSP Lisboa App foi construído em 48 horas durante o Tech 4 Good 2026, um hackathon organizado pelo IADE no campus Oriente em Moscavide. O evento desafiava equipas de estudantes a criar soluções tecnológicas para problemas sociais reais. A nossa equipa de sete pessoas escolheu o Desafio 2, proposto diretamente pela Polícia de Segurança Pública: desenvolver uma app que facilitasse o acesso dos cidadãos à PSP na área de Lisboa.

Fui Lead Developer e UI/UX Designer do projeto.

## O desafio

O Comando Metropolitano de Lisboa (COMETLIS) gere 120 esquadras distribuídas pela área metropolitana, organizadas em divisões territoriais, de trânsito, investigação criminal, segurança de instalações e transportes públicos. A PSP opera em 13 áreas de serviço distintas, de policiamento comunitário a licenciamento de armas e objetos perdidos.

O problema era concreto: um cidadão que precisa de ir à PSP, muitas vezes, não sabe a que esquadra ir nem quais os serviços que ela oferece. Isso gera deslocações desnecessárias, perda de tempo e frustração. A PSP queria uma solução que centralizasse essa informação e modernizasse o acesso ao serviço público.

## O que a app faz

A app cobre o ciclo completo de interação entre um cidadão e a PSP em Lisboa:

**Mapa interativo** com todas as 120 esquadras da área metropolitana, marcadores personalizados e filtros por tipo: todas, abertas 24h, mais próxima, esquadras territoriais, divisões. O mapa usa o Google Maps SDK com dados do Google Places e da API pública da PSP.

**Páginas de detalhe de cada esquadra** com fotografias, horários, telefone, email, morada e um mapa inline com indicações de direção diretamente integrado.

**13 categorias de serviço PSP** com artigos informativos para cada uma, desde trânsito e objetos perdidos a investigação criminal e licenciamento de armas. Cada categoria lista as esquadras relevantes para esse serviço.

**Pesquisa em tempo real** que cobre esquadras, categorias e artigos em simultâneo numa única caixa de pesquisa.

**Perfil com documentos digitais**: o utilizador pode guardar o Cartão de Cidadão e a Carta de Condução na app de forma segura.

**Sistema de participações**: submissão e acompanhamento de participações diretamente pela app.

**Sistema de notificações** com 4 tipos: informativo, aviso, sucesso e alerta.

**Autenticação Firebase** com email e palavra-passe, e autenticação de dois fatores (2FA).

## Stack e arquitetura

A app foi construída em Kotlin com XML Views e Material Design 3, seguindo a arquitetura Single Activity com Navigation Component. Esta abordagem simplificou a gestão de back stack e de argumentos entre fragmentos durante o desenvolvimento intensivo de 48h.

A autenticação e base de dados foram feitas com Firebase: Firebase Authentication para o login e 2FA, e Firebase Firestore para as participações e dados de perfil do utilizador.

Os dados das esquadras vêm de duas fontes: o Google Places SDK como fonte primária (nome, localização, fotos, horários, contactos), e a API pública da PSP como fonte suplementar para informação adicional como email, tipo de unidade e organização de serviços. Criei um repositório unificado que funde as duas fontes numa estrutura de dados coerente.

O mapa de esquadras com todos os filtros foi um dos desafios mais interessantes de resolver em pouco tempo: manter a performance com 120 marcadores no mapa enquanto se filtram em tempo real exigiu cuidado na forma como os dados eram carregados e cacheados.

## Equipa

Sete estudantes de Engenharia Informática e Creative Technologies do IADE:

- **Tiago Cabaça** — Lead Developer, UI/UX Designer
- **André Maleitas** — Firebase e Autenticação
- **Rodrigo Freire** — Backend Developer
- **Martim Conceição** — Mapas e Localização
- **César Rodrigues** — Frontend Developer, QA e Testes
- **Lucas Nicolau** — Integração de APIs
- **Sara Santos** — Design Visual e Branding

## O contexto

Construir algo funcional, com este nível de detalhe, em 48 horas é um exercício diferente de tudo o resto. Não há tempo para hesitar: cada decisão técnica tem de ser tomada em minutos, a divisão de trabalho tem de ser clara, e o foco tem de estar sempre no que é essencial para a demo final. Foi provavelmente a experiência de desenvolvimento mais intensa que já tive, e uma das mais satisfatórias.

Os projetos foram avaliados com base em impacto social, inovação, qualidade técnica, usabilidade e sustentabilidade.
