const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Criar diretórios se não existirem
const createDirectories = () => {
  const uploadsDir = path.join(__dirname, "../uploads");
  const propertiesDir = path.join(uploadsDir, "properties");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(propertiesDir)) {
    fs.mkdirSync(propertiesDir, { recursive: true });
  }
};

// Criar diretórios na inicialização
createDirectories();

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/properties");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único: UUID + timestamp + extensão original
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Tipo de arquivo não permitido. Use apenas JPEG, PNG ou WebP."),
      false
    );
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB por arquivo
    files: 20, // máximo 20 arquivos por upload
  },
});

// Middleware para upload múltiplo
const uploadMultiple = upload.array("photos", 20);

// Middleware com tratamento de erros
const handleUpload = (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    // console.log("=== DEBUG UPLOAD ===");
    // console.log("req.files:", req.files);
    // console.log("req.body:", req.body);
    // console.log("err:", err);
    // console.log("===================");

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "Arquivo muito grande",
          details: "Tamanho máximo permitido: 20MB por arquivo",
        });
      }

      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          error: "Muitos arquivos",
          details: "Máximo de 20 arquivos por upload",
        });
      }

      return res.status(400).json({
        error: "Erro no upload",
        details: err.message,
      });
    }

    if (err) {
      return res.status(400).json({
        error: "Erro no upload",
        details: err.message,
      });
    }

    // Verificar se pelo menos um arquivo foi enviado
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "Nenhum arquivo enviado",
        details: "Selecione pelo menos uma imagem",
        debug: {
          files: req.files,
          body: req.body,
        },
      });
    }

    next();
  });
};

// Middleware para upload único com tratamento de erros
const handleSingleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "Arquivo muito grande",
          details: "Tamanho máximo permitido: 20MB",
        });
      }

      return res.status(400).json({
        error: "Erro no upload",
        details: err.message,
      });
    }

    if (err) {
      return res.status(400).json({
        error: "Erro no upload",
        details: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Nenhum arquivo enviado",
        details: "Selecione uma imagem",
      });
    }

    next();
  });
};

// Função para deletar arquivo
const deleteFile = (filename) => {
  try {
    const filePath = path.join(__dirname, "../uploads/properties", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    return false;
  }
};

// Validar se arquivo existe
const fileExists = (filename) => {
  const filePath = path.join(__dirname, "../uploads/properties", filename);
  return fs.existsSync(filePath);
};

// Função para criar middleware de upload único com campo customizável
const uploadSingle = (fieldName = "photo") => {
  const singleUpload = upload.single(fieldName);

  return (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error: "Arquivo muito grande",
            details: "Tamanho máximo permitido: 20MB",
          });
        }

        return res.status(400).json({
          error: "Erro no upload",
          details: err.message,
        });
      }

      if (err) {
        return res.status(400).json({
          error: "Erro no upload",
          details: err.message,
        });
      }

      // Para upload de avatar, arquivo é opcional
      // Não retornar erro se não houver arquivo
      next();
    });
  };
};

module.exports = {
  handleUpload,
  handleSingleUpload,
  uploadSingle, // Nova exportação
  deleteFile,
  fileExists,
  uploadsPath: path.join(__dirname, "../uploads/properties"),
};
