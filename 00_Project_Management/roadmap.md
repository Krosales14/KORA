\# KORA Roadmap



\## Objetivo del roadmap



Definir la evolución progresiva del producto KORA desde su primera versión funcional (MVP) hasta una plataforma completa de planificación inteligente para construcción.



El roadmap prioriza:



\- validación temprana del producto

\- reducción de complejidad inicial

\- generación de valor desde las primeras versiones

\- arquitectura escalable

\- compatibilidad con automatización mediante IA (Codex)



\---



\# Visión de Producto



KORA será una plataforma que permitirá transformar parámetros iniciales de una obra en una planificación completa estructurada:



\- presupuesto

\- cronograma

\- flujo de caja

\- estructura WBS (EDT)

\- lista de materiales

\- planificación de abastecimiento



El objetivo es reducir incertidumbre en proyectos constructivos y mejorar eficiencia en costos y tiempos.



\---



\# Fases del Producto



\## Fase 0 — Fundaciones Técnicas



Objetivo:

Establecer base arquitectónica sólida y escalable.



Componentes:



Identity API

modelo de usuarios

organizaciones (multi-tenant)

roles y permisos (RBAC)

estructura base de base de datos

estructura inicial del frontend

estructura del repositorio

estructura de prompts



Entregables:



login funcional

registro de usuario

gestión de organización

estructura inicial del proyecto

documentación base



\---



\## Fase 1 — Gestión de Proyectos (Base)



Objetivo:

Permitir crear proyectos y capturar parámetros iniciales de obra.



Funcionalidades:



crear proyecto

editar proyecto

definir tipo de obra

definir ubicación

definir área de construcción

definir nivel de calidad

definir moneda

definir parámetros generales



Entregables:



pantalla creación de proyecto

modelo de datos Project

relación Organization → Projects

estructura básica UI

primer flujo funcional completo



\---



\## Fase 2 — Estructura WBS (EDT)



Objetivo:

Generar estructura base de proyecto constructivo.



Funcionalidades:



estructura jerárquica de actividades

plantillas de WBS

clasificación por tipo de obra

niveles de desglose

actividades parametrizables



Entregables:



modelo WBS

estructura jerárquica

asignación de actividades a proyecto

visualización de estructura



\---



\## Fase 3 — Motor de Cálculo de Materiales



Objetivo:

Calcular materiales necesarios según tipo de obra y actividades.



Funcionalidades:



lista base de materiales

relación actividad → materiales

factores de consumo

unidades de medida

conversión de unidades

estructura de catálogo de materiales



Entregables:



modelo de materiales

estructura de catálogo

primer cálculo automático de materiales



\---



\## Fase 4 — Presupuesto de Obra



Objetivo:

Generar estimación de costos basada en materiales y actividades.



Funcionalidades:



costo unitario de materiales

costo de mano de obra

costo indirecto

estructura de costos

cálculo automático de presupuesto



Entregables:



estructura de presupuesto

modelo de costos

cálculo automático de costo total



\---



\## Fase 5 — Cronograma de Obra



Objetivo:

Generar secuencia de actividades en el tiempo.



Funcionalidades:



duración estimada de actividades

dependencias entre tareas

cálculo de ruta crítica

estructura de calendario

visualización tipo timeline



Entregables:



modelo de scheduling

estructura de dependencias

cronograma base



\---



\## Fase 6 — Flujo de Caja



Objetivo:

Estimar comportamiento financiero del proyecto.



Funcionalidades:



distribución de costos en el tiempo

estructura de desembolsos

curva de inversión

estimación mensual de costos



Entregables:



modelo de cashflow

estructura temporal de costos



\---



\## Fase 7 — Planificación de Abastecimiento



Objetivo:

Determinar cuándo adquirir materiales.



Funcionalidades:



relación cronograma → materiales

fechas requeridas de compra

estructura de planificación de compras

agrupación de materiales



Entregables:



plan de abastecimiento

estructura de procurement



\---



\## Fase 8 — Optimización Inteligente



Objetivo:

Mejorar eficiencia de costos y tiempos mediante lógica inteligente.



Funcionalidades:



sugerencias automáticas

optimización de materiales

optimización de secuencia

detección de inconsistencias

alertas de sobrecostos



Entregables:



primer motor inteligente funcional



\---



\# Línea de tiempo sugerida



Mes 1

Fase 0

Fase 1



Mes 2

Fase 2

Fase 3



Mes 3

Fase 4



Mes 4

Fase 5



Mes 5

Fase 6



Mes 6

Fase 7



Mes 7+

Fase 8



\---



\# MVP recomendado



El MVP funcional debe incluir:



usuarios

organizaciones

proyectos

estructura WBS base

cálculo inicial de materiales

presupuesto base



Esto permitirá:



demostraciones

validación de mercado

feedback temprano

ajuste de modelo



\---



\# Riesgos identificados



sobrecarga funcional temprana

complejidad de modelo de datos

definición incorrecta de estructura WBS

exceso de parametrización inicial

desalineación entre UI y motor lógico



\---



\# Estrategia de mitigación



iteraciones pequeñas

validación continua

modularización del motor inteligente

separación clara de dominios

documentación progresiva



\---



\# Principios de desarrollo



modularidad

escalabilidad

claridad estructural

automatización progresiva

validación temprana

mínima complejidad inicial



\---



\# Estado actual



en definición de arquitectura base



\---



\# Responsable



Kenneth Rosales

Product Design

Solution Architecture

