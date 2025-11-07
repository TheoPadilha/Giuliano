require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("🧪 Testando configuração de email...\n");

// Verificar se as variáveis estão configuradas
console.log("📋 Configurações encontradas:");
console.log("SMTP_HOST:", process.env.SMTP_HOST || "❌ NÃO CONFIGURADO");
console.log("SMTP_PORT:", process.env.SMTP_PORT || "❌ NÃO CONFIGURADO");
console.log("SMTP_USER:", process.env.SMTP_USER || "❌ NÃO CONFIGURADO");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Configurado (oculto)" : "❌ NÃO CONFIGURADO");
console.log("SMTP_FROM_EMAIL:", process.env.SMTP_FROM_EMAIL || "❌ NÃO CONFIGURADO");
console.log("");

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("❌ ERRO: Configure todas as variáveis SMTP no arquivo .env");
  process.exit(1);
}

// Criar transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Função para testar
async function testarEmail() {
  console.log("📧 Enviando email de teste...\n");

  const emailTeste = process.argv[2] || process.env.SMTP_USER;

  console.log(`Enviando para: ${emailTeste}`);
  console.log("(Use: node test-email.js seuemail@gmail.com para testar outro email)\n");

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
      to: emailTeste,
      subject: "✅ Teste de Email - Zigué Aluga",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email de Teste</h1>
              <p>Sistema de emails configurado com sucesso!</p>
            </div>
            <div class="content">
              <div class="success">
                <strong>🎉 Parabéns!</strong>
                <p>O sistema de envio de emails está funcionando corretamente.</p>
              </div>
              <p><strong>Informações do teste:</strong></p>
              <ul>
                <li>Data: ${new Date().toLocaleString("pt-BR")}</li>
                <li>Servidor SMTP: ${process.env.SMTP_HOST}</li>
                <li>Porta: ${process.env.SMTP_PORT}</li>
              </ul>
              <p>Agora você pode usar os seguintes recursos:</p>
              <ul>
                <li>✉️ Recuperação de senha</li>
                <li>📧 Confirmação de reservas</li>
                <li>🔔 Lembretes de check-in</li>
                <li>📨 Emails de boas-vindas</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Email enviado com sucesso!");
    console.log("📨 Message ID:", info.messageId);
    console.log("");
    console.log("🎉 SUCESSO! O sistema de emails está funcionando corretamente.");
    console.log("Verifique sua caixa de entrada (e spam) em:", emailTeste);
  } catch (error) {
    console.error("❌ ERRO ao enviar email:");
    console.error("Mensagem:", error.message);
    console.error("");
    console.error("💡 Possíveis soluções:");
    console.error("1. Verifique se o email e senha estão corretos");
    console.error("2. Se usando Gmail, use uma 'App Password' ao invés da senha normal");
    console.error("3. Verifique se a autenticação em 2 etapas está ativa (Gmail)");
    console.error("4. Teste com outro provedor (SendGrid, Mailgun, etc.)");
  }
}

testarEmail();
