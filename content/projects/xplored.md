---
title: Xplored
desc: Aplicação mobile Android de exploração e descoberta de locais desenvolvida no 3º semestre de Engenharia Informática no IADE. Permite descobrir, guardar e partilhar locais de interesse.
category: [Android, Mobile, Académico]
year: 2025
type: Académico
duration: Concluído
status: Concluído
github: https://github.com/Cabacadosinformaticos/Xplored
stack: [Kotlin, Android]
cover: ""
---

O Xplored foi desenvolvido no 3º semestre de Engenharia Informática no IADE, no âmbito da cadeira de Projeto de Desenvolvimento Móvel. O objetivo era construir uma aplicação Android funcional de raiz, aplicando os conceitos de desenvolvimento mobile introduzidos ao longo do semestre.

## A aplicação

O Xplored é uma app de exploração e descoberta de locais: o utilizador pode navegar por sugestões, descobrir pontos de interesse, guardar os favoritos e partilhá-los. A ideia é ser um ponto de partida para quem quer explorar uma cidade ou zona nova sem seguir um roteiro fixo.

## Primeiro projeto Android nativo

Este foi o meu primeiro projeto sério em Kotlin para Android nativo. Antes do Xplored, o meu desenvolvimento tinha sido quase exclusivamente web. Mudar para mobile impôs um conjunto de restrições e conceitos completamente diferentes.

A gestão do ciclo de vida das Activities e Fragments foi provavelmente o maior ajuste: em web, o estado de um componente é relativamente simples de gerir; em Android, a Activity pode ser destruída e recriada em qualquer momento (rotação do ecrã, mudança de configuração, sistema a libertar memória), e o estado tem de sobreviver a isso. Perceber o padrão ViewModel e LiveData foi o que fez isso encaixar.

A navegação entre ecrãs também é diferente do que estou habituado em React Router ou HTML simples. O Android Navigation Component simplifica a gestão do back stack e da passagem de argumentos entre fragmentos, mas tem a sua curva de aprendizagem.

Kotlin em si foi uma surpresa positiva: a sintaxe é muito mais limpa do que Java, as null safety features do compilador apanham uma classe inteira de erros em tempo de compilação, e as coroutines tornam as operações assíncronas (chamadas de rede, acesso a base de dados) muito mais legíveis do que callbacks encadeados.

## O que o Xplored me deu

Depois deste projeto, o desenvolvimento Android deixou de ser terra incógnita. Fiquei com uma base sólida que se revelou útil de forma imediata: o PSP Lisboa App, construído mais tarde num hackathon de 48 horas, teria sido impossível de entregar nesse tempo sem ter passado pelo Xplored primeiro.
