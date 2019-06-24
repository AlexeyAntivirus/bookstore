package com.horizonbit.bookstore.server.data.repositories;


import com.horizonbit.bookstore.server.data.entities.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    boolean existsByLastNameAndFirstNameAndMiddleName(String lastName, String firstName, String middleName);
}
