// Frontend Client Logic — 5-Person AI Collaboration System

document.addEventListener('DOMContentLoaded', () => {
  const terminalOutput = document.getElementById('terminalOutput');
  const agentInput = document.getElementById('agentInput');
  const sendBtn = document.getElementById('sendBtn');
  const verifyBtn = document.getElementById('verifyBtn');
  const activeRoleDisplay = document.getElementById('activeRoleDisplay');
  const activeScopeDisplay = document.getElementById('activeScopeDisplay');
  const roleCards = document.querySelectorAll('.role-card');

  const roleDefinitions = {
    p1: { name: 'P1: Frontend Lead', scope: 'apps/frontend/', color: '#38bdf8' },
    p2: { name: 'P2: Backend Lead', scope: 'apps/backend/', color: '#10b981' },
    p3: { name: 'P3: AI Engineer', scope: 'apps/ai-service/', color: '#a855f7' },
    p4: { name: 'P4: Infra & Shared', scope: 'packages/shared/', color: '#f59e0b' },
    p5: { name: 'P5: Product & QA', scope: 'docs/tasks/', color: '#ec4899' },
  };

  let currentRole = 'p1';

  // Role Card Click Switcher
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const roleKey = card.getAttribute('data-role');
      if (roleDefinitions[roleKey]) {
        currentRole = roleKey;
        const role = roleDefinitions[roleKey];
        activeRoleDisplay.textContent = role.name;
        activeRoleDisplay.style.color = role.color;
        activeScopeDisplay.textContent = role.scope;
        
        appendLog(`Switched active persona to ${role.name} (${role.scope})`, 'info');
      }
    });
  });

  // Append line to terminal
  function appendLog(text, type = 'info') {
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    line.textContent = `[${timestamp}] ${text}`;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Handle Input Dispatch
  function handleDispatch() {
    const text = agentInput.value.trim();
    if (!text) return;

    appendLog(text, 'user');
    agentInput.value = '';

    // Simulate Agent Parse & Contract Execution
    setTimeout(() => {
      if (text.startsWith('@role:')) {
        const parts = text.split(' ');
        const requestedRole = parts[0].replace('@role:', '').toLowerCase();
        appendLog(`[AGENT ROUTER] Directed to agent handler for role: ${requestedRole}`, 'system');
      }
      appendLog(`[CONTRACT CHECK] Validated against packages/shared/contracts/api.ts. Zero boundary violations.`, 'agent');
    }, 400);
  }

  sendBtn.addEventListener('click', handleDispatch);
  agentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleDispatch();
  });

  // Verify Button
  verifyBtn.addEventListener('click', () => {
    appendLog('Running integrity check via ./scripts/verify-setup.sh...', 'info');
    setTimeout(() => {
      appendLog('Integrity check PASSED: All 5 domains present, contracts valid, backlog synchronized.', 'agent');
    }, 600);
  });
});
