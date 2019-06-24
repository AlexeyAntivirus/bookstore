package com.horizonbit.bookstore.server.data.exchange;


import com.horizonbit.bookstore.server.data.entities.Book;
import lombok.Builder;
import lombok.Data;
import lombok.Singular;

import java.util.List;

@Data
@Builder
public class ManageBookResultDto {
    private ManageBookResultDetails details;

    @Singular
    private List<Book> books;
}
