package com.sga.repository;

import com.sga.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, UUID> {
    List<Estudiante> findByGrupoAsignadoIdGrupo(UUID idGrupo);
    int countByGrupoAsignadoIdGrupo(UUID idGrupo);
    List<Estudiante> findByAcudienteIdUsuario(UUID idAcudiente);
    List<Estudiante> findByEstadoTrue();
    List<Estudiante> findByEstadoFalse();
    List<Estudiante> findByGrupoAsignadoIsNull();
    boolean existsByNumeroDocumento(String numeroDocumento);
}
