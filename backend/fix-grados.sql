-- Script para limpiar y corregir grados con tildes
-- Ejecutar manualmente: psql -U postgres -d sga_db -f fix-grados.sql

-- 1. Eliminar todos los grados existentes
DELETE FROM grado;

-- 2. Insertar los 3 grados correctos con tildes
INSERT INTO grado (id_grado, nombre_grado) VALUES
    (gen_random_uuid(), 'Párvulos'),
    (gen_random_uuid(), 'Caminadores'),
    (gen_random_uuid(), 'Pre-jardín');
