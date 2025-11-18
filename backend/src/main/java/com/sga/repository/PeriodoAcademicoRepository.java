package com.sga.repository;

import com.sga.model.PeriodoAcademico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PeriodoAcademicoRepository extends JpaRepository<PeriodoAcademico, UUID> {
    @Query("SELECT p FROM PeriodoAcademico p WHERE :fecha BETWEEN p.fechaInicio AND p.fechaFin")
    Optional<PeriodoAcademico> findByFechaActual(LocalDate fecha);
}
