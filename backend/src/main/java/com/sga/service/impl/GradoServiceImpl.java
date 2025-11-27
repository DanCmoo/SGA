package com.sga.service.impl;

import com.sga.dto.GradoDTO;
import com.sga.exception.ResourceNotFoundException;
import com.sga.model.Grado;
import com.sga.repository.GradoRepository;
import com.sga.service.GradoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GradoServiceImpl implements GradoService {

    private final GradoRepository gradoRepository;

    @Override
    @Transactional
    public GradoDTO crear(GradoDTO gradoDTO) {
        log.info("Creando nuevo grado: {}", gradoDTO.getNombreGrado());
        
        Grado grado = Grado.builder()
                .nombreGrado(gradoDTO.getNombreGrado())
                .build();
        
        Grado gradoGuardado = gradoRepository.save(grado);
        log.info("Grado creado exitosamente con ID: {}", gradoGuardado.getIdGrado());
        
        return convertirADTO(gradoGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradoDTO> listarTodos() {
        log.info("Listando todos los grados");
        List<Grado> grados = gradoRepository.findAll();
        log.info("Se encontraron {} grados", grados.size());
        
        return grados.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GradoDTO consultar(UUID idGrado) {
        log.info("Consultando grado con ID: {}", idGrado);
        
        Grado grado = gradoRepository.findById(idGrado)
                .orElseThrow(() -> new ResourceNotFoundException("Grado no encontrado con ID: " + idGrado));
        
        return convertirADTO(grado);
    }

    @Override
    @Transactional
    public GradoDTO actualizar(UUID idGrado, GradoDTO gradoDTO) {
        log.info("Actualizando grado con ID: {}", idGrado);
        
        Grado grado = gradoRepository.findById(idGrado)
                .orElseThrow(() -> new ResourceNotFoundException("Grado no encontrado con ID: " + idGrado));
        
        grado.setNombreGrado(gradoDTO.getNombreGrado());
        
        Grado gradoActualizado = gradoRepository.save(grado);
        log.info("Grado actualizado exitosamente");
        
        return convertirADTO(gradoActualizado);
    }

    @Override
    @Transactional
    public void eliminar(UUID idGrado) {
        log.info("Eliminando grado con ID: {}", idGrado);
        
        if (!gradoRepository.existsById(idGrado)) {
            throw new ResourceNotFoundException("Grado no encontrado con ID: " + idGrado);
        }
        
        gradoRepository.deleteById(idGrado);
        log.info("Grado eliminado exitosamente");
    }

    private GradoDTO convertirADTO(Grado grado) {
        return GradoDTO.builder()
                .idGrado(grado.getIdGrado())
                .nombreGrado(grado.getNombreGrado())
                .build();
    }
}
