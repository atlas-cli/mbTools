# Style to Variable Module

Módulo para conversão automática de estilos legados para o novo sistema de variáveis/tokens do MyBenk Design System, facilitando a migração de estilos `colors/` para variáveis correspondentes.

## 📋 Visão Geral

Este módulo automatiza a transição do sistema de estilos antigo para o novo sistema de design tokens, convertendo referências de estilos de preenchimento e contorno que começam com `colors/` para variáveis correspondentes no formato moderno.

## 🎯 Funcionalidades

- **Conversão Automática**: Detecta estilos `colors/` e converte para variáveis equivalentes
- **Suporte Dual**: Processa estilos de preenchimento (fill) e contorno (stroke)
- **Processamento Hierárquico**: Percorre toda a árvore de nós recursivamente
- **Cache Inteligente**: Otimiza performance com cache de variáveis
- **Feedback em Tempo Real**: Atualiza contagem na interface conforme seleção
- **Relatório Detalhado**: Mostra sucessos, falhas e erros específicos

## 🔄 Processo de Conversão

### Mapeamento de Nomes

```
Style: colors/primary → Variable: colors/primary
Style: colors/secondary → Variable: colors/secondary
Style: colors/accent-blue → Variable: colors/accent-blue
```

### Algoritmo de Conversão

```typescript
// Entrada: "colors/primary-500"
// Saída: "colors/primary-500"
function convertStyleNameToVariableName(styleName: string): string {
  if (!styleName.startsWith('colors/')) return '';
  const token = styleName.slice('colors/'.length);  // "primary-500"
  return `colors/${token}`;                         // "colors/primary-500"
}
```

## 🔧 Implementação

### Interface do Módulo

```typescript
export const styleModule: Module = {
  id: 'style',
  name: 'Styles → Variables',
  init() {
    figma.on('selectionchange', notifySelectionUpdate);
  },
  handlers: {
    'check-selection': async () => { ... },
    'convert': async () => { ... }
  }
};
```

### Constantes de Configuração

```typescript
const STYLE_PREFIX = 'colors/';      // Prefixo dos estilos a converter
const VARIABLE_PREFIX = 'colors/';   // Prefixo das variáveis de destino
```

### Fluxo de Execução

1. **Seleção**: Usuário seleciona frames, sections ou componentes
2. **Detecção**: Conta estilos `colors/` na seleção atual
3. **Cache**: Carrega variáveis disponíveis em memória
4. **Conversão**: Percorre nós e substitui estilos por variáveis
5. **Relatório**: Exibe resultados e atualiza interface

## 📊 Sistema de Cache

### Otimização de Performance

```typescript
let variableCache: Map<string, Variable> | null = null;

async function getVariableCache(): Promise<Map<string, Variable>> {
  if (!variableCache) {
    // Carrega todas as variáveis de cor uma única vez
    const allVariables = await figma.variables.getLocalVariablesAsync();
    variableCache = new Map();
    allVariables
      .filter(v => v.resolvedType === 'COLOR' && v.name.startsWith('colors/'))
      .forEach(v => variableCache!.set(v.name, v));
  }
  return variableCache;
}
```

### Benefícios
- **Reduz chamadas API**: Carrega variáveis uma única vez
- **Lookup rápido**: Map para busca O(1)
- **Filtragem prévia**: Apenas variáveis de cor relevantes

## 🎨 Tipos de Conversão

### Fill Styles (Preenchimento)
```typescript
// Detecta estilos de preenchimento
if ('fillStyleId' in node && node.fillStyleId) {
  const style = await figma.getStyleByIdAsync(node.fillStyleId);
  if (style?.name.startsWith('colors/')) {
    // Converte para variável de preenchimento
    fills[0] = figma.variables.setBoundVariableForPaint(fills[0], 'color', variable);
  }
}
```

### Stroke Styles (Contorno)
```typescript
// Detecta estilos de contorno
if ('strokeStyleId' in node && node.strokeStyleId) {
  const style = await figma.getStyleByIdAsync(node.strokeStyleId);
  if (style?.name.startsWith('colors/')) {
    // Converte para variável de contorno
    strokes[0] = figma.variables.setBoundVariableForPaint(strokes[0], 'color', variable);
  }
}
```

## 🖥️ Interface do Usuário

### Componentes
- **Status Box**: Mostra contagem de estilos detectados
- **Botão Converter**: Habilitado apenas quando há estilos válidos
- **Feedback Visual**: Estados de progresso e resultados

### Estados da Interface

| Estado | Descrição | Classe CSS |
|--------|-----------|------------|
| `none` | Nenhuma seleção | `status-default` |
| `no-styles` | Seleção sem estilos válidos | `status-default` |
| `ready` | Estilos detectados, pronto para converter | `status-ready` |
| `busy` | Convertendo estilos | `status-busy` |

### Mensagens de Status
- **Padrão**: "Selecione ao menos um frame/section"
- **Sem estilos**: "Nenhum estilo detectado"
- **Pronto**: "X estilos detectados"
- **Processando**: "Convertendo..."

## 📨 Comunicação UI ↔ Backend

### Mensagens de Entrada

**Verificar Seleção:**
```typescript
{ module: 'style', type: 'check-selection' }
```

**Converter Estilos:**
```typescript
{ module: 'style', type: 'convert' }
```

### Mensagens de Resposta

**Atualização de Seleção:**
```typescript
{
  module: 'style',
  type: 'selection-update',
  count: 5,
  hasSelection: true
}
```

**Conversão Completa:**
```typescript
{
  module: 'style',
  type: 'conversion-complete',
  converted: 8,
  failed: 2,
  errors: ['Variable not found: colors/custom-blue']
}
```

**Erro:**
```typescript
{
  module: 'style',
  type: 'error',
  message: 'Nenhum elemento selecionado'
}
```

## 📊 Relatórios e Logs

### Resultado da Conversão
```typescript
interface ConversionResult {
  converted: number;    // Estilos convertidos com sucesso
  failed: number;       // Falhas na conversão
  errors: string[];     // Lista de erros específicos
}
```

### Notificações Figma
- **Sucesso Total**: `"✅ 8 estilos convertidos"`
- **Sucesso Parcial**: `"Convertidos: 6 | Falhas: 2"` (timeout 5s)

### Tipos de Erro
- `"Variable not found: colors/custom-name"`: Variável não existe
- `"Failed to convert fill: colors/primary"`: Erro na aplicação
- `"Failed to convert stroke: colors/border"`: Erro no contorno

## 🔍 Algoritmo de Detecção

### Travessia Recursiva
```typescript
async function countInNode(node: SceneNode) {
  // Verifica fill styles
  if ('fillStyleId' in node && node.fillStyleId) {
    const style = await figma.getStyleByIdAsync(node.fillStyleId);
    if (style?.type === 'PAINT' && style.name.startsWith('colors/')) {
      count++;
    }
  }

  // Verifica stroke styles
  if ('strokeStyleId' in node && node.strokeStyleId) {
    const style = await figma.getStyleByIdAsync(node.strokeStyleId);
    if (style?.type === 'PAINT' && style.name.startsWith('colors/')) {
      count++;
    }
  }

  // Processa filhos recursivamente
  if ('children' in node) {
    for (const child of node.children) {
      await countInNode(child);
    }
  }
}
```

### Nós Suportados
- **Frames**: Containers principais
- **Sections**: Seções organizacionais
- **Components**: Componentes reutilizáveis
- **Instances**: Instâncias de componentes
- **Shapes**: Formas geométricas
- **Text**: Elementos de texto
- **Qualquer nó** com propriedades `fillStyleId` ou `strokeStyleId`

## 🧪 Exemplos de Uso

### Caso de Uso Típico

**Cenário**: Frame com múltiplos elementos usando estilos legados

**Seleção:**
```
Frame "Header"
├── Rectangle (fill: colors/primary)
├── Text (fill: colors/text-primary)
└── Icon (stroke: colors/border-light)
```

**Resultado:**
- ✅ Rectangle: `colors/primary` → variável `colors/primary`
- ✅ Text: `colors/text-primary` → variável `colors/text-primary`
- ❌ Icon: `colors/border-light` → erro (variável não encontrada)

**Output:** "Convertidos: 2 | Falhas: 1"

## ⚠️ Limitações

- **Dependência de Variáveis**: Variáveis devem existir previamente no Figma
- **Prefixo Fixo**: Apenas estilos que começam com `colors/`
- **Mapeamento 1:1**: Nome do estilo deve corresponder exatamente ao nome da variável
- **Cache Estático**: Cache não se atualiza automaticamente durante a sessão

## 🔄 Melhorias Futuras

- [ ] Suporte a outros prefixos configuráveis
- [ ] Criação automática de variáveis ausentes
- [ ] Mapeamento customizável (estilo → variável)
- [ ] Preview das mudanças antes de aplicar
- [ ] Conversão reversa (variáveis → estilos)
- [ ] Cache dinâmico com invalidação inteligente

## 🛠️ Troubleshooting

### Problemas Comuns

**"Nenhum estilo detectado"**
- Verifique se os estilos começam com `colors/`
- Confirme que são estilos de PAINT (não TEXT)
- Certifique-se de que há nós com `fillStyleId` ou `strokeStyleId`

**"Variable not found"**
- Crie a variável correspondente no Figma
- Verifique se o nome da variável corresponde exatamente ao estilo
- Confirme que a variável é do tipo COLOR

**Conversão parcial**
- Alguns nós podem não ter acesso às propriedades de estilo
- Verificar se os nós são editáveis
- Confirmar permissões no arquivo Figma

## 🏗️ Arquitetura

O módulo segue o padrão arquitetural do MB Tools:
- **Event-Driven**: Responde a mudanças de seleção automaticamente
- **Cache-Optimized**: Minimiza chamadas custosas à API
- **Error-Resilient**: Continua processamento mesmo com falhas parciais
- **User-Centric**: Fornece feedback contínuo e detalhado