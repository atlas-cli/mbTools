# Icon Rename Module

Módulo para renomeação automática de componentes de ícone seguindo as convenções do Lucide Icons, convertendo nomes de kebab-case para PascalCase com validação.

## 📋 Visão Geral

Este módulo integra-se ao plugin MB Tools para padronizar a nomenclatura de ícones conforme as diretrizes do MyBenk Design System, que utiliza a biblioteca Lucide Icons como padrão.

## 🎯 Funcionalidades

- **Conversão kebab-case → PascalCase**: Transforma nomes como `arrow-left` em `ArrowLeft`
- **Validação Lucide**: Verifica se o nome convertido existe na biblioteca oficial
- **Processamento em Lote**: Renomeia múltiplos componentes simultaneamente
- **Relatório de Erros**: Lista nomes inválidos para revisão manual
- **Suporte a Component Sets**: Funciona com componentes individuais e conjuntos

## 🔄 Processo de Conversão

### Regra de Nomenclatura

```
kebab-case → PascalCase
```

| Entrada (kebab) | Saída (PascalCase) | Status |
|-----------------|-------------------|---------|
| `arrow-left` | `ArrowLeft` | ✅ Válido |
| `chevron-down` | `ChevronDown` | ✅ Válido |
| `user-profile` | `UserProfile` | ❌ Inválido* |

*\*Exemplo de nome que não existe na biblioteca Lucide*

### Algoritmo de Conversão

```typescript
function kebabToPascalCase(str: string) {
  return str
    .split('-')                           // ["arrow", "left"]
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))  // ["Arrow", "Left"]
    .join('');                           // "ArrowLeft"
}
```

## 📁 Dependências

### Arquivo de Validação
- **Localização**: `assets/lucide-names.json`
- **Formato**: Array de strings com nomes válidos do Lucide
- **Propósito**: Validar se o nome convertido existe na biblioteca oficial

```json
[
  "ArrowLeft",
  "ArrowRight",
  "ChevronDown",
  "ChevronUp",
  "User",
  "Settings"
]
```

## 🔧 Implementação

### Interface do Módulo

```typescript
export const iconsModule: Module = {
  id: 'icons',
  name: 'Icon Rename',
  handlers: {
    'rename-icons': () => { ... }
  }
};
```

### Fluxo de Execução

1. **Verificação de Seleção**: Valida se há componentes selecionados
2. **Iteração**: Processa cada nó selecionado
3. **Filtro de Tipo**: Aceita apenas `COMPONENT` ou `COMPONENT_SET`
4. **Conversão**: Aplica regra kebab → PascalCase
5. **Validação**: Verifica existência no `lucide-names.json`
6. **Aplicação**: Renomeia se válido, adiciona à lista de inválidos se não
7. **Relatório**: Exibe resultados e envia para UI

### Tipos de Nós Suportados
- `COMPONENT`: Componente individual
- `COMPONENT_SET`: Conjunto de variantes de componente

## 🖥️ Interface do Usuário

### Componentes
- **Botão "Renomear Componentes"**: Inicia o processo
- **Status**: Exibe progresso e resultados
- **Lista de Inválidos**: Mostra nomes que falharam na validação

### Estados da Interface
- `default`: Pronto para renomeação
- `processing`: "Renomeando..." (durante execução)
- `success`: Resultados com estatísticas
- `warning`: Lista de nomes inválidos para revisão

## 📨 Comunicação UI ↔ Backend

### Mensagem de Entrada
```typescript
{
  module: 'icons',
  type: 'rename-icons'
  // Não requer payload - usa seleção atual
}
```

### Mensagem de Resposta
```typescript
{
  module: 'icons',
  type: 'done',
  invalidNames: ['UserProfile', 'CustomIcon']
}
```

## 📊 Logs e Feedback

### Console Logs
```
✅ Renomeado: "arrow-left" → "ArrowLeft"
✅ Renomeado: "chevron-down" → "ChevronDown"
❌ Nomes inválidos (2) — copie e cole no lucide-names.json se forem válidos:
[
  "UserProfile",
  "CustomIcon"
]
```

### Notificação Figma
```
3 renomeado(s), 2 inválido(s).
```

### Interface Status
- **Sucesso**: `"✅ Todos os nomes são válidos!"`
- **Aviso**: `"⚠️ Alguns nomes são inválidos:"`

## 🧪 Exemplos de Uso

### Caso de Uso Típico

**Seleção:**
- Componente: `arrow-left`
- Componente: `user-settings`
- Component Set: `chevron-variants`

**Resultado:**
- ✅ `arrow-left` → `ArrowLeft` (renomeado)
- ❌ `user-settings` → `UserSettings` (inválido)
- ✅ `chevron-variants` → `ChevronVariants` (renomeado)

**Output:** 2 renomeado(s), 1 inválido(s).

## ⚠️ Limitações

- **Dependência do Arquivo**: Requer `lucide-names.json` atualizado
- **Apenas Componentes**: Não funciona com outros tipos de nó
- **Validação Estrita**: Apenas nomes exatos do Lucide são aceitos
- **Sem Seleção Múltipla**: Não oferece seleção granular por componente

## 🔄 Melhorias Futuras

- [ ] Suporte a outras bibliotecas de ícones
- [ ] Preview das mudanças antes de aplicar
- [ ] Opção de ignorar validação Lucide
- [ ] Busca fuzzy para sugestões de nomes similares
- [ ] Backup automático dos nomes originais
- [ ] Integração com APIs de bibliotecas de ícones

## 🛠️ Manutenção

### Atualização do lucide-names.json

Para adicionar novos ícones válidos:

1. Acesse [Lucide Icons](https://lucide.dev/icons/)
2. Copie nomes em PascalCase
3. Adicione ao array em `assets/lucide-names.json`
4. Rebuilde o plugin

```json
[
  "ArrowLeft",
  "NewIconName",  // ← Adicionar aqui
  "AnotherIcon"   // ← E aqui
]
```

### Debugging

Se nomes válidos aparecem como inválidos:
1. Verifique se estão em `lucide-names.json`
2. Confirme que a conversão kebab→Pascal está correta
3. Verifique se o arquivo JSON está sendo importado corretamente

## 🏗️ Arquitetura

O módulo segue o padrão arquitetural do MB Tools:
- **Stateless**: Não mantém estado entre execuções
- **Selection-Based**: Opera na seleção atual do Figma
- **Validation-First**: Valida antes de modificar
- **User-Feedback**: Fornece feedback detalhado ao usuário