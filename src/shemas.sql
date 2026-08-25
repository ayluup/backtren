CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    
    -- ✅ SOLUCIÓN: Usamos VARCHAR con CHECK en lugar de CREATE TYPE
    role VARCHAR(20) DEFAULT 'STUDENT' NOT NULL CHECK (role IN ('PROFESSOR', 'STUDENT')),
    failed_login_attempts INT DEFAULT 0 NOT NULL CHECK (failed_login_attempts >= 0),
    locked BOOLEAN DEFAULT FALSE NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL -- 🗑️ SOFT DELETE
);

-- Índices para optimizar búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Ejecutar también si la tabla users ya existía
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0 NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT FALSE NOT NULL;

-- ==========================================
-- 2. TABLA DE MATERIAS
-- ==========================================
CREATE TABLE subjects (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    
    -- Relación 0 a 1 con Profesor. 
    -- ON DELETE NO ACTION es el comportamiento por defecto en Postgres, 
    -- pero lo dejamos explícito por claridad.
    professor_id INT REFERENCES users(id) ON DELETE NO ACTION,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL -- 🗑️ SOFT DELETE
);

CREATE INDEX idx_subjects_professor_id ON subjects(professor_id);
CREATE INDEX idx_subjects_deleted_at ON subjects(deleted_at);

-- ==========================================
-- 3. TABLA DE INSCRIPCIONES (Relación N a M)
-- ==========================================
CREATE TABLE enrollments (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    
    student_id INT NOT NULL REFERENCES users(id) ON DELETE NO ACTION,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE NO ACTION,
    
    grade DECIMAL(5,2), -- Ej: 8.50
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL, -- 🗑️ SOFT DELETE
    
    -- Un alumno no puede inscribirse dos veces a la misma materia
    CONSTRAINT unique_student_subject UNIQUE (student_id, subject_id)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_subject_id ON enrollments(subject_id);
CREATE INDEX idx_enrollments_deleted_at ON enrollments(deleted_at);

