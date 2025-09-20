Documentação de Implementação do Módulo Color Palette
Visão Geral
O módulo Color Palette é uma funcionalidade independente desenvolvida para o plugin Figma, projetada para gerar automaticamente uma paleta de cores derivada a partir de uma cor primária fornecida pelo usuário (no formato HEX). Este módulo cria variações de tons (como primary-dark, primary-hover, primary-high-emphasis e primary-low-emphasis) com base em regras algorítmicas consistentes e aplica essas variações como variáveis de cor no Figma, utilizando a coleção de variáveis chamada "Primary". A implementação evita interferência com outros módulos existentes (style-to-variable e icon-rename).
Objetivo
Permitir que designers insiram uma cor primária (ex.: #4133A6) e obtenham automaticamente uma paleta completa de variações, mapeando-as para variáveis no Figma, facilitando a consistência visual em Design Systems.
Requisitos

Entrada do Usuário: Um valor HEX válido (ex.: #RRGGBB ou #RGB).
Saída: Cinco variáveis de cor na coleção "Primary" no Figma, com os seguintes nomes e valores calculados:
primary: Cor base inserida.
primary-dark: Tom escuro da base.
primary-hover: Tom para estados de interação (hover).
primary-high-emphasis: Tom de alta ênfase (contraste elevado).
primary-low-emphasis: Tom de baixa ênfase (claro e sutil).


Integração: Funcionar como uma aba separada na interface do plugin, sem conflitos com outros módulos.
Validação: Garantir que o HEX seja válido antes de processar.

Padrão de Cálculo das Variações
As variações são calculadas convertendo o HEX para o espaço de cor HSL (Hue, Saturation, Lightness) e aplicando regras específicas. O Hue (H) é preservado para manter a tonalidade original, enquanto Saturation (S) e Lightness (L) são ajustados com base na claridade da cor base (L > 0.3 ou L ≤ 0.3).
Regras Detalhadas

primary: HEX inserido diretamente, sem alteração.
primary-dark:
L = 0.125 (12.5%).
S = S da base.


primary-hover:
L = 0.29 (29%).
S = S da base se L > 0.3; S = S da base * 0.65 se L ≤ 0.3 (redução para evitar excesso de vibração em tons escuros).


primary-high-emphasis:
L = 1.05 - L da base (inverte a claridade para ênfase).
S = S da base + 0.18 se L > 0.3; S = 0.25 se L ≤ 0.3 (saturação fixa baixa para tons pastéis).


primary-low-emphasis:
L = 0.93 (93%).
S = S da base - 0.13 se L > 0.3; S = 0.3 se L ≤ 0.3 (saturação moderada para suavidade).


Clamping: S e L são limitados entre 0 e 1 para evitar valores inválidos.

Conversões

HEX → RGB → HSL para cálculo.
HSL → RGB → HEX para saída, garantindo compatibilidade com Figma.

Estrutura do Código
1. Interface do Usuário (src/ui/index.html)

Adições:
Nova aba <button id="tab-color">Color Palette</button> na <nav>.
Novo painel <div id="panel-color"> na <section> com:
Campo de entrada <input id="hexInput"> para HEX.
Botão <button id="btnGenerate">Gerar e Aplicar</button>.
Status <div id="colorStatus"> para feedback.




Estilização: Reutiliza classes existentes (.btn, .status-box, etc.) para consistência.
Script:
Função showTab expandida para incluir a aba "color".
Validação de HEX com regex (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i).
Evento oninput no <input> para habilitar/desabilitar o botão com base na validade.
Evento onclick no botão para enviar mensagem ao backend.
Manipulação de respostas via window.onmessage para atualizar o status.



2. Lógica do Módulo (src/modules/color-palette/main.ts)

Funções Auxiliares:
hexToRgb: Converte HEX para RGB normalizado (0-1).
rgbToHsl: Converte RGB para HSL.
hslToRgb: Converte HSL de volta para RGB.
rgbToHex: Converte RGB para HEX formatado.


Função Principal generateColorPalette:
Recebe o HEX base.
Converte para HSL e aplica as regras de variação.
Cria ou atualiza a coleção "Primary" no Figma.
Define valores para cada variável no modo default usando setValueForMode.
Envia notificações e mensagens de retorno via figma.ui.postMessage.



3. Integração (src/modules/index.ts e src/main.ts)

index.ts: Exporta generateColorPalette para inclusão no plugin.
main.ts: Adiciona tratamento de mensagem color-palette no onmessage.

Fluxo de Execução

Usuário insere um HEX (ex.: #4133A6) e clica em "Gerar e Aplicar".
Validação verifica o formato; se inválido, exibe erro no status.
Se válido, o plugin envia { module: 'color-palette', type: 'generate', hex } ao backend.
generateColorPalette processa o HEX, calcula variações e atualiza as variáveis.
Figma exibe notificação de sucesso ou erro.
UI recebe { module: 'color-palette', type: 'done' } ou { type: 'error' } e atualiza o status.

Dependências

Figma Plugin API (figma.variables).
Nenhuma dependência externa além do TypeScript e do ambiente do plugin.

Limitações e Considerações

Precisão: Pequenas discrepâncias podem ocorrer devido a ajustes manuais no Design System original (ex.: saturação no primary-low-emphasis verde).
Escopo: Funciona apenas no modo default da coleção; suporte a múltiplos modos requer extensão.
Segurança: Não valida se a coleção "Primary" já contém variáveis conflitantes; sobrescreve se existir.
Performance: Adequado para uso interativo, mas pode ser otimizado para lotes com muitas cores.

Testes e Validação

Teste com #4133A6 (roxo da imagem 1): Resultados próximos aos valores originais (ex.: primary-dark ≈ #130F31).
Teste com #006833 (verde da imagem 2): Replicação de tons muted (ex.: primary-hover ≈ #197547).
Verifique no Figma se as variáveis são criadas/atualizadas corretamente.

Instruções de Implantação

Adicione os trechos de código ao projeto conforme descrito.
Execute node build.js (ou --watch) para recompilar o plugin.
Carregue o plugin atualizado no Figma e teste com diferentes HEX.

Manutenção

Atualize as regras HSL em main.ts se o Design System evoluir.
Adicione suporte a modos adicionais ou validação de conflitos, se necessário.
