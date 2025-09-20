## Visão Geral
O **MB Tools** é um plugin Figma modular para automatizar processos do **Design System MyBenk**.  
A arquitetura segue o padrão **modular orientado a handlers**, onde cada módulo é independente e registrado no `src/modules`.

---

## Estrutura de Pastas

```
src/
├── core/            # Tipos e contratos (interfaces Module, Handler, etc.)
├── modules/         # Módulos independentes
│   ├── style-to-variable/
│   ├── icon-rename/
│   ├── color-palette/
├── ui/              # Interface (HTML/CSS/JS)
├── main.ts          # Entry point do plugin
assets/              # Recursos estáticos (logo, ícones Lucide)
docs/                # Documentação técnica
```

---

## Padrões de Arquitetura

- **Command Handler Pattern**  
  Cada módulo expõe `handlers` associados a tipos de mensagem (`figma.ui.postMessage → handler`).

- **Modularidade**  
  Adição de novos módulos exige apenas registrá-los em `src/modules/index.ts`.

- **Type Safety**  
  Interfaces (`Module`, `Handler`, `UIMsg`) centralizadas em `src/core/types.ts`.

- **UI ↔ Backend Communication**  
  Mensageria via `figma.ui.postMessage` e `figma.ui.onmessage`.

---

## Módulos Existentes

### 🎨 Style to Variable
- **Propósito:** Migrar estilos `colors/*` para variáveis, facilitando adoção do novo sistema de tokens.  
- **Algoritmos:** Varre seleção, detecta estilos, converte para `figma.variables`.  
- **Pattern:** Cache Map para reduzir chamadas.  
- **Local:** `src/modules/style-to-variable/`.

### 🔤 Icon Rename
- **Propósito:** Renomear componentes de ícones (kebab → PascalCase).  
- **Dependência:** `assets/lucide-names.json` para validação.  
- **Output:** Relata inválidos na UI.  
- **Local:** `src/modules/icon-rename/`.

### 🌈 Color Palette
- **Propósito:** Gerar paleta baseada em cor primária HEX.  
- **Algoritmo:** HSL com regras condicionais (hover, dark, emphasis).  
- **Entrega:** Criação automática na coleção `colors-tokens` com modos `light` e `dark`.  
- **Local:** `src/modules/color-palette/`.

---

## Fluxo de Execução

```
Usuário → UI (index.html) → postMessage
   → src/main.ts (dispatcher)
      → módulo (handler)
         → lógica interna
         → feedback via figma.notify / postMessage UI
```

---

## Extensibilidade
- Novos módulos podem ser criados repetindo o contrato `Module` em `src/core/types.ts`.
- Seguir convenção de `id`, `name`, e `handlers`.
- Registrar em `src/modules/index.ts`.