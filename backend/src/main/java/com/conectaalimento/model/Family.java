package com.conectaalimento.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "familia")
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da família é obrigatório.")
    private String name;

    @NotBlank(message = "O nome do responsável é obrigatório.")
    private String responsibleName;

    @NotNull(message = "A quantidade de membros é obrigatória.")
    private Integer membersCount;

    @NotBlank(message = "A cidade é obrigatória.")
    private String city;

    @NotBlank(message = "O endereço é obrigatório.")
    private String address;

    @NotBlank(message = "O telefone é obrigatório.")
    private String phone;

    public Family() {
        // Construtor padrão para JPA
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getResponsibleName() {
        return responsibleName;
    }

    public void setResponsibleName(String responsibleName) {
        this.responsibleName = responsibleName;
    }

    public Integer getMembersCount() {
        return membersCount;
    }

    public void setMembersCount(Integer membersCount) {
        this.membersCount = membersCount;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
