package com.horizonbit.bookstore.server.data.repositories;

import com.horizonbit.bookstore.server.data.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByName(String name);

    Book findByName(String bookName);
}
