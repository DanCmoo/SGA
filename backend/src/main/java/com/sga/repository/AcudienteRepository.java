package com.sga.repository;

import com.sga.model.Acudiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AcudienteRepository extends JpaRepository<Acudiente, UUID> {
    List<Acudiente> findByEstadoTrue();
    List<Acudiente> findByEstadoFalse();
}
