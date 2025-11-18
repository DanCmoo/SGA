package com.sga.repository;

import com.sga.model.CategoriaLogro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoriaLogroRepository extends JpaRepository<CategoriaLogro, UUID> {
    List<CategoriaLogro> findByGradoIdGrado(UUID idGrado);
    List<CategoriaLogro> findByNombre(String nombre);
}
