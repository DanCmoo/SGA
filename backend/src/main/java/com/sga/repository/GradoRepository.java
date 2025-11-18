package com.sga.repository;

import com.sga.model.Grado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradoRepository extends JpaRepository<Grado, UUID> {
    Optional<Grado> findByNombreGrado(String nombreGrado);
}
