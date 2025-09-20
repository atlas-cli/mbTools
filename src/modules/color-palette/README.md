# Color Palette Module

Módulo para geração automática de paleta de cores primária a partir de um valor HEX base, aplicando as cores como variáveis Figma nos modos `light` e `dark`.

## 📋 Visão Geral

Este módulo integra-se ao plugin MB Tools para automatizar a criação de variações de cores baseadas em teoria de cores (HSL), gerando uma paleta consistente para Design Systems.

## 🎯 Funcionalidades

- **Geração HSL Inteligente**: Calcula variações usando regras HSL baseadas na luminosidade da cor base
- **Aplicação Dual-Mode**: Aplica a mesma cor nos modos `light` e `dark` automaticamente
- **Estrutura Hierárquica**: Cria variáveis com nomenclatura organizada em `colors/primary/`
- **Validação HEX**: Valida formato de entrada (#RGB ou #RRGGBB)
- **Interface Integrada**: UI com preview visual das cores geradas

## 🎨 Variações Geradas

A partir de uma cor primária (ex: `#4133A6`), o módulo gera:

| Token | Descrição | Regra HSL |
|-------|-----------|-----------|
| `primary` | Cor base original | Sem alteração |
| `primary-dark` | Tom escuro | L = 0.125 (12.5%) |
| `primary-hover` | Tom para hover | L = 0.29 (29%) |
| `primary-high-emphasis` | Tom de alta ênfase | L = 1.05 - L_base |
| `primary-low-emphasis` | Tom de baixa ênfase | L = 0.93 (93%) |

### Regras Condicionais (HSL)

**Para cores claras (L > 0.3):**
- `hover`: S mantida
- `high-emphasis`: S + 0.18
- `low-emphasis`: S - 0.13

**Para cores escuras (L ≤ 0.3):**
- `hover`: S × 0.65
- `high-emphasis`: S = 0.25
- `low-emphasis`: S = 0.3

## 📁 Estrutura das Variáveis

```
Coleção: colors-tokens
├── Modo: light
│   ├── colors/primary/primary
│   ├── colors/primary/primary-dark
│   ├── colors/primary/primary-hover
│   ├── colors/primary/primary-high-emphasis
│   └── colors/primary/primary-low-emphasis
└── Modo: dark
    ├── colors/primary/primary
    ├── colors/primary/primary-dark
    ├── colors/primary/primary-hover
    ├── colors/primary/primary-high-emphasis
    └── colors/primary/primary-low-emphasis
```

## 🔧 Implementação

### Interface do Módulo

```typescript
export const colorPaletteModule: Module = {
  id: 'color-palette',
  name: 'Color Palette Generator',
  handlers: {
    'generate-palette': async (payload: { hex: string }) => { ... }
  }
};
```

### Funções Principais

#### `generateColorPalette(baseHex: string)`
Gera paleta de cores baseada em regras HSL condicionais.

#### `getOrCreateColorsTokensCollection()`
Busca/cria coleção `colors-tokens` com modos `light` e `dark`.

#### `applyPaletteToFigma(palette: Record<string, string>)`
Aplica cores nas variáveis Figma em ambos os modos.

### Funções Auxiliares

- `hexToRgb()`: Conversão HEX → RGB normalizado
- `rgbToHsl()`: Conversão RGB → HSL
- `hslToRgb()`: Conversão HSL → RGB
- `rgbToHex()`: Conversão RGB → HEX
- `hexToFigmaRGBA()`: Conversão HEX → formato RGBA do Figma

## 🖥️ Interface do Usuário

### Componentes
- **Campo HEX**: Input com validação em tempo real
- **Botão Gerar**: Habilitado apenas com HEX válido
- **Status Box**: Feedback visual do processo
- **Preview**: Visualização das cores geradas com miniaturas

### Estados da Interface
- `default`: Aguardando entrada válida
- `ready`: HEX válido, pronto para gerar
- `busy`: Processando paleta
- `success`: Paleta aplicada com preview
- `error`: Erro com mensagem detalhada

## 📨 Comunicação UI ↔ Backend

### Mensagem de Entrada
```typescript
{
  module: 'color-palette',
  type: 'generate-palette',
  payload: { hex: '#4133A6' }
}
```

### Mensagens de Resposta

**Sucesso:**
```typescript
{
  module: 'color-palette',
  type: 'palette-applied',
  payload: {
    palette: { 'colors/primary/primary': '#4133A6', ... },
    updatedCount: 5,
    baseColor: '#4133A6'
  }
}
```

**Erro:**
```typescript
{
  module: 'color-palette',
  type: 'error',
  payload: {
    message: 'Formato HEX inválido. Use #RGB ou #RRGGBB',
    hex: 'invalid'
  }
}
```

## 🧪 Exemplos de Uso

### Teste via Console
```javascript
// No console do plugin Figma
parent.postMessage({
  pluginMessage: {
    module: 'color-palette',
    type: 'generate-palette',
    payload: { hex: '#4133A6' }
  }
}, '*');
```

### Cores de Exemplo

**Input: `#4133A6` (roxo)**
- `primary`: `#4133A6`
- `primary-dark`: `#2A1F6B`
- `primary-hover`: `#5A4FC7`
- `primary-high-emphasis`: `#D4CDF0`
- `primary-low-emphasis`: `#F0EDFA`

**Input: `#006833` (verde)**
- `primary`: `#006833`
- `primary-dark`: `#004020`
- `primary-hover`: `#1A7A4A`
- `primary-high-emphasis`: `#CFE2D9`
- `primary-low-emphasis`: `#E8F3ED`

## ⚠️ Limitações

- **Aplicação Simétrica**: Mesma cor aplicada em light/dark (não há diferenciação automática)
- **Coleção Fixa**: Sempre usa coleção `colors-tokens`
- **Tokens Fixos**: Gera sempre os 5 tokens padrão
- **Validação Básica**: Apenas valida formato HEX, não range de cores

## 🔄 Melhorias Futuras

- [ ] Suporte a cores diferentes para light/dark
- [ ] Configuração de tokens customizáveis
- [ ] Múltiplas coleções de destino
- [ ] Palette de cores complementares
- [ ] Exportação para outros formatos (CSS, JSON)

## 📈 Logs e Debug

O módulo produz logs detalhados no console:

```
🎨 Iniciando geração de paleta para: #4133A6
🎨 Paleta gerada: {...}
✅ Coleção "colors-tokens" encontrada
✅ Modo "light" encontrado
✅ Modo "dark" encontrado
✅ Atualizado: colors/primary/primary → #4133A6 (light e dark)
...
✅ 5 variáveis de cor atualizadas na coleção "colors-tokens"
```

## 🏗️ Arquitetura

O módulo segue o padrão arquitetural do MB Tools:
- **Modular**: Função independente exportada
- **Type-Safe**: TypeScript com interfaces definidas
- **Error-Handling**: Tratamento robusto de erros
- **UI-Integrated**: Interface nativa do plugin