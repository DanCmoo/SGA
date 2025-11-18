package com.sga.repository;

import com.sga.model.Boletin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BoletinRepository extends JpaRepository<Boletin, UUID> {
    List<Boletin> findByEstudianteIdEstudiante(UUID idEstudiante);
    Optional<Boletin> findByEstudianteIdEstudianteAndPeriodoIdPeriodoAcademico(UUID idEstudiante, UUID idPeriodo);
}
