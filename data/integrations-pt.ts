import type { Integration, SupportLevel } from '@/data/integrations';

// Portuguese texts of data/integrations.ts, per tool slug. Paths, file names, config keys,
// hook names and command ids stay as the tools spell them; only the prose is translated.

type IntegrationText = Pick<Integration, 'installs' | 'mcp' | 'hooks' | 'meshSignal'>;

export const SUPPORT_LEVEL_LABEL_PT: Record<SupportLevel, string> = {
  core: 'Suporte principal',
  community: 'Suporte da comunidade',
};

export const SUPPORT_LEVEL_SUMMARY_PT: Record<SupportLevel, string> = {
  core: 'O mantenedor ou um responsável pela área usa todo dia; uma regressão causada por mudança do fabricante é corrigida antes da próxima release.',
  community:
    'Instalada, registrada e testada no CI como todas as outras ferramentas; uma mudança do fabricante que a quebre espera um relato ou um pull request.',
};

const notRegistered = (name: string) =>
  `Não registrados: o egc init e os instaladores gravam os servidores em dez ferramentas, e ${name} não é uma delas. Se ela tiver uma configuração de MCP própria, você pode adicioná-los à mão.`;

const SHIM = 'Token Crusher pelo shim no nível do PATH';

export const INTEGRATIONS_PT: Record<string, IntegrationText> = {
  'claude-code': {
    installs:
      'Skills instaladas direto em ~/.claude/skills/<name>/SKILL.md; o protocolo de memória vai para ~/.claude/CLAUDE.md.',
    mcp: 'Registrados pela própria CLI do Claude Code (claude mcp add -s user), pelo egc init e pelos instaladores.',
    hooks:
      'Guardian e Token Crusher rodam pelos hooks do Claude Code no settings.json, mais um hook SessionStart que restaura o estado.',
    meshSignal: 'Um hook UserPromptSubmit injeta o aviso da malha a cada prompt.',
  },
  antigravity: {
    installs:
      'Skills, agents, rules e commands em .agents/ em cada projeto; a instalação na home vai para ~/.gemini pelo destino egc.',
    mcp: 'Registrados pelo egc init e pelos instaladores.',
    hooks: 'Hooks do Guardian (GateGuard) registrados por projeto.',
    meshSignal:
      'O hook nomeado egc-mesh-notice no PreInvocation, em .agents/hooks.json (projeto) e ~/.gemini/config/hooks.json (global): ele injeta uma mensagem efêmera quando o armazenamento do barramento muda, já que o Antigravity não tem UserPromptSubmit.',
  },
  cursor: {
    installs:
      'Regras injetadas no cursor.rules global em ~/.cursor/; é o adaptador mais exercitado na suíte de testes.',
    mcp: '~/.cursor/mcp.json, gravado pelo egc init e pelos instaladores.',
    hooks: `Os hooks do Cursor observam e bloqueiam comandos para o Guardian; ${SHIM}.`,
    meshSignal: null,
  },
  'codex-cli': {
    installs:
      'Skills instaladas direto em ~/.agents/skills/<name>/SKILL.md; instruções persistentes acrescentadas.',
    mcp: '~/.codex/config.toml, gravado pelo egc init e pelos instaladores.',
    hooks: 'Hooks em ~/.codex/hooks.json.',
    meshSignal: 'O mesmo arquivo de hooks injeta o aviso da malha como contexto adicional.',
  },
  opencode: {
    installs:
      'Skills, commands, instruções e prompts em ~/.config/opencode/, ao lado do plugin do EGC (um módulo ES).',
    mcp: '~/.config/opencode/opencode.json, na chave mcp, no formato do próprio OpenCode, em todas as plataformas.',
    hooks: 'Guardian e Token Crusher rodam pelos eventos nativos de plugin.',
    meshSignal: null,
  },
  codebuddy: {
    installs: 'Skills em .codebuddy/skills/<name>/SKILL.md em cada projeto; injeção de contexto.',
    mcp: notRegistered('o CodeBuddy'),
    hooks: `Guardian pelos hooks que o adaptador liga na configuração do CodeBuddy do projeto; ${SHIM}.`,
    meshSignal: null,
  },
  windsurf: {
    installs:
      'Skills instaladas direto em ~/.codeium/windsurf/skills/<name>/SKILL.md. Era Windsurf até 2026-06-02: o fabricante manteve os caminhos ~/.codeium/windsurf, então o id do destino continua windsurf.',
    mcp: notRegistered('o Devin Desktop'),
    hooks: `Guardian e GateGuard como hooks PreToolUse na configuração do próprio Devin Local (~/.config/devin/config.json, %APPDATA%\\devin no Windows), com os matchers que a migração do próprio Devin usa; ${SHIM}.`,
    meshSignal: null,
  },
  amp: {
    installs:
      'Skills instaladas direto em ~/.amp/skills/<name>/SKILL.md; o plugin em .amp/plugins/ (projeto) ou ~/.config/amp/plugins/ (home).',
    mcp: notRegistered('o Amp'),
    hooks:
      'Guardian e Token Crusher pela API de plugins do Amp (tool.call), rodando dentro do processo pelo próprio runtime do Amp.',
    meshSignal: 'Um plugin agent.start devolve o aviso da malha como mensagem de contexto oculta.',
  },
  'vs-code-copilot': {
    installs:
      'Skills instaladas direto em ~/.copilot/skills/<name>/SKILL.md, uma das pastas de onde o VS Code lê skills pessoais.',
    mcp: notRegistered('o VS Code Copilot'),
    hooks: `Guardian pelos hooks que o adaptador liga nas configurações do Copilot; ${SHIM}.`,
    meshSignal: null,
  },
  zed: {
    installs:
      'Skills instaladas direto na pasta compartilhada ~/.agents/skills/<name>/, a única pasta global que o Zed lê (também usada por Codex, Goose, OpenHands e Crush); o protocolo de memória vai para ~/.config/zed/AGENTS.md.',
    mcp: 'context_servers no settings.json, gravado pelo egc init e pelos instaladores.',
    hooks: `Nenhuma superfície de hooks documentada; ${SHIM}.`,
    meshSignal: null,
  },
  kiro: {
    installs:
      'Skills em ~/.kiro/skills/<name>/ (home) e .kiro/skills/<name>/ (projeto); agents, documentos de steering, hooks e configurações entregues pelo pipeline unificado do Tier 1.',
    mcp: 'Registrados pelo egc init e pelos instaladores.',
    hooks: 'Documentos de hook do Kiro.',
    meshSignal:
      'Um documento de hook em .kiro/hooks/egc-mesh-notice.json (projeto e home) cuja saída vira contexto do agent.',
  },
  trae: {
    installs:
      'Skills em .trae/skills/<name>/ em cada projeto; commands, agents, rules e o protocolo de memória pelo script de instalação do Trae (TRAE_ENV=cn para o Trae CN).',
    mcp: notRegistered('o Trae'),
    hooks: 'Hooks em .trae/hooks.json.',
    meshSignal:
      'O mesmo arquivo de hooks injeta o aviso da malha; a saída do hook vira contexto do modelo.',
  },
  'jetbrains-junie': {
    installs:
      'Diretrizes do projeto em .junie/guidelines.md, o caminho de descoberta nativo do Junie.',
    mcp: notRegistered('o JetBrains Junie'),
    hooks: `Guardian pelos hooks que o adaptador liga na configuração do Junie; ${SHIM}.`,
    meshSignal: null,
  },
  goose: {
    installs:
      'Skills instaladas direto em ~/.agents/skills/<name>/SKILL.md, a raiz que o Codex já usa.',
    mcp: notRegistered('o Goose'),
    hooks:
      'Guardian por um hook PreToolUse de verdade em ~/.agents/plugins/egc-guardian/; sem Token Crusher (só permitir e negar).',
    meshSignal: null,
  },
  openhands: {
    installs:
      'Skills instaladas direto em ~/.agents/skills/<name>/SKILL.md; hooks em .openhands/hooks.json em cada projeto.',
    mcp: notRegistered('o OpenHands'),
    hooks: 'Guardian por um hook pre_tool_use de verdade, no escopo do projeto; sem Token Crusher.',
    meshSignal: null,
  },
  aider: {
    installs:
      'Skills copiadas direto como .aider/skills/<name>.md em cada projeto e incluídas na lista read do .aider.conf.yml.',
    mcp: notRegistered('o Aider'),
    hooks: `Nenhuma superfície de hooks documentada; ${SHIM}.`,
    meshSignal: null,
  },
  cline: {
    installs:
      'Regras achatadas em .clinerules/ em cada projeto, com nomes de arquivo prefixados para não colidirem.',
    mcp: notRegistered('o Cline'),
    hooks: `Guardian pelo hook PreToolUse em .clinerules/hooks, que a extensão do VS Code e a CLI do Cline rodam (as ferramentas de terminal das duas, execute_command e run_commands, são avaliadas); ${SHIM}.`,
    meshSignal: null,
  },
  warp: {
    installs:
      'Skills copiadas direto para .warp/skills/<name>.md, com um índice curto incluído no AGENTS.md do projeto, que o Warp lê como regras do projeto.',
    mcp: notRegistered('o Warp'),
    hooks: `Nenhuma superfície de hooks documentada; ${SHIM}.`,
    meshSignal: null,
  },
  'qwen-code': {
    installs:
      'Skills instaladas direto em .qwen/skills/<name>/SKILL.md em cada projeto, descobertas nativamente pelo Qwen Code.',
    mcp: notRegistered('o Qwen Code'),
    hooks: `Guardian pelos hooks que o adaptador liga nas configurações do Qwen; ${SHIM}.`,
    meshSignal: null,
  },
  'kimi-code': {
    installs:
      'Skills instaladas direto em ~/.kimi-code/skills/<name>/SKILL.md, com agents, commands e rules como pastas de biblioteca na mesma raiz; o KIMI_CODE_HOME muda a raiz inteira.',
    mcp: 'Registrados em ~/.kimi-code/mcp.json (ou $KIMI_CODE_HOME/mcp.json) pelo egc init e pelos instaladores, no formato padrão mcpServers.',
    hooks: `Ainda sem hooks: o array [[hooks]] do config.toml espera a verificação em máquina da mesclagem do TOML e do matcher do Bash, do mesmo jeito que Warp e Qwen adiam os seus; ${SHIM}.`,
    meshSignal: null,
  },
  crush: {
    installs:
      'Skills instaladas direto em ~/.agents/skills/<name>/SKILL.md, a raiz que Codex, Goose e OpenHands compartilham; agents, commands e rules como pastas de biblioteca em ~/.config/crush/ ($XDG_CONFIG_HOME/crush ou $CRUSH_GLOBAL_CONFIG são respeitados); o protocolo de memória vai para ~/.config/crush/CRUSH.md.',
    mcp: 'Registrados na chave mcp do crush.json pelo egc init e pelos instaladores, no formato stdio que o Crush lê.',
    hooks:
      'Guardian como hook PreToolUse em bash, edit, write e multiedit, e Token Crusher em bash, os dois ligados no crush.json.',
    meshSignal: null,
  },
  auggie: {
    installs:
      'Skills instaladas direto em .augment/skills/<name>/SKILL.md, commands direto em .augment/commands/<name>.md e rules achatadas em .augment/rules/*.md, as três famílias que o Auggie lê nativamente, na home (~/.augment) e em cada projeto; os agents vão como pasta de biblioteca em .augment/agents/, já que o Auggie não tem catálogo de sub-agents.',
    mcp: 'Registrados em ~/.augment/settings.json, na chave padrão mcpServers, pelo egc init e pelos instaladores, o mesmo arquivo em que o auggie mcp add grava.',
    hooks: `Sem hooks: o Auggie não documenta nenhuma API de hooks ou plugins com decisão de permitir ou negar, então o Guardian fica fora do escopo lá; ${SHIM}.`,
    meshSignal: null,
  },
  vibe: {
    installs:
      'Skills instaladas direto em ~/.vibe/skills/<name>/SKILL.md, onde o Vibe as descobre (o VIBE_HOME muda a raiz; o vibe-project grava .vibe/skills/ para uma pasta confiável); agents, commands e rules vão como biblioteca em egc/library/ na mesma raiz, fora da pasta agents/ de onde o Vibe lê perfis TOML; o AGENTS.md da raiz é instalado como ~/.vibe/AGENTS.md, o arquivo de instruções do usuário que o Vibe lê em todo projeto, onde o bootstrap cognitivo mantém o protocolo de memória.',
    mcp: 'Registrados pelo egc init no config.toml em VIBE_HOME ou ~/.vibe como tabelas [[mcp_servers]] com transport = "stdio", o formato que o vibe mcp add grava.',
    hooks:
      'Guardian e Token Crusher como entradas [[hooks]] do tipo pre_tool no hooks.toml: o Guardian rígido nas ferramentas de terminal e no edit, respondendo {decision: "deny", reason} pelo vibe-guardian-adapter.js; o Crusher nas ferramentas de terminal, devolvendo o comando reescrito pelo egc run em hook_specific_output.tool_input.',
    meshSignal: null,
  },
  'grok-build': {
    installs:
      'Skills instaladas direto em ~/.grok/skills/<name>/SKILL.md, onde o Grok as descobre (o GROK_HOME muda a raiz inteira); agents, commands e rules vão como pastas de biblioteca em ~/.grok/egc/library/, onde nada do Grok procura; o AGENTS.md da raiz é instalado como ~/.grok/AGENTS.md, o arquivo de regras globais que o Grok lê antes das regras do projeto, onde o bootstrap cognitivo mantém o protocolo de memória.',
    mcp: 'Registrados pelo egc init como tabelas [mcp_servers.<id>] em ~/.grok/config.toml (dentro do GROK_HOME, quando definido), o formato por servidor que o EGC já grava para o Codex, mantendo todas as outras chaves do arquivo.',
    hooks:
      'Guardian como ~/.grok/hooks/egc-guardian.json, um arquivo de hook PreToolUse completo no formato do Claude Code em Bash, Edit e Write, mais os nomes nativos que o Grok informa (run_terminal_command, monitor, search_replace e write), negando pelo grok-guardian-adapter.js com código de saída 2 e {"decision": "deny"}; sem hook do Token Crusher, já que a documentação de hooks do Grok não descreve reescrita de comandos.',
    meshSignal: null,
  },
  'kilo-code': {
    installs:
      'A Kilo CLI é um fork do OpenCode e lê o mesmo layout na própria pasta de configuração, ~/.config/kilo/ (o XDG_CONFIG_HOME a muda de lugar): skills direto em skills/<name>/SKILL.md, agents em agents/ no formato de agent do OpenCode, commands em commands/ e rules como pasta de biblioteca em egc/library/rules/; o AGENTS.md da raiz é instalado como o arquivo de instruções globais que o Kilo lê, onde o bootstrap cognitivo mantém o protocolo de memória.',
    mcp: 'Registrados pelo egc init na chave mcp de ~/.config/kilo/kilo.json, no formato {type: "local", command: [...]} do OpenCode, só quando o Kilo está presente; o kilo.json próprio mantém os servidores separados da configuração do OpenCode.',
    hooks:
      'Guardian, Token Crusher e restauração da sessão pelo mesmo plugin em processo do OpenCode, opencode-egc-plugin.js em ~/.config/kilo/plugins/, no tool.execute.before.',
    meshSignal: null,
  },
  'mimo-code': {
    installs:
      'O MiMo Code (Xiaomi) é um fork do OpenCode e lê o mesmo layout na sua pasta de configuração, ~/.config/mimocode/ (um MIMOCODE_HOME absoluto a muda para $MIMOCODE_HOME/config, um XDG_CONFIG_HOME absoluto para $XDG_CONFIG_HOME/mimocode): skills direto em skills/<name>/SKILL.md, agents em agents/ no formato de agent do OpenCode, commands em commands/ e rules como pasta de biblioteca em egc/library/rules/; o AGENTS.md da raiz é instalado como o arquivo de instruções globais que o MiMo lê, onde o bootstrap cognitivo mantém o protocolo de memória.',
    mcp: 'Registrados pelo egc init na chave mcp do mimocode.json, na mesma pasta de configuração, no formato {type: "local", command: [...]} do OpenCode, só quando o MiMo está presente.',
    hooks:
      'Guardian, Token Crusher e restauração da sessão pelo mesmo plugin em processo do OpenCode e do Kilo, opencode-egc-plugin.js na pasta plugins/ da sua pasta de configuração, no tool.execute.before.',
    meshSignal: null,
  },
  pi: {
    installs:
      'Tudo vai para a pasta de agent do Pi, ~/.pi/agent (o PI_CODING_AGENT_DIR a muda de lugar): skills direto em skills/<name>/SKILL.md, os commands como modelos de prompt em prompts/, chamados como /<name>, e agents e rules como pastas de biblioteca em egc/library/; o AGENTS.md da raiz é instalado como o arquivo de instruções globais que o Pi carrega ao iniciar, onde o bootstrap cognitivo mantém o protocolo de memória.',
    mcp: 'O Pi tem MCP embutido: o egc init registra os servidores em ~/.pi/agent/mcp.json, no formato padrão mcpServers, só quando o Pi está presente (a pasta de agent existe ou o pi está no PATH).',
    hooks:
      'Guardian e Token Crusher como a extensão ~/.pi/agent/extensions/egc-guardian.js: o handler tool_call dela bloqueia um comando bash destrutivo, uma edição ou gravação protegida, ou uma edição que colocaria um comando negado num script de shell, com {block: true, reason}, e reescreve o comando bash pelo Crusher.',
    meshSignal: null,
  },
  droid: {
    installs:
      'O Droid, da Factory, lê os arquivos pessoais em ~/.factory: skills instaladas direto em ~/.factory/skills/<name>/SKILL.md, commands em ~/.factory/commands/, chamados como /<name>, e agents e rules como pastas de biblioteca em ~/.factory/egc/library/, já que os droids personalizados trazem os próprios ids de modelo e de ferramenta; o AGENTS.md da raiz é instalado como ~/.factory/AGENTS.md, o arquivo de instruções pessoais que o Droid lê, onde o bootstrap cognitivo mantém o protocolo de memória.',
    mcp: 'Registrados pelo egc init em mcpServers no ~/.factory/mcp.json, só quando o Droid está presente.',
    hooks:
      'Guardian e Token Crusher como hooks PreToolUse no Execute, a ferramenta de terminal do Droid, e o validador de gravação no Edit, no Create e no ApplyPatch, no formato do Claude Code que o Droid lê, mesclados na chave hooks do ~/.factory/settings.json junto com as suas próprias configurações e hooks.',
    meshSignal: null,
  },
};
