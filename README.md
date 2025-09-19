[![Licença Proprietária](https://img.shields.io/badge/licença-proprietária-red.svg)](#-licença-e-uso)

# MB Tools - Figma Plugin

> ⚠️ **Em Desenvolvimento** - Este plugin ainda está em desenvolvimento ativo e algumas funcionalidades podem não estar finalizadas.

Plugin desenvolvido especificamente para satisfazer, automatizar e auxiliar no gerenciamento e utilização do **Design System MyBenk**. Oferece ferramentas especializadas que facilitam a manutenção, conversão e padronização de componentes e tokens do design system.

## Funcionalidades

### 🎨 Style to Variable Converter
Automatiza a migração de estilos legados do MyBenk Design System para o novo sistema de tokens:
- Detecta automaticamente estilos de preenchimento e contorno que começam com `colors/`
- Converte para variáveis/tokens correspondentes no formato `colors/`
- Atualização em tempo real da contagem de estilos na seleção
- Suporte para conversão em lote de múltiplos componentes
- **Objetivo**: Facilitar a transição para o novo sistema de design tokens do MyBenk

### 🔤 Icon Rename Tool
Padroniza nomenclatura de ícones conforme diretrizes do Lucide Icons:
- Converte nomes em kebab-case para PascalCase (ex: `arrow-left` → `ArrowLeft`)
- Valida se o nome convertido existe na biblioteca de ícones Lucide (padrão do MyBenk)
- Lista nomes inválidos para revisão manual
- Funciona com componentes individuais e component sets
- **Objetivo**: Garantir consistência na nomenclatura de ícones do design system

## Instalação

### Para Desenvolvimento
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o build:
   ```bash
   npm run build
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

## Comandos de Desenvolvimento

```bash
# Build do projeto
npm run build

# Build com watch (desenvolvimento)
npm run watch

# Limpar arquivos de build
npm run clean
```

## Estrutura do Projeto

- `src/main.ts` - Ponto de entrada do plugin
- `src/modules/` - Módulos individuais (style-to-variable, icon-rename)
- `src/ui/` - Interface do usuário (HTML/CSS/JS)
- `src/core/` - Tipos e interfaces compartilhadas
- `assets/` - Recursos estáticos (logo)
- `dist/` - Arquivos compilados

## Requisitos

- **Figma Desktop** ou **Figma no navegador**
- **Variáveis de cor** configuradas no arquivo do Figma (para o Style Converter)
- **Arquivo de nomes Lucide** em `../../../../mbIconRename/lucide-names.json` (para o Icon Rename)

## Status do Desenvolvimento

- ✅ Sistema modular funcionando
- ✅ Style to Variable Converter - Funcional
- ✅ Icon Rename Tool - Funcional
- 🔄 Interface do usuário - Em refinamento

## Sobre o MyBenk Design System

Este plugin foi criado para atender às necessidades específicas do MyBenk Design System, oferecendo automação para:
- **Migração de tokens**: Conversão de estilos legados para o novo sistema de design tokens
- **Padronização de componentes**: Garantia de nomenclatura consistente seguindo as diretrizes do MyBenk
- **Eficiência no workflow**: Redução de trabalho manual repetitivo na manutenção do design system
- **Qualidade e consistência**: Validação automática conforme padrões estabelecidos

## Contribuição

Este é um projeto interno da MyBenk em desenvolvimento. Para sugestões ou bugs, abra uma issue.

## 📜 Licença e Uso

Este projeto é **proprietário** e pertence a **Luka Machado Zinkoski**.  

O plugin é entregue como um **extra** ao cliente, sem contrato específico, mas com direito de uso garantido.  

### Condições:
- O cliente pode **usar o plugin** livremente em seu ambiente.  
- Não é permitido **redistribuir, sublicenciar, vender ou modificar** o código.  
- Todos os direitos permanecem com o autor original.  
- O cliente terá acesso também às **melhorias futuras** que estão sendo planejadas e implementadas no plugin.  