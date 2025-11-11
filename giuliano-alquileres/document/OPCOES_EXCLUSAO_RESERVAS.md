# 🗑️ Opções para Gerenciar Reservas Indesejadas

## 📋 Situação Atual

Atualmente, o sistema **NÃO possui** funcionalidade de exclusão permanente de reservas. As reservas canceladas ficam no banco de dados com `status = 'cancelled'`.

---

## ✅ **Opção 1: Ocultar Reservas Canceladas (IMPLEMENTADO)**

### Como Funciona

As reservas canceladas **permanecem no banco**, mas você pode **ocultá-las da visualização**.

### Ativar Filtro Automático

**Arquivo:** `frontend/src/pages/admin/AdminBookings.jsx` (linha 56)

**DESCOMENTE esta linha:**
```javascript
// ANTES (mostra canceladas)
// allBookings = allBookings.filter(b => b.status !== 'cancelled');

// DEPOIS (oculta canceladas)
allBookings = allBookings.filter(b => b.status !== 'cancelled');
```

### Resultado
- ✅ Reservas canceladas NÃO aparecem na lista
- ✅ Dados permanecem no banco (histórico completo)
- ✅ Você ainda pode ver clicando no filtro "Canceladas"

### Vantagens
- ✅ Histórico completo para auditoria
- ✅ Relatórios e análises
- ✅ Recuperação em caso de erro
- ✅ Não perde dados importantes

---

## 🗑️ **Opção 2: Excluir Permanentemente (CRIAR NOVA ROTA)**

### ⚠️ ATENÇÃO
**Excluir permanentemente remove os dados do banco de dados e NÃO pode ser desfeito!**

### Implementação

Vou criar uma rota DELETE completa com segurança.

#### 1. Backend - Controller

**Criar em:** `backend/controllers/bookingController.js`

```javascript
// Excluir reserva permanentemente (APENAS ADMIN MASTER)
const deleteBooking = async (req, res) => {
  try {
    const { uuid } = req.params;

    console.log("[Booking] Tentando DELETAR reserva UUID:", uuid);

    // SEGURANÇA: Apenas admin_master pode deletar
    if (req.user.role !== "admin_master") {
      console.log("[Booking] Acesso negado - Usuário não é admin_master");
      return res.status(403).json({
        error: "Acesso negado",
        message: "Apenas administradores master podem excluir reservas"
      });
    }

    const booking = await Booking.findOne({ where: { uuid } });

    if (!booking) {
      console.log("[Booking] Reserva não encontrada!");
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    console.log("[Booking] Reserva encontrada:", {
      id: booking.id,
      status: booking.status,
      property_id: booking.property_id
    });

    // Remover bloqueios associados ANTES de deletar a reserva
    try {
      await PropertyAvailability.destroy({
        where: {
          booking_id: booking.id
        }
      });
      console.log("[Booking] Bloqueios associados removidos");
    } catch (error) {
      console.warn("[Booking] Erro ao remover bloqueios:", error.message);
    }

    // Salvar dados para log antes de deletar
    const bookingData = {
      id: booking.id,
      property_id: booking.property_id,
      guest_name: booking.guest_name,
      check_in: booking.check_in,
      check_out: booking.check_out,
      status: booking.status
    };

    // DELETAR PERMANENTEMENTE
    await booking.destroy();

    console.log("[Booking] ⚠️ Reserva DELETADA permanentemente!");

    logger.warn("Reserva deletada permanentemente", {
      ...bookingData,
      deleted_by: req.user.id,
      deleted_at: new Date()
    });

    res.json({
      message: "Reserva deletada permanentemente",
      warning: "Esta ação não pode ser desfeita",
      deleted_booking: bookingData
    });

  } catch (error) {
    console.error("[Booking] Erro ao deletar reserva:", error);
    logger.error("Erro ao deletar reserva", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message
    });
  }
};

module.exports = {
  // ... outros exports
  deleteBooking
};
```

#### 2. Backend - Rota

**Adicionar em:** `backend/routes/bookings.js`

```javascript
// DELETE /api/bookings/:uuid - Deletar reserva permanentemente (APENAS ADMIN MASTER)
router.delete("/:uuid", verifyToken, bookingController.deleteBooking);
```

#### 3. Frontend - Botão de Exclusão

**Adicionar em:** `frontend/src/pages/admin/AdminBookings.jsx`

No modal de detalhes (BookingDetailsModal), adicionar:

```javascript
{/* Botão de DELETAR (apenas admin master e reservas canceladas) */}
{isAdminMaster && booking.status === "cancelled" && (
  <button
    onClick={() => {
      if (window.confirm(
        "⚠️ ATENÇÃO: Isso vai DELETAR PERMANENTEMENTE a reserva do banco de dados!\n\n" +
        "Esta ação NÃO pode ser desfeita!\n\n" +
        "Tem certeza que deseja continuar?"
      )) {
        handleDeleteBooking(booking);
      }
    }}
    disabled={actionLoading}
    className="btn-secondary bg-red-600 text-white hover:bg-red-700 flex-1"
  >
    🗑️ Deletar Permanentemente
  </button>
)}
```

**Função de delete:**

```javascript
const handleDeleteBooking = async (booking) => {
  setActionLoading(true);

  try {
    console.log('[AdminBookings] DELETANDO reserva:', booking.uuid);
    await api.delete(`/api/bookings/${booking.uuid}`);

    // Fechar modal e atualizar lista
    setShowModal(false);
    setSelectedBooking(null);
    await fetchBookings();

    alert("🗑️ Reserva deletada permanentemente!");
  } catch (error) {
    console.error("[AdminBookings] Erro ao deletar:", error);
    alert(`❌ ${error.response?.data?.message || "Erro ao deletar"}`);
  } finally {
    setActionLoading(false);
  }
};
```

---

## 🔒 **Opção 3: Soft Delete (Melhor das Duas Anteriores)**

### Como Funciona

Adiciona uma coluna `deleted_at` na tabela. Reservas "deletadas" não aparecem, mas ainda estão no banco.

### Migração Necessária

```sql
ALTER TABLE bookings ADD COLUMN deleted_at TIMESTAMP NULL;
CREATE INDEX idx_bookings_deleted ON bookings(deleted_at);
```

### Modificar Queries

```javascript
// Buscar apenas não deletadas
const bookings = await Booking.findAll({
  where: {
    deleted_at: null // Apenas não deletadas
  }
});

// "Deletar" (soft delete)
await booking.update({
  deleted_at: new Date()
});

// Recuperar deletada
await booking.update({
  deleted_at: null
});
```

---

## 📊 Comparação

| Recurso | Opção 1: Ocultar | Opção 2: Hard Delete | Opção 3: Soft Delete |
|---------|------------------|----------------------|----------------------|
| **Mantém histórico** | ✅ Sim | ❌ Não | ✅ Sim |
| **Pode recuperar** | ✅ Sim | ❌ Não | ✅ Sim |
| **Libera espaço** | ❌ Não | ✅ Sim | ❌ Não |
| **Auditoria** | ✅ Sim | ⚠️ Apenas logs | ✅ Sim |
| **Complexidade** | 🟢 Baixa | 🟡 Média | 🟠 Alta |
| **Implementação** | ✅ PRONTO | ⚠️ Criar | ⚠️ Migração |

---

## 💡 Recomendação

### Para 99% dos Casos: **Opção 1 (Ocultar)**

**Por quê?**
- ✅ Já está implementado
- ✅ Mantém todos os dados
- ✅ Permite análises futuras
- ✅ Auditoria completa
- ✅ Recuperação fácil

**Como ativar:**
1. Abra: `frontend/src/pages/admin/AdminBookings.jsx`
2. Linha 56: Descomente
3. Pronto! Canceladas não aparecem mais

### Para Casos Específicos: **Opção 2 (Hard Delete)**

**Quando usar:**
- ⚠️ Precisa cumprir LGPD (direito ao esquecimento)
- ⚠️ Dados sensíveis que precisam ser removidos
- ⚠️ Limpeza de dados de teste

**NUNCA use para:**
- ❌ "Limpar" a lista de reservas
- ❌ Remover reservas legítimas
- ❌ Ocultar erros ou problemas

---

## 🚀 Como Aplicar Opção 1 (RECOMENDADO)

```bash
# 1. Editar arquivo
# frontend/src/pages/admin/AdminBookings.jsx - Linha 56

# ANTES:
// allBookings = allBookings.filter(b => b.status !== 'cancelled');

# DEPOIS:
allBookings = allBookings.filter(b => b.status !== 'cancelled');

# 2. Fazer build
cd frontend
npm run build

# 3. Commit
git add .
git commit -m "feat: Ocultar reservas canceladas da visualização"
git push
```

---

## 📝 Conclusão

**Para sua necessidade** (não mostrar reservas no site), a **Opção 1** é perfeita:
- ✅ Simples de ativar (1 linha)
- ✅ Mantém dados seguros
- ✅ Pode reverter a qualquer momento

Se REALMENTE precisar deletar do banco, avise que eu crio a **Opção 2** completa para você.

---

**Quer que eu ative a Opção 1 agora ou prefere criar a Opção 2 (DELETE permanente)?**
