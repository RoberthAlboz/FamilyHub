-- Adicionar coluna de foto de perfil na tabela membros
ALTER TABLE membros ADD COLUMN IF NOT EXISTS foto_perfil VARCHAR(255) DEFAULT NULL;
