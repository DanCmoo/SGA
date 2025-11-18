package com.sga.repository;

import com.sga.model.Coordinador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CoordinadorRepository extends JpaRepository<Coordinador, UUID> {
}
