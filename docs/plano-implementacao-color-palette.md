# 🎯 Plano de Implementação: Módulo Color Palette

## 📋 Análise das Documentações

### Comparação entre Versões
- **colors-doc.md**: Implementação mais simples usando RGB com operações básicas (+40/-40)
- **colors-docv2.md**: Implementação avançada usando HSL com regras complexas baseadas na luminosidade

### Recomendação
Usar a **versão v2 (HSL)** por ser mais precisa e alinhada com teoria de cores, oferecendo resultados mais consistentes para diferentes tipos de cor base.

---

## 🚀 Fases de Implementação

### Fase 1: Estrutura Base do Módulo
**Prazo: 2-3 horas**

#### 1.1 Criar estrutura de arquivos
```
src/modules/color-palette/
├── main.ts
└── types.ts (opcional)
```

#### 1.2 Implementar funções de conversão de cores
- `hexToRgb()`: HEX → RGB normalizado (0-1)
- `rgbToHsl()`: RGB → HSL
- `hslToRgb()`: HSL → RGB
- `rgbToHex()`: RGB → HEX formatado

#### 1.3 Definir interface do módulo
- Module ID: `'color-palette'`
- Handler: `'generate-palette'`
- Payload: `{ hex: string }`

### Fase 2: Lógica de Geração de Paleta
**Prazo: 3-4 horas**

#### 2.1 Implementar algoritmo HSL
Regras baseadas na luminosidade da cor base:

```typescript
// Para L > 0.3 (cores mais claras)
primary-dark: { H: base, S: base, L: 0.125 }
primary-hover: { H: base, S: base, L: 0.29 }
primary-high-emphasis: { H: base, S: base + 0.18, L: 1.05 - base }
primary-low-emphasis: { H: base, S: base - 0.13, L: 0.93 }

// Para L ≤ 0.3 (cores mais escuras)
primary-dark: { H: base, S: base, L: 0.125 }
primary-hover: { H: base, S: base * 0.65, L: 0.29 }
primary-high-emphasis: { H: base, S: 0.25, L: 1.05 - base }
primary-low-emphasis: { H: base, S: 0.3, L: 0.93 }
```

#### 2.2 Implementar clamping
- Garantir S e L entre 0 e 1
- Tratar casos extremos

#### 2.3 Criar função principal `generateColorPalette`
- Receber HEX de entrada
- Calcular todas as variações
- Retornar objeto com todas as cores

### Fase 3: Integração com Figma Variables API
**Prazo: 2-3 horas**

#### 3.1 Gerenciamento de coleção "Primary"
- Buscar coleção existente ou criar nova
- Garantir modo padrão existe

#### 3.2 Criação/atualização de variáveis
- `colors/primary`
- `colors/primary-dark`
- `colors/primary-hover`
- `colors/primary-high-emphasis`
- `colors/primary-low-emphasis`

#### 3.3 Aplicação de valores
- Converter HEX para formato RGBA do Figma
- Usar `setValueForMode()` para cada variável

### Fase 4: Interface do Usuário
**Prazo: 2-3 horas**

#### 4.1 Adicionar nova aba na UI
Editar `src/ui/index.html`:
```html
<!-- Na navegação -->
<button id="tab-color">Color Palette</button>

<!-- No conteúdo -->
<div id="panel-color" class="panel">
  <input id="hexInput" type="text" placeholder="#4133A6" />
  <button id="btnGenerate" class="btn">Gerar e Aplicar</button>
  <div id="colorStatus" class="status-box"></div>
</div>
```

#### 4.2 Implementar validação de HEX
- Regex: `/^#([0-9A-F]{3}|[0-9A-F]{6})$/i`
- Feedback visual em tempo real

#### 4.3 Comunicação UI ↔ Backend
- Envio: `{ module: 'color-palette', type: 'generate-palette', payload: hex }`
- Recebimento: status de sucesso/erro

### Fase 5: Registro e Integração
**Prazo: 30 minutos**

#### 5.1 Registrar módulo
Editar `src/modules/index.ts`:
```typescript
import { colorPaletteModule } from './color-palette/main';

export const modules: Module[] = [
  styleModule,
  iconsModule,
  colorPaletteModule
];
```

#### 5.2 Atualizar tipos se necessário
Verificar `src/core/types.ts` para novos tipos.

---

## 🧪 Estratégia de Testes

### Testes Manuais Obrigatórios
1. **Cores claras**: `#4133A6` (roxo claro)
2. **Cores escuras**: `#1a1a1a` (quase preto)
3. **Cores saturadas**: `#FF0000` (vermelho puro)
4. **Cores dessaturadas**: `#808080` (cinza)
5. **Casos extremos**: `#FFFFFF`, `#000000`

### Validações
- [ ] Coleção "Primary" é criada corretamente
- [ ] Todas as 5 variáveis são geradas
- [ ] Valores HSL seguem as regras definidas
- [ ] Interface responde adequadamente
- [ ] Notificações do Figma funcionam

---

## ⚠️ Pontos de Atenção

### Limitações Conhecidas
1. **Modo único**: Funciona apenas no modo padrão da coleção
2. **Sobrescrita**: Substitui variáveis existentes sem confirmação
3. **Precisão**: Pequenas discrepâncias com valores manuais são normais

### Possíveis Problemas
- **Performance**: Conversões HSL podem ser custosas com muitas cores
- **Compatibilidade**: Versões antigas do Figma podem não suportar Variables API
- **Validação**: HEX inválidos devem ser rejeitados antes do processamento

---

## 📦 Entregáveis

### Arquivos a serem criados/modificados:
- [ ] `src/modules/color-palette/main.ts` (novo)
- [ ] `src/modules/index.ts` (modificado)
- [ ] `src/ui/index.html` (modificado)

### Funcionalidades entregues:
- [ ] Geração automática de paleta de 5 cores
- [ ] Algoritmo HSL com regras baseadas em luminosidade
- [ ] Interface intuitiva com validação
- [ ] Integração completa com Figma Variables
- [ ] Feedback visual e notificações

---

## 🎯 Critérios de Sucesso

1. **Funcional**: Usuário insere HEX e obtém paleta completa
2. **Preciso**: Cores geradas seguem teoria de cores
3. **Integrado**: Funciona nativamente com o sistema de variáveis do Figma
4. **Robusto**: Trata erros e casos extremos adequadamente
5. **Consistente**: Mantém padrões do plugin existente

---

**Tempo total estimado: 8-12 horas de desenvolvimento**