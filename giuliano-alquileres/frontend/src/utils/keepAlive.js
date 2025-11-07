/**
 * Keep Alive - Mantém o backend acordado
 *
 * No plano free do Render, o backend dorme após 15min de inatividade.
 * Este script faz ping periódico para manter o backend ativo.
 */

import { API_URL } from '../services/api';

let keepAliveInterval = null;

/**
 * Inicia o keep-alive (ping a cada 10 minutos)
 */
export function startKeepAlive() {
  // Se já está rodando, não inicia novamente
  if (keepAliveInterval) {
    console.log('⏰ Keep-alive já está ativo');
    return;
  }

  console.log('🚀 Iniciando keep-alive do backend...');

  // Fazer ping imediato
  pingBackend();

  // Fazer ping a cada 10 minutos (600000ms)
  keepAliveInterval = setInterval(() => {
    pingBackend();
  }, 10 * 60 * 1000); // 10 minutos
}

/**
 * Para o keep-alive
 */
export function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('⏹️ Keep-alive parado');
  }
}

/**
 * Faz ping no backend
 */
async function pingBackend() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend ativo:', data.status);
    } else {
      console.warn('⚠️ Backend respondeu com erro:', response.status);
    }
  } catch (error) {
    console.error('❌ Erro ao pingar backend:', error.message);
  }
}

/**
 * Verifica se o backend está online
 * @returns {Promise<boolean>}
 */
export async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5s apenas para check rápido
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

export default {
  start: startKeepAlive,
  stop: stopKeepAlive,
  check: checkBackendStatus,
};
