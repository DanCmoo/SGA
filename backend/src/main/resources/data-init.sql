-- Script de inicialización para datos de prueba del SGA
-- Sistema de Gestión Académica

-- ==================================================
-- LIMPIEZA DE DATOS DUPLICADOS
-- ==================================================
-- Eliminar grados duplicados manteniendo solo uno de cada nombre
DELETE FROM grado g1
WHERE EXISTS (
    SELECT 1 FROM grado g2
    WHERE g2.nombre_grado = g1.nombre_grado
    AND g2.id_grado < g1.id_grado
);

-- Actualizar nombres de grados existentes para que tengan tildes correctas
UPDATE grado SET nombre_grado = 'Párvulos' WHERE LOWER(nombre_grado) LIKE '%parvulos%' OR LOWER(nombre_grado) LIKE '%párvulos%';
UPDATE grado SET nombre_grado = 'Caminadores' WHERE LOWER(nombre_grado) LIKE '%caminadores%';
UPDATE grado SET nombre_grado = 'Pre-jardín' WHERE LOWER(nombre_grado) LIKE '%jardin%' OR LOWER(nombre_grado) LIKE '%jardín%';

-- ==================================================
-- GRADOS
-- ==================================================
-- Insertar grados solo si no existen
INSERT INTO grado (id_grado, nombre_grado)
SELECT gen_random_uuid(), 'Párvulos'
WHERE NOT EXISTS (SELECT 1 FROM grado WHERE LOWER(nombre_grado) LIKE '%parvulos%' OR LOWER(nombre_grado) LIKE '%párvulos%');

INSERT INTO grado (id_grado, nombre_grado)
SELECT gen_random_uuid(), 'Caminadores'
WHERE NOT EXISTS (SELECT 1 FROM grado WHERE LOWER(nombre_grado) LIKE '%caminadores%');

INSERT INTO grado (id_grado, nombre_grado)
SELECT gen_random_uuid(), 'Pre-jardín'
WHERE NOT EXISTS (SELECT 1 FROM grado WHERE LOWER(nombre_grado) LIKE '%jardin%' OR LOWER(nombre_grado) LIKE '%jardín%');

-- ==================================================
-- PERIODOS ACADÉMICOS
-- ==================================================
INSERT INTO periodo_academico (id_periodo_academico, fecha_inicio, fecha_fin) VALUES
    (gen_random_uuid(), '2025-01-15', '2025-06-15'),
    (gen_random_uuid(), '2025-07-15', '2025-12-15')
ON CONFLICT DO NOTHING;

-- ==================================================
-- USUARIOS DE PRUEBA
-- ==================================================

-- Nota: La contraseña por defecto para todos los usuarios es: "password123"
-- Hash generado con BCrypt usando online BCrypt generator

-- ADMINISTRADOR
INSERT INTO token_usuario (id_token, contrasena, rol, requiere_cambio_contrasena) VALUES
    ('a1111111-1111-1111-1111-111111111111', '$2a$10$CR1S1BpAi5GewP92XUoY4.07XEQVu463MmUSbH3ppxYl3vz/6BeuC', 'ADMINISTRADOR', false)
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id_usuario, nombre, apellido, cedula, correo_electronico, fecha_nacimiento, id_token) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Admin', 'Sistema', '1000000001', 'admin@fis.edu.co', '1990-01-01', 'a1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

INSERT INTO administrador (id_usuario, id_administrador) VALUES
    ('a1111111-1111-1111-1111-111111111111', gen_random_uuid())
ON CONFLICT DO NOTHING;

-- COORDINADOR
INSERT INTO token_usuario (id_token, contrasena, rol, requiere_cambio_contrasena) VALUES
    ('c1111111-1111-1111-1111-111111111111', '$2a$10$CR1S1BpAi5GewP92XUoY4.07XEQVu463MmUSbH3ppxYl3vz/6BeuC', 'COORDINADOR', false)
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id_usuario, nombre, apellido, cedula, correo_electronico, fecha_nacimiento, id_token) VALUES
    ('c1111111-1111-1111-1111-111111111111', 'María', 'González', '1000000002', 'coordinador@fis.edu.co', '1985-05-15', 'c1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

INSERT INTO coordinador (id_usuario, id_coordinador) VALUES
    ('c1111111-1111-1111-1111-111111111111', gen_random_uuid())
ON CONFLICT DO NOTHING;

-- DIRECTOR/DIRECTIVO
INSERT INTO token_usuario (id_token, contrasena, rol, requiere_cambio_contrasena) VALUES
    ('d1111111-1111-1111-1111-111111111111', '$2a$10$CR1S1BpAi5GewP92XUoY4.07XEQVu463MmUSbH3ppxYl3vz/6BeuC', 'DIRECTOR', false)
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id_usuario, nombre, apellido, cedula, correo_electronico, fecha_nacimiento, id_token) VALUES
    ('d1111111-1111-1111-1111-111111111111', 'Carlos', 'Rodríguez', '1000000003', 'director@fis.edu.co', '1980-08-20', 'd1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

INSERT INTO director (id_usuario, id_director) VALUES
    ('d1111111-1111-1111-1111-111111111111', gen_random_uuid())
ON CONFLICT DO NOTHING;

-- PROFESOR 1
INSERT INTO token_usuario (id_token, contrasena, rol, requiere_cambio_contrasena) VALUES
    ('p1111111-1111-1111-1111-111111111111', '$2a$10$CR1S1BpAi5GewP92XUoY4.07XEQVu463MmUSbH3ppxYl3vz/6BeuC', 'PROFESOR', false)
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id_usuario, nombre, apellido, cedula, correo_electronico, fecha_nacimiento, id_token) VALUES
    ('p1111111-1111-1111-1111-111111111111', 'Ana', 'Martínez', '1000000004', 'profesor1@fis.edu.co', '1992-03-10', 'p1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

INSERT INTO profesor (id_usuario, id_profesor, grupo_asignado) VALUES
    ('p1111111-1111-1111-1111-111111111111', gen_random_uuid(), NULL)
ON CONFLICT DO NOTHING;

-- PROFESOR 2
INSERT INTO token_usuario (id_token, contrasena, rol, requiere_cambio_contrasena) VALUES
    ('p2222222-2222-2222-2222-222222222222', '$2a$10$CR1S1BpAi5GewP92XUoY4.07XEQVu463MmUSbH3ppxYl3vz/6BeuC', 'PROFESOR', false)
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id_usuario, nombre, apellido, cedula, correo_electronico, fecha_nacimiento, id_token) VALUES
    ('p2222222-2222-2222-2222-222222222222', 'Luis', 'Pérez', '1000000005', 'profesor2@fis.edu.co', '1988-11-25', 'p2222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

INSERT INTO profesor (id_usuario, id_profesor, grupo_asignado) VALUES
    ('p2222222-2222-2222-2222-222222222222', gen_random_uuid(), NULL)
ON CONFLICT DO NOTHING;

-- ACUDIENTE 1
INSERT INTO token_usuario (id_token, contrasena, rol, requiere_cambio_contrasena) VALUES
    ('u1111111-1111-1111-1111-111111111111', '$2a$10$CR1S1BpAi5GewP92XUoY4.07XEQVu463MmUSbH3ppxYl3vz/6BeuC', 'ACUDIENTE', false)
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id_usuario, nombre, apellido, cedula, correo_electronico, fecha_nacimiento, id_token) VALUES
    ('u1111111-1111-1111-1111-111111111111', 'Patricia', 'López', '1000000006', 'acudiente1@gmail.com', '1990-07-12', 'u1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

INSERT INTO acudiente (id_usuario, id_acudiente, estado) VALUES
    ('u1111111-1111-1111-1111-111111111111', gen_random_uuid(), true)
ON CONFLICT DO NOTHING;

-- ACUDIENTE 2
-- ACUDIENTE 2
INSERT INTO token_usuario (id_token, contrasena, rol, requiere_cambio_contrasena) VALUES
    ('u2222222-2222-2222-2222-222222222222', '$2a$10$CR1S1BpAi5GewP92XUoY4.07XEQVu463MmUSbH3ppxYl3vz/6BeuC', 'ACUDIENTE', false)
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id_usuario, nombre, apellido, cedula, correo_electronico, fecha_nacimiento, id_token) VALUES
    ('u2222222-2222-2222-2222-222222222222', 'Roberto', 'Sánchez', '1000000007', 'acudiente2@gmail.com', '1987-04-08', 'u2222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

INSERT INTO acudiente (id_usuario, id_acudiente, estado) VALUES
    ('u2222222-2222-2222-2222-222222222222', gen_random_uuid(), true)
ON CONFLICT DO NOTHING;

-- ==================================================
-- INFORMACIÓN IMPORTANTE
-- ==================================================
-- Correo: admin@fis.edu.co          | Contraseña: password123 | Rol: ADMINISTRADOR
-- Correo: coordinador@fis.edu.co    | Contraseña: password123 | Rol: COORDINADOR
-- Correo: director@fis.edu.co       | Contraseña: password123 | Rol: DIRECTOR
-- Correo: profesor1@fis.edu.co      | Contraseña: password123 | Rol: PROFESOR
-- Correo: profesor2@fis.edu.co      | Contraseña: password123 | Rol: PROFESOR
-- Correo: acudiente1@gmail.com      | Contraseña: password123 | Rol: ACUDIENTE
-- Correo: acudiente2@gmail.com      | Contraseña: password123 | Rol: ACUDIENTE
