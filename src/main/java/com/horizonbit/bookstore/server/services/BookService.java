package com.horizonbit.bookstore.server.services;


import com.horizonbit.bookstore.server.data.entities.Author;
import com.horizonbit.bookstore.server.data.entities.Book;
import com.horizonbit.bookstore.server.data.entities.Genre;
import com.horizonbit.bookstore.server.data.exchange.ManageBookResultDetails;
import com.horizonbit.bookstore.server.data.exchange.ManageBookResultDto;
import com.horizonbit.bookstore.server.data.repositories.AuthorRepository;
import com.horizonbit.bookstore.server.data.repositories.BookRepository;
import com.horizonbit.bookstore.server.data.repositories.GenreRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;

@Service
public class BookService {

    private final Logger logger = LogManager.getLogger(BookService.class);

    private final BookRepository bookRepository;
    private final GenreRepository genreRepository;
    private final AuthorRepository authorRepository;

    @Autowired
    public BookService(BookRepository bookRepository, GenreRepository genreRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.genreRepository = genreRepository;
        this.authorRepository = authorRepository;
    }

    @Transactional
    public void saveBooks(Book... books) {
        for (Book book : books) {
            this.addBook(book);
        }
    }

    @Transactional
    public List<Book> findAll() {
        List<Book> all = bookRepository.findAll();
        Hibernate.initialize(all);
        return all;
    }

    @Transactional
    public ManageBookResultDto addBook(Book book) {
        if (bookRepository.existsByName(book.getName())) {
            return ManageBookResultDto.builder()
                    .details(ManageBookResultDetails.BOOK_EXISTS)
                    .build();
        }

        return saveBook(book);
    }

    public ManageBookResultDto updateBook(Book book) {
        return saveBook(book);
    }

    @Transactional
    private ManageBookResultDto saveBook(Book book) {
        try {
            List<Genre> genres = book.getGenres();
            for (Genre genre : genres) {
                if (!genreRepository.existsByName(genre.getName())) {
                    genreRepository.save(genre);
                }
            }

            List<Author> authors = book.getAuthors();
            for (Author author: authors) {
                if (authorRepository.existsByLastNameAndFirstNameAndMiddleName(
                        author.getLastName(), author.getLastName(), author.getMiddleName())) {
                    authorRepository.save(author);
                }
            }

            Book persisted = bookRepository.save(book);

            logger.debug("Old or not persisted book: " + book);
            logger.debug("New or persisted book: " + persisted);

            bookRepository.flush();

            return ManageBookResultDto.builder()
                    .books(Collections.singletonList(persisted))
                    .details(ManageBookResultDetails.SUCCESSFUL)
                    .build();
        } catch (Exception e) {
            logger.error(e);
            return ManageBookResultDto.builder()
                    .details(ManageBookResultDetails.FAILURE)
                    .build();
        }
    }
}
