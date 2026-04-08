\# KORA



\## Descripción General



KORA es una plataforma Contech que transforma parámetros iniciales de un proyecto constructivo en una estructura completa de planificación inteligente.



El objetivo es reducir incertidumbre, optimizar costos y mejorar la eficiencia en proyectos de construcción mediante automatización y análisis estructurado.



KORA genera:



\- presupuesto de obra

\- cronograma de ejecución

\- flujo de caja del proyecto

\- estructura WBS (EDT)

\- lista de materiales

\- planificación de abastecimiento

\- estructura de costos optimizada



La plataforma está diseñada como un ecosistema modular SaaS.



\---



\# Arquitectura General



El proyecto se divide en los siguientes componentes:



\### KORA Site

Sitio web comercial orientado a conversión.

Objetivo: captar clientes y generar solicitudes de demo.



\### KORA UI

Aplicación web principal (frontend).



Tecnología base:

\- React

\- Tailwind

\- Framer Motion



\### KORA API

Backend principal del sistema.



Tecnología base:

\- .NET 8

\- Clean Architecture

\- JWT Authentication



\### KORA Database

Modelo de datos estructurado por dominios.



Soporta:

\- multi-tenant

\- RBAC (roles y permisos)

\- auditoría

\- estructura geográfica



\### KORA Smart Engine

Motor inteligente encargado de transformar parámetros iniciales en planificación completa del proyecto.



\---



\# Estructura del Proyecto



KORA/



00\_Project\_Management → planificación y seguimiento  

01\_Product\_Strategy → definición funcional del producto  

02\_UX\_UI\_Design → diseño visual y experiencia de usuario  

03\_Marketing\_Website → contenido del sitio comercial  

04\_KORA\_UI → documentación frontend  

05\_KORA\_API → documentación backend  

06\_Database → modelo de datos  

07\_Smart\_Engine → lógica de negocio inteligente  

08\_DevOps → despliegue e infraestructura  

09\_Prompts\_for\_Codex → prompts reutilizables  

10\_Documentation → documentación general  



README.md → documento principal del proyecto



\---



\# Reglas para trabajar con Codex



Cada carpeta contiene contexto específico para evitar ambigüedad.



Antes de solicitar código a Codex:



1\. identificar el dominio funcional

2\. ubicar el archivo correspondiente

3\. incluir el contexto existente en el prompt

4\. evitar redefinir estructuras existentes

5\. mantener consistencia en nombres y arquitectura



Codex debe trabajar siempre sobre una base estructurada para evitar duplicidad de lógica o inconsistencias.



\---



\# Convenciones del Proyecto



\## Lenguaje



Documentación: español  

Código fuente: inglés  



Esto permite mantener claridad funcional y compatibilidad técnica.



\---



\## Convenciones de nombres



\### Base de datos



Se utilizará PascalCase para tablas y columnas.



Ejemplos:



Users  

Organizations  

Projects  

ProjectTasks  

ProjectBudgets  



Primary Keys:



PK\_TableName



Ejemplo:



PK\_Users



Foreign Keys:



FK\_TableName\_RelatedTable



Ejemplo:



FK\_Projects\_Organizations



\---



\## Campos estándar de auditoría



CreatedAt  

CreatedBy  

UpdatedAt  

UpdatedBy  



Opcional:



DeletedAt  

DeletedBy  

IsDeleted  



\---



\## Arquitectura lógica por dominios



Security  

Catalogs  

Projects  

Planning  

Costing  

Procurement  

Audit  

Location  



\---



\# Flujo de trabajo recomendado



Paso 1  

Definir funcionalidad en:



01\_Product\_Strategy



Paso 2  

Diseñar experiencia en:



02\_UX\_UI\_Design



Paso 3  

Definir endpoints en:



05\_KORA\_API



Paso 4  

Definir modelo de datos en:



06\_Database



Paso 5  

Construir interfaz en:



04\_KORA\_UI



Paso 6  

Implementar lógica en:



07\_Smart\_Engine



\---



\# Organización de Prompts



La carpeta:



09\_Prompts\_for\_Codex



contiene prompts reutilizables clasificados por tipo:



backend  

frontend  

database  

ux-ui  

project-management  



Esto permite:



evitar duplicidad  

mantener coherencia técnica  

acelerar desarrollo  

mantener trazabilidad de decisiones  



\---



\# Visión del Producto



KORA busca convertirse en el sistema operativo de planificación para la construcción.



Un usuario debe poder ingresar:



tipo de obra  

ubicación  

metros cuadrados  

nivel de calidad  

restricciones presupuestarias  



y obtener automáticamente:



estructura completa del proyecto  

estimación de costos  

secuencia constructiva  

plan de abastecimiento  

estructura financiera  



El sistema permitirá mejorar la eficiencia del sector construcción mediante estandarización inteligente de procesos.



\---



\# Estado actual del proyecto



Proyecto en fase de:



definición de arquitectura  

estructura inicial de base de datos  

desarrollo de Identity API  

desarrollo de KORA UI  

definición del sitio web comercial  

definición del Smart Engine  



\---



\# Próximos pasos



definir módulos principales del sistema  

definir modelo de datos inicial  

definir estructura de proyectos  

definir flujo de creación de obra  

definir estructura WBS base  

definir estructura de costos base  

definir estructura de materiales base  

definir lógica inicial del Smart Engine  



\---



\# Autor



Kenneth Rosales



Arquitectura funcional y técnica  

Visión de producto  

Diseño de solución

