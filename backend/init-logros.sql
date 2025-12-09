-- Script para inicializar datos de prueba para Fase 4: Evaluación de Logros
-- Ejecutar después de data-init.sql

-- ===========================
-- PERÍODOS ACADÉMICOS (4 por año 2025)
-- ===========================

INSERT INTO periodo_academico (id_periodo_academico, fecha_inicio, fecha_fin)
VALUES 
    (gen_random_uuid(), '2025-01-15', '2025-03-31'),  -- Período 1
    (gen_random_uuid(), '2025-04-01', '2025-06-30'),  -- Período 2
    (gen_random_uuid(), '2025-07-15', '2025-09-30'),  -- Período 3
    (gen_random_uuid(), '2025-10-01', '2025-12-15')   -- Período 4
ON CONFLICT DO NOTHING;

-- ===========================
-- CATEGORÍAS DE LOGROS (4 dimensiones por cada grado)
-- ===========================

-- Para Párvulos
INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Psicosocial', id_grado FROM grado WHERE nombre_grado = 'Párvulos'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Psicomotor', id_grado FROM grado WHERE nombre_grado = 'Párvulos'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Cognitivo', id_grado FROM grado WHERE nombre_grado = 'Párvulos'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Procedimental', id_grado FROM grado WHERE nombre_grado = 'Párvulos'
ON CONFLICT DO NOTHING;

-- Para Caminadores
INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Psicosocial', id_grado FROM grado WHERE nombre_grado = 'Caminadores'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Psicomotor', id_grado FROM grado WHERE nombre_grado = 'Caminadores'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Cognitivo', id_grado FROM grado WHERE nombre_grado = 'Caminadores'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Procedimental', id_grado FROM grado WHERE nombre_grado = 'Caminadores'
ON CONFLICT DO NOTHING;

-- Para Pre-jardín
INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Psicosocial', id_grado FROM grado WHERE nombre_grado = 'Pre-jardín'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Psicomotor', id_grado FROM grado WHERE nombre_grado = 'Pre-jardín'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Cognitivo', id_grado FROM grado WHERE nombre_grado = 'Pre-jardín'
ON CONFLICT DO NOTHING;

INSERT INTO categoria_logro (id_categoria, nombre, id_grado)
SELECT gen_random_uuid(), 'Procedimental', id_grado FROM grado WHERE nombre_grado = 'Pre-jardín'
ON CONFLICT DO NOTHING;

-- ===========================
-- LOGROS (3 indicadores por categoría)
-- ===========================

-- Psicosocial - Párvulos
INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Interactúa positivamente con sus compañeros', id_categoria 
FROM categoria_logro WHERE nombre = 'Psicosocial' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Expresa sus emociones de manera apropiada', id_categoria 
FROM categoria_logro WHERE nombre = 'Psicosocial' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Comparte y colabora en actividades grupales', id_categoria 
FROM categoria_logro WHERE nombre = 'Psicosocial' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

-- Psicomotor - Párvulos
INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Coordina movimientos básicos de motricidad gruesa', id_categoria 
FROM categoria_logro WHERE nombre = 'Psicomotor' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Desarrolla habilidades de motricidad fina', id_categoria 
FROM categoria_logro WHERE nombre = 'Psicomotor' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Mantiene equilibrio y control corporal', id_categoria 
FROM categoria_logro WHERE nombre = 'Psicomotor' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

-- Cognitivo - Párvulos
INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Reconoce colores básicos y formas geométricas', id_categoria 
FROM categoria_logro WHERE nombre = 'Cognitivo' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Cuenta hasta 10 con apoyo visual', id_categoria 
FROM categoria_logro WHERE nombre = 'Cognitivo' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Identifica y nombra objetos comunes', id_categoria 
FROM categoria_logro WHERE nombre = 'Cognitivo' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

-- Procedimental - Párvulos
INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Sigue instrucciones simples de dos pasos', id_categoria 
FROM categoria_logro WHERE nombre = 'Procedimental' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Completa actividades con apoyo del docente', id_categoria 
FROM categoria_logro WHERE nombre = 'Procedimental' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

INSERT INTO logro (id_logro, descripcion, id_categoria)
SELECT gen_random_uuid(), 'Demuestra autonomía en rutinas diarias', id_categoria 
FROM categoria_logro WHERE nombre = 'Procedimental' AND id_grado = (SELECT id_grado FROM grado WHERE nombre_grado = 'Párvulos')
ON CONFLICT DO NOTHING;

-- (Repetir similar estructura para Caminadores y Pre-jardín adaptando las descripciones)

COMMIT;
