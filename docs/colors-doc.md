Perfeito! Aqui está a documentação **completa e detalhada** para a **implementação do módulo “Primary Color Generator”** no seu plugin Figma (MB Tools).

---

# 📘 Documentação Técnica: Módulo `Primary Color Generator`

Este módulo automatiza a criação e atualização do sistema de cores derivadas da variável `colors/primary`, gerando variações como `primary-dark`, `primary-hover`, `primary-high-emphasis` e `primary-low-emphasis` com base em um valor HEX inserido pelo usuário.

---

## ✅ Objetivo

* Gerar automaticamente tons derivados da `primary color`.
* Atualizar dinamicamente as variáveis `colors/primary-*` dentro do Figma.
* Manter consistência entre Design Tokens do sistema.

---

## 📁 Estrutura do Módulo

**Local:** `src/modules/primary-color-system/main.ts`
**Tipo:** Módulo isolado e independente
**Nome do módulo:** `primary`
**Handler:** `'generate-primary-system'`

---

## 🧩 Como funciona

1. O usuário informa uma cor base em HEX (ex: `#006633`).
2. O módulo calcula automaticamente:

   * `primary-dark`: escurecido (-40 RGB)
   * `primary-hover`: clareado (+40 RGB)
   * `primary-high-emphasis`: mistura com branco (40%)
   * `primary-low-emphasis`: mistura com branco (85%)
3. O plugin encontra as variáveis `colors/*` no Figma.
4. Substitui os valores das variáveis para o modo atual (`figma.variables.getLocalVariableCollections()[0]`).
5. Mostra uma notificação com o total de variáveis atualizadas.

---

## 📦 Requisitos

* As variáveis de cor devem seguir o padrão:

  ```
  colors/primary
  colors/primary-dark
  colors/primary-hover
  colors/primary-high-emphasis
  colors/primary-low-emphasis
  ```

* É necessário que exista **pelo menos um modo** ativo em `VariableCollection`.

---

## 🧠 Lógica de Cálculo das Cores

| Token                   | Base      | Transformação             |
| ----------------------- | --------- | ------------------------- |
| `primary`               | input HEX | sem alteração             |
| `primary-dark`          | input     | -40 RGB em cada canal     |
| `primary-hover`         | input     | +40 RGB em cada canal     |
| `primary-high-emphasis` | input     | mistura com branco em 40% |
| `primary-low-emphasis`  | input     | mistura com branco em 85% |

---

## 🧑‍💻 Código Completo do Módulo

**`src/modules/primary-color-system/main.ts`**

```ts
import type { Module } from '../../core/types';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function adjustColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (c: number) => Math.min(255, Math.max(0, c + amount));
  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

function mixWithWhite(hex: string, ratio: number): string {
  const base = hexToRgb(hex);
  const white = { r: 255, g: 255, b: 255 };
  const mix = (c1: number, c2: number) => Math.round(c1 * (1 - ratio) + c2 * ratio);
  return rgbToHex(
    mix(base.r, white.r),
    mix(base.g, white.g),
    mix(base.b, white.b)
  );
}

export const primaryColorModule: Module = {
  id: 'primary',
  name: 'Primary Color Generator',
  handlers: {
    'generate-primary-system': async (primaryHex: string) => {
      console.log('🎨 Primary base color received:', primaryHex);

      const tokens = {
        'primary': primaryHex,
        'primary-dark': adjustColor(primaryHex, -40),
        'primary-hover': adjustColor(primaryHex, 40),
        'primary-high-emphasis': mixWithWhite(primaryHex, 0.4),
        'primary-low-emphasis': mixWithWhite(primaryHex, 0.85),
      };

      const variableCollection = await figma.variables.getLocalVariablesAsync();
      const colorVariables = variableCollection.filter((v) => v.resolvedType === 'COLOR');

      const modeId = figma.variables.getLocalVariableCollections()[0]?.modes[0]?.modeId;
      if (!modeId) {
        figma.notify('❌ Nenhum modo encontrado nas variáveis.');
        return;
      }

      let updated = 0;
      for (const [name, hex] of Object.entries(tokens)) {
        const variable = colorVariables.find((v) => v.name === `colors/${name}`);
        if (!variable) {
          console.warn(`⚠️ Variável não encontrada: colors/${name}`);
          continue;
        }
        const rgb = hexToRgb(hex);
        const value: RGBA = {
          r: rgb.r / 255,
          g: rgb.g / 255,
          b: rgb.b / 255,
          a: 1
        };
        variable.setValueForMode(modeId, value);
        console.log(`✅ Atualizado: colors/${name} → ${hex}`);
        updated++;
      }

      figma.notify(`🎉 ${updated} variáveis atualizadas com sucesso!`);
      figma.ui.postMessage({ module: 'primary', type: 'done', updated });
    }
  }
};
```

---

## 🔗 Registro do Módulo

Atualize `src/modules/index.ts`:

```ts
import { primaryColorModule } from './primary-color-system/main';

export const modules: Module[] = [
  styleModule,
  iconsModule,
  primaryColorModule
];
```

---

## 🧪 Como chamar via interface

Exemplo de mensagem enviada pela UI:

```ts
figma.ui.postMessage({
  module: 'primary',
  type: 'generate-primary-system',
  payload: '#006633' // cor base inserida pelo usuário
});
```

---

## 💬 Mensagens retornadas

```ts
figma.ui.postMessage({
  module: 'primary',
  type: 'done',
  updated: 5
});
```

---

## 🔍 Logs úteis

Use o console do plugin para debug:

```ts
console.log('🎨 Primary base color received:', primaryHex);
console.warn(`⚠️ Variável não encontrada: colors/${name}`);
console.log(`✅ Atualizado: colors/${name} → ${hex}`);
```

---

## 🧼 Limitações e melhorias futuras

| Limite             | Solução possível                            |
| ------------------ | ------------------------------------------- |
| Só suporta um modo | Suporte multi-modo (light/dark)             |
| Tokens fixos       | Tornar os tokens dinâmicos ou configuráveis |
| Entrada manual     | Criar UI com campo de input e botão         |

---

## ✅ Checklist de Instalação

* [x] Criar arquivo `primary-color-system/main.ts`
* [x] Adicionar módulo ao `index.ts`
* [x] Garantir que as variáveis existam com nomes padrão
* [x] Usar a UI para enviar o HEX inicial