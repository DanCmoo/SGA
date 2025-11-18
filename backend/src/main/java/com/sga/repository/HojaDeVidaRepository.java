package com.sga.repository;

import com.sga.model.HojaDeVidaEstudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HojaDeVidaRepository extends JpaRepository<HojaDeVidaEstudiante, UUID> {
}
