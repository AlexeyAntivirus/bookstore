package com.horizonbit.bookstore.server.data.repositories;


import com.horizonbit.bookstore.server.data.entities.BookOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<BookOrder, Long> {
    BookOrder findByBookNameAndAddressAndLastNameAndFirstNameAndQuantity(String bookName, String address, String lastName, String firstName, Integer quantity);
}
