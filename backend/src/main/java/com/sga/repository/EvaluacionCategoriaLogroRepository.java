package com.sga.repository;

import com.sga.model.EvaluacionCategoriaLogro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EvaluacionCategoriaLogroRepository extends JpaRepository<EvaluacionCategoriaLogro, UUID> {
    List<EvaluacionCategoriaLogro> findByBoletinIdBoletin(UUID idBoletin);
    
    @Modifying
    void deleteByBoletinIdBoletinAndCategoriaLogroIdCategoria(UUID idBoletin, UUID idCategoria);
}
