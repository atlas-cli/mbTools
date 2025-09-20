[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

# MB Tools - Figma Plugin

> ⚠️ **Em Desenvolvimento** - Este plugin ainda está em desenvolvimento ativo e algumas funcionalidades podem não estar finalizadas.

Plugin desenvolvido especificamente para satisfazer, automatizar e auxiliar no gerenciamento e utilização do **Design System MyBenk**. Oferece ferramentas especializadas que facilitam a manutenção, conversão e padronização de componentes e tokens do design system.

## Funcionalidades

### 🎨 Style to Variable Converter

Automatiza a migração de estilos legados do MyBenk Design System para o novo sistema de tokens:

* Detecta automaticamente estilos de preenchimento e contorno que começam com `colors/`
* Converte para variáveis/tokens correspondentes no formato `colors/`
* Atualização em tempo real da contagem de estilos na seleção
* Suporte para conversão em lote de múltiplos componentes
* **Objetivo**: Facilitar a transição para o novo sistema de design tokens do MyBenk

### 🔤 Icon Rename Tool

Padroniza nomenclatura de ícones conforme diretrizes do Lucide Icons:

* Converte nomes em kebab-case para PascalCase (ex: `arrow-left` → `ArrowLeft`)
* Valida se o nome convertido existe na biblioteca de ícones Lucide (padrão do MyBenk)
* Lista nomes inválidos para revisão manual
* Funciona com componentes individuais e component sets
* **Objetivo**: Garantir consistência na nomenclatura de ícones do design system

### 🎨 Color Palette Generator

Gera automaticamente paletas de cores harmoniosas a partir de uma cor primária:

* Algoritmo HSL avançado com regras baseadas na luminosidade da cor base
* Gera 5 variações: `primary`, `primary-dark`, `primary-hover`, `primary-high-emphasis`, `primary-low-emphasis`
* Aplica cores como variáveis Figma nos modos `light` e `dark` simultaneamente
* Interface com validação HEX em tempo real e preview visual das cores
* Estrutura hierárquica organizada: `colors/primary/primary`, `colors/primary/primary-dark`, etc.
* **Objetivo**: Automatizar criação de paletas consistentes para o Design System

## Instalação

### Para Desenvolvimento

1. Clone o repositório
2. Instale as dependências:

   ```bash
   pnpm install
   ```
3. Execute o build:

   ```bash
   pnpm run build
   ```
4. No Figma, vá em **Plugins** → **Development** → **Import plugin from manifest**
5. Selecione o arquivo `manifest.json` na raiz do projeto

## Como Usar

### Style Converter

1. Abra o plugin (Plugins → Development → MB Tools)
2. Selecione frames, sections ou componentes que contenham estilos `colors/`
3. O plugin mostrará quantos estilos foram detectados
4. Clique em **"Converter Seleção"**
5. Os estilos serão automaticamente convertidos para variáveis

### Icon Rename

1. Abra o plugin e vá para a aba **"Icon Rename"**
2. Selecione os componentes de ícone que deseja renomear
3. Clique em **"Renomear Componentes"**
4. O plugin mostrará quais nomes foram convertidos com sucesso e quais são inválidos

### Color Palette

1. Abra o plugin e vá para a aba **"Color Palette"**
2. Insira uma cor primária em formato HEX (ex: `#4133A6`)
3. Clique em **"Gerar e Aplicar Paleta"**
4. O plugin criará 5 variações harmoniosas na coleção `colors-tokens`
5. As cores serão aplicadas nos modos `light` e `dark` simultaneamente

## Comandos de Desenvolvimento

```bash
# Build do projeto
pnpm run build

# Build com watch (desenvolvimento)
pnpm run watch

# Limpar arquivos de build
pnpm run clean
```

## Estrutura do Projeto

* `src/main.ts` - Ponto de entrada do plugin
* `src/modules/` - Módulos individuais (style-to-variable, icon-rename, color-palette)
* `src/ui/` - Interface do usuário (HTML/CSS/JS)
* `src/core/` - Tipos e interfaces compartilhadas
* `assets/` - Recursos estáticos (logo)
* `dist/` - Arquivos compilados

## Requisitos

* **Figma Desktop** ou **Figma no navegador**
* **Variáveis de cor** configuradas no arquivo do Figma (para o Style Converter)
* **Arquivo de nomes Lucide** em `assets/lucide-names.json` (para o Icon Rename)
* **Coleção colors-tokens** no Figma (para o Color Palette - criada automaticamente se não existir)

## Status do Desenvolvimento

* ✅ Sistema modular funcionando
* ✅ Style to Variable Converter - Funcional
* ✅ Icon Rename Tool - Funcional
* ✅ Color Palette Generator - Funcional
* ✅ Interface do usuário completa - 3 abas funcionais

## Sobre o MyBenk Design System

Este plugin foi criado para atender às necessidades específicas do MyBenk Design System, oferecendo automação para:

* **Migração de tokens**: Conversão de estilos legados para o novo sistema de design tokens
* **Padronização de componentes**: Garantia de nomenclatura consistente seguindo as diretrizes do MyBenk
* **Geração de paletas**: Criação automática de variações harmoniosas de cores primárias
* **Eficiência no workflow**: Redução de trabalho manual repetitivo na manutenção do design system
* **Qualidade e consistência**: Validação automática conforme padrões estabelecidos

## Contribuição

Este é um projeto interno da MyBenk em desenvolvimento. Para sugestões ou bugs, abra uma issue.

## 📜 Licença

Este projeto é de código aberto sob a [licença MIT](LICENSE).

Criado e mantido por **Luka Machado Zinkoski**.
Você pode utilizar, modificar e redistribuir este software livremente, desde que preserve os créditos de autoria.