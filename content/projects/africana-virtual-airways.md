---
title: Africana Virtual Airways
desc: Plataforma full-stack de reservas de voos desenvolvida no 4º semestre de Engenharia Informática no IADE. Simula o sistema digital completo de uma companhia aérea: pesquisa de voos, seleção de lugares, gestão de PNR, frota, entretenimento a bordo e backoffice de administração.
category: [Web App, Full-Stack, Académico]
year: 2025
type: Académico
duration: Em desenvolvimento
status: Em desenvolvimento
github: https://github.com/Cabacadosinformaticos/Africana-Virtual-Airways
stack: [JavaScript, Node.js, Express, MySQL, HTML, CSS, JWT, Leaflet, REST API]
cover: ""
---

O Africana Virtual Airways é o projeto principal do 4º semestre de Engenharia Informática no IADE. O desafio académico era construir uma plataforma web que simulasse o funcionamento digital completo de uma companhia aérea, desde a experiência do passageiro que pesquisa e reserva um voo até às ferramentas de gestão do lado da administração.

## O que a plataforma faz

Do lado do passageiro, a plataforma permite pesquisar voos por origem, destino e data, ver disponibilidade e preços, selecionar lugares num mapa interativo da cabine do avião, e completar a reserva com geração de número PNR. O passageiro tem acesso ao histórico de reservas e pode consultar ou cancelar viagens existentes.

A galeria da frota apresenta os aviões da companhia com especificações técnicas, fotografias e configuração de cabine. O sistema de entretenimento a bordo (IFE) simula o catálogo de conteúdos disponíveis em voo. O mapa de voos em tempo real usa a biblioteca Leaflet para mostrar rotas e posições, com animação de aeronaves nas rotas ativas.

Do lado da administração, o backoffice tem gestão completa de voos (criar, editar, cancelar), gestão de rotas e aeronaves, e acesso a todas as reservas com ferramentas de pesquisa e filtragem.

## Arquitetura e stack

O backend foi construído em **Node.js com Express**, com **MySQL** para persistência. A base de dados tem várias tabelas interligadas: utilizadores, voos, aeronaves, rotas, reservas, lugares por voo. Planear o schema antes de escrever código foi uma das primeiras lições do projeto: as decisões de normalização feitas no início determinaram a facilidade ou dificuldade de todas as queries que vieram depois.

A autenticação usa **JWT** com refresh tokens e controlo de roles: um passageiro e um administrador têm sessões com permissões diferentes, e o middleware de autorização protege cada endpoint de acordo com o role necessário.

No frontend, **JavaScript vanilla** com HTML e CSS, sem frameworks. A decisão (ou restrição académica) de não usar React ou Vue obrigou a estruturar o código de forma mais cuidadosa: gestão de estado manual, componentes como funções, rendering condicional com manipulação direta do DOM. É uma abordagem mais trabalhosa mas que obriga a perceber o que os frameworks fazem por baixo.

## Desafios técnicos

O mapa de seleção de lugares foi o elemento de UI mais complexo: um SVG da planta da cabine gerado dinamicamente a partir dos dados da aeronave, com estados de disponibilidade por lugar, seleção interativa e atualização em tempo real para evitar conflitos de reserva simultânea.

A integração com a Leaflet para o mapa de voos exigiu calcular posições interpoladas das aeronaves com base nas horas de partida e chegada reais, para criar a ilusão de movimento em tempo real.

Do lado da base de dados, a gestão de lugares por voo, com controlo de disponibilidade, cancelamentos e overbooking, resultou num conjunto de queries com transações para garantir consistência dos dados em reservas simultâneas.

## O que aprendi

Este foi o primeiro projeto de escala real que construí: múltiplos módulos, uma API REST com mais de vinte endpoints, uma base de dados relacional com relações complexas, e dois tipos de utilizador com experiências completamente diferentes. Aprendi que a maior parte do trabalho num projeto deste tipo não é escrever código, é tomar decisões de arquitetura que depois são difíceis de mudar.
