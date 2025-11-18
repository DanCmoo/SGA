package com.sga.repository;

import com.sga.model.Logro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LogroRepository extends JpaRepository<Logro, UUID> {
    List<Logro> findByCategoriaIdCategoria(UUID idCategoria);
}
